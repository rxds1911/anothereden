import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { sampleDiary } from "../../src/data/samples/diary.js"
import { mapAreas, storyEras } from "../../src/data/config.js"

const currentDir = dirname(fileURLToPath(import.meta.url))
const COLLECTION = "diary_entries"
const BATCH_SIZE = 20

function loadDotEnv(filePath) {
  if (!existsSync(filePath)) return
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!match || match[2].startsWith("#")) continue
    const value = match[2].replace(/^(['"])(.*)\1$/, "$2")
    if (process.env[match[1]] === undefined) process.env[match[1]] = value
  }
}

loadDotEnv(join(currentDir, ".env"))

const directusUrl = String(process.env.DIRECTUS_URL || `http://localhost:${process.env.DIRECTUS_PORT || 8055}`).replace(/\/+$/, "")
const adminEmail = process.env.DIRECTUS_ADMIN_EMAIL || "admin@anothereden.local"
const adminPassword = process.env.DIRECTUS_ADMIN_PASSWORD || "change-me-now"

async function request(path, options = {}) {
  const response = await fetch(`${directusUrl}${path}`, {
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.body === undefined ? {} : { "Content-Type": "application/json" })
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  })

  const text = await response.text()
  let payload = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = { raw: text }
    }
  }

  if (!response.ok) {
    const message = payload && payload.errors && payload.errors[0] && payload.errors[0].message
      ? payload.errors[0].message
      : `HTTP ${response.status}`
    const error = new Error(`${options.method || "GET"} ${path}: ${message}`)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

async function login() {
  const response = await request("/auth/login", {
    method: "POST",
    body: { email: adminEmail, password: adminPassword }
  })
  const token = response && response.data && response.data.access_token
  if (!token) throw new Error("Directus login did not return an access token")
  return token
}

async function ensureCollection(token) {
  try {
    await request(`/collections/${COLLECTION}`, { token })
    return
  } catch (error) {
    if (![403, 404].includes(error.status)) throw error
  }

  await request("/collections", {
    method: "POST",
    token,
    body: {
      collection: COLLECTION,
      meta: {
        icon: "menu_book",
        note: "猫咪日记：叙述、地点与时代",
        display_template: "{{narrative}}",
        accountability: "all",
        sort_field: "sort"
      },
      schema: { name: COLLECTION }
    }
  })
  console.log(`Created collection: ${COLLECTION}`)
}

function fieldDefinition(field, type, meta = {}, schema = {}) {
  return {
    field,
    type,
    meta: { interface: "input", width: "full", ...meta },
    schema: { is_nullable: true, ...schema }
  }
}

async function ensureFields(token) {
  const eraChoices = storyEras.map((value) => ({ text: value, value }))
  const areaChoices = mapAreas.map((value) => ({ text: value, value }))
  const fields = [
    fieldDefinition("status", "string", {
      interface: "select-dropdown",
      options: {
        choices: [
          { text: "已发布", value: "published" },
          { text: "草稿", value: "draft" },
          { text: "已归档", value: "archived" }
        ]
      },
      width: "half"
    }, { default_value: "published", is_nullable: false }),
    fieldDefinition("slug", "string", { width: "half" }, { is_nullable: false, is_unique: true }),
    fieldDefinition("narrative", "text", { interface: "input-multiline", width: "full" }, { is_nullable: false }),
    fieldDefinition("location", "string", { width: "half" }, { is_nullable: false }),
    fieldDefinition("area", "string", {
      interface: "select-dropdown",
      options: { choices: areaChoices },
      note: "导入时使用 Excel D 列，缺失时可在后台补充",
      width: "half"
    }, { is_nullable: true }),
    fieldDefinition("era", "string", {
      interface: "select-dropdown",
      options: { choices: eraChoices },
      width: "half"
    }, { is_nullable: false }),
    fieldDefinition("sort", "integer", { width: "half" }, { default_value: 0, is_nullable: false }),
    fieldDefinition("source_row", "integer", {
      note: "来源 Excel 中的行号，用于追溯和重新导入",
      width: "half"
    }, { is_nullable: true })
  ]

  for (const definition of fields) {
    try {
      await request(`/fields/${COLLECTION}/${definition.field}`, { token })
    } catch (error) {
      if (![403, 404].includes(error.status)) throw error
      await request(`/fields/${COLLECTION}`, {
        method: "POST",
        token,
        body: definition
      })
      console.log(`Created field: ${COLLECTION}.${definition.field}`)
    }
  }
}

async function ensurePublicReadPermission(token) {
  const query = new URLSearchParams({
    "filter[role][_null]": "true",
    "filter[collection][_eq]": COLLECTION,
    "filter[action][_eq]": "read",
    limit: "1"
  })
  const existing = await request(`/permissions?${query}`, { token })
  if (existing && Array.isArray(existing.data) && existing.data.length) return

  await request("/permissions", {
    method: "POST",
    token,
    body: {
      role: null,
      collection: COLLECTION,
      action: "read",
      permissions: {
        status: { _eq: "published" }
      },
      validation: {},
      presets: null,
      fields: ["*"]
    }
  })
  console.log("Enabled public read access for diary entries")
}

function databaseRecord(entry) {
  return {
    status: "published",
    slug: entry.slug,
    narrative: entry.name,
    location: entry.location,
    area: entry.area || null,
    era: entry.era,
    sort: entry.sort,
    source_row: entry.sourceRow
  }
}

function isDifferent(existing, next) {
  return Object.entries(next).some(([key, value]) => existing[key] !== value)
}

async function syncEntries(token) {
  const existingResponse = await request(
    `/items/${COLLECTION}?limit=-1&fields=id,status,slug,narrative,location,area,era,sort,source_row`,
    { token }
  )
  const existingEntries = Array.isArray(existingResponse.data) ? existingResponse.data : []
  const existingBySlug = new Map(existingEntries.map((entry) => [entry.slug, entry]))
  const creates = []
  const updates = []

  for (const entry of sampleDiary) {
    const next = databaseRecord(entry)
    const existing = existingBySlug.get(entry.slug)
    if (!existing) {
      creates.push(next)
    } else if (isDifferent(existing, next)) {
      updates.push({ id: existing.id, ...next })
    }
  }

  for (let index = 0; index < creates.length; index += BATCH_SIZE) {
    await request(`/items/${COLLECTION}`, {
      method: "POST",
      token,
      body: creates.slice(index, index + BATCH_SIZE)
    })
  }

  for (let index = 0; index < updates.length; index += BATCH_SIZE) {
    await request(`/items/${COLLECTION}`, {
      method: "PATCH",
      token,
      body: updates.slice(index, index + BATCH_SIZE)
    })
  }

  console.log(`Diary sync complete: ${creates.length} created, ${updates.length} updated, ${sampleDiary.length - creates.length - updates.length} unchanged`)
  console.log("Records removed from the source workbook are kept in Directus so they can be archived or reviewed manually.")
}

async function main() {
  console.log(`Connecting to Directus at ${directusUrl}`)
  const token = await login()
  await ensureCollection(token)
  await ensureFields(token)
  await ensurePublicReadPermission(token)
  await syncEntries(token)
  console.log(`Admin: ${directusUrl}/admin`)
}

main().catch((error) => {
  console.error(error.message)
  if (error.status) console.error(`HTTP status: ${error.status}`)
  process.exitCode = 1
})

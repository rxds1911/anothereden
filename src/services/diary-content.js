import { sampleDiary } from "../data/samples/diary.js"

const DIARY_COLLECTION = "diary_entries"

function normalizedBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "")
}

export function getDirectusUrl(env = import.meta.env) {
  return normalizedBaseUrl(env && env.VITE_DIRECTUS_URL)
}

export function mapDiaryRow(row, index = 0) {
  const sort = Number.isFinite(Number(row.sort)) ? Number(row.sort) : index + 1
  return {
    id: row.id,
    slug: row.slug || `cat-diary-${String(sort).padStart(3, "0")}`,
    name: String(row.narrative || row.name || "").trim(),
    location: String(row.location || "").trim(),
    area: String(row.area || "").trim(),
    era: String(row.era || "").trim(),
    sort
  }
}

export function buildDiaryRequestUrl(baseUrl) {
  const url = new URL(`${normalizedBaseUrl(baseUrl)}/items/${DIARY_COLLECTION}`)
  url.searchParams.set("fields", "id,slug,narrative,location,area,era,sort")
  url.searchParams.set("filter[status][_eq]", "published")
  url.searchParams.set("sort", "sort")
  url.searchParams.set("limit", "-1")
  return url
}

export async function fetchDiaryEntriesFromDirectus(baseUrl, options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch
  const response = await fetchImpl(buildDiaryRequestUrl(baseUrl), {
    headers: { Accept: "application/json" },
    signal: options.signal
  })

  if (!response.ok) {
    throw new Error(`Directus diary request failed with status ${response.status}`)
  }

  const payload = await response.json()
  if (!payload || !Array.isArray(payload.data)) {
    throw new Error("Directus diary response does not contain a data array")
  }

  return payload.data
    .map(mapDiaryRow)
    .filter((entry) => entry.name && entry.location && entry.era)
}

export async function loadDiaryEntries(options = {}) {
  const baseUrl = normalizedBaseUrl(options.baseUrl ?? getDirectusUrl(options.env))
  if (!baseUrl) {
    return { entries: sampleDiary, source: "static", fallbackReason: "" }
  }

  try {
    const entries = await fetchDiaryEntriesFromDirectus(baseUrl, options)
    return { entries, source: "directus", fallbackReason: "" }
  } catch (error) {
    if (error && error.name === "AbortError") throw error
    return {
      entries: sampleDiary,
      source: "fallback",
      fallbackReason: error instanceof Error ? error.message : "Directus request failed"
    }
  }
}

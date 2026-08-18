<template>
  <div class="detail-section guide-form-section">
    <div class="detail-section-header">
      <span class="icon">🔍</span> 攻略查找
      <button class="guide-header-btn" @click="toggleGuideForm">{{ showGuideForm ? '收起投稿' : '📤 投稿攻略' }}</button>
      <span class="guide-count">共 {{ filteredGuides.length }} 篇</span>
    </div>
    <div class="guide-toolbar">
      <div class="guide-search-box">
        <span class="search-icon">🔍</span>
        <input v-model="guideQuery" type="text" placeholder="搜索攻略标题或队伍角色..." class="guide-search-input" />
        <span v-if="guideQuery" class="search-clear" @click="guideQuery = ''">✕</span>
      </div>
    </div>
    <div v-if="vows.length" class="vow-filter">
      <span class="vow-filter-label">满足誓约</span>
      <span
        v-for="v in vows"
        :key="v"
        class="filter-chip"
        :class="{ active: filterVows.includes(v) }"
        @click="toggleVowFilter(v)"
      >{{ v }}</span>
    </div>
    <div v-if="showGuideForm" class="guide-form">
      <div class="guide-form-row">
        <label class="guide-form-label">攻略标题 <em>*</em></label>
        <input v-model="form.title" type="text" class="guide-form-input" placeholder="例如：无续关 3 回合速通" />
      </div>
      <div class="guide-form-row">
        <label class="guide-form-label">B站视频链接 <em>*</em></label>
        <div class="guide-form-url-row">
          <input v-model="form.url" type="text" class="guide-form-input" placeholder="https://www.bilibili.com/video/BV..." @input="titleHint = ''" @blur="autoFetchTitle" />
          <button type="button" class="guide-title-btn" @click="autoFetchTitle" :disabled="titleFetching">{{ titleFetching ? '获取中…' : '获取标题' }}</button>
        </div>
        <span v-if="titleHint" class="guide-form-title-hint" :class="titleHintOk ? 'guide-form-title-hint--ok' : 'guide-form-title-hint--error'">{{ titleHint }}</span>
      </div>
      <div class="guide-form-row">
        <label class="guide-form-label">前排角色（选填）</label>
        <div class="guide-form-slots">
          <searchable-select
            v-for="i in 4"
            :key="'front-' + i"
            v-model="form.front[i - 1]"
            :options="characterOptions"
            :placeholder="'选择角色 ' + i"
          ></searchable-select>
        </div>
      </div>
      <div class="guide-form-row">
        <label class="guide-form-label">后排角色（选填）</label>
        <div class="guide-form-slots">
          <searchable-select
            v-for="i in 2"
            :key="'back-' + i"
            v-model="form.back[i - 1]"
            :options="characterOptions"
            :placeholder="'选择角色 ' + i"
          ></searchable-select>
        </div>
      </div>
      <div class="guide-form-row">
        <label class="guide-form-label">搭档（选填）</label>
        <div class="guide-form-slots">
          <searchable-select
            v-for="i in 2"
            :key="'partner-' + i"
            v-model="form.partner[i - 1]"
            :options="partnerOptions"
            :placeholder="'选择搭档 ' + i"
          ></searchable-select>
        </div>
      </div>
      <div v-if="vows.length" class="guide-form-row">
        <label class="guide-form-label">满足誓约（可不选，可多选）</label>
        <div class="guide-form-vows">
          <label
            v-for="v in vows"
            :key="v"
            class="guide-vow-chip"
            :class="{ checked: form.vows.includes(v) }"
          >
            <input v-model="form.vows" type="checkbox" :value="v" class="guide-vow-checkbox" />
            {{ v }}
          </label>
        </div>
      </div>
      <div class="guide-form-actions">
        <button class="guide-submit" @click="submitGuide">提交攻略</button>
        <span class="guide-form-hint">前排至少选择 1 名角色，后排和搭档选填；不会真的上传视频，只保存 B 站视频链接</span>
      </div>
      <div v-if="formMessage" class="guide-form-msg" :class="formError ? 'guide-form-msg--error' : 'guide-form-msg--ok'">{{ formMessage }}</div>
    </div>
    <div v-if="filteredGuides.length" class="guide-list">
      <div v-for="g in filteredGuides" :key="g.id" class="guide-item">
        <div class="guide-info">
          <div class="guide-title">
            {{ g.title }}
            <span class="guide-badge" :class="'guide-badge--' + g.source">{{ g.source === 'builtin' ? '内置' : '用户投稿' }}</span>
          </div>
          <div v-if="g.vows && g.vows.length" class="guide-vows">
            <span v-for="v in g.vows" :key="v" class="vow-item">✓ {{ v }}</span>
          </div>
          <div v-if="g.source === 'user'" class="guide-meta">{{ formatDate(g.createdAt) }} 投稿</div>
        </div>
        <div class="guide-team">
          <span class="guide-team-label">前排</span>
          <template v-for="(name, i) in g.team.front" :key="'front-' + i">
            <span v-if="name" class="guide-avatar">
              <span class="guide-avatar-icon">{{ name[0] }}</span>
              <span class="guide-avatar-name">{{ name }}</span>
            </span>
          </template>
          <span class="guide-team-label">后排</span>
          <template v-for="(name, i) in g.team.back" :key="'back-' + i">
            <span v-if="name" class="guide-avatar">
              <span class="guide-avatar-icon">{{ name[0] }}</span>
              <span class="guide-avatar-name">{{ name }}</span>
            </span>
          </template>
          <span class="guide-team-label">搭档</span>
          <template v-for="(name, i) in g.team.partner" :key="'partner-' + i">
            <span v-if="name" class="guide-avatar">
              <span class="guide-avatar-icon">{{ name[0] }}</span>
              <span class="guide-avatar-name">{{ name }}</span>
            </span>
          </template>
        </div>
        <div class="guide-actions">
          <a class="guide-watch" :href="g.url" target="_blank" rel="noopener">▶ 观看</a>
          <button v-if="g.source === 'user'" class="guide-delete" @click="removeGuide(g)">删除</button>
        </div>
      </div>
    </div>
    <div v-else class="guide-empty">还没有符合条件的攻略，快来投稿第一篇吧～</div>
  </div>
</template>

<script>
import SearchableSelect from "./SearchableSelect.vue"
import { loadUserGuides, saveUserGuides, isValidBilibiliUrl } from "../data/battle-guides.js"
import { sampleCharacters } from "../data/samples/characters.js"
import { samplePartners } from "../data/samples/partner.js"

export default {
  name: "GuideSection",
  components: { SearchableSelect },
  props: {
    itemId: { type: [String, Number], required: true },
    itemName: { type: String, default: "" },
    builtinGuide: { type: Object, default: null },
    builtinGuides: { type: Array, default: () => [] },
    vows: { type: Array, default: () => [] }
  },
  data() {
    return {
      guides: [],
      guideQuery: "",
      filterVows: [],
      showGuideForm: false,
      titleFetching: false,
      titleHint: "",
      titleHintOk: true,
      characterOptions: sampleCharacters.map(c => c.name),
      partnerOptions: samplePartners.map(p => p.name),
      form: { title: "", url: "", front: ["", "", "", ""], back: ["", ""], partner: ["", ""], vows: [] },
      formMessage: "",
      formError: false
    }
  },
  computed: {
    filteredGuides() {
      let list = this.guides
      if (this.filterVows.length) {
        list = list.filter(g => this.filterVows.every(v => (g.vows || []).includes(v)))
      }
      if (this.guideQuery) {
        const q = this.guideQuery.toLowerCase()
        list = list.filter(g => {
          const members = [...(g.team.front || []), ...(g.team.back || []), ...(g.team.partner || []), ...(g.vows || []), g.title || '']
          return members.some(m => m && m.toString().toLowerCase().includes(q))
        })
      }
      return list
    }
  },
  methods: {
    loadGuides() {
      const rawList = [
        ...(Array.isArray(this.builtinGuides) ? this.builtinGuides : []),
        ...(this.builtinGuide ? [this.builtinGuide] : [])
      ]
      const builtins = rawList.map((raw, i) => ({
        id: 'builtin-' + this.itemId + '-' + i,
        title: raw.title || raw.videoTitle || `「${this.itemName}」示例攻略`,
        url: raw.url || raw.videoUrl,
        team: raw.team || { front: [], back: [], partner: [] },
        vows: Array.isArray(raw.vows) ? raw.vows : [],
        source: 'builtin',
        createdAt: ''
      }))
      const userGuides = loadUserGuides(this.itemId)
      return [...userGuides, ...builtins].sort((a, b) => {
        const sourceOrder = (x) => x.source === 'builtin' ? 1 : 0
        const diff = sourceOrder(a) - sourceOrder(b)
        return diff !== 0 ? diff : String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
      })
    },
    toggleVowFilter(v) {
      this.filterVows = this.filterVows.includes(v)
        ? this.filterVows.filter(x => x !== v)
        : [...this.filterVows, v]
    },
    formatDate(iso) {
      if (!iso) return ""
      try {
        return new Date(iso).toLocaleString("zh-CN", {
          year: "numeric", month: "2-digit", day: "2-digit",
          hour: "2-digit", minute: "2-digit", hour12: false
        })
      } catch {
        return ""
      }
    },
    toggleGuideForm() {
      this.showGuideForm = !this.showGuideForm
      this.formMessage = ""
      this.titleHint = ""
    },
    async autoFetchTitle() {
      if (this.titleFetching) return
      const url = (this.form.url || "").trim()
      const match = url.match(/BV[0-9A-Za-z]{10}/)
      if (!match) {
        this.titleHint = isValidBilibiliUrl(url)
          ? "该链接不含视频号（如 b23.tv 短链接），无法自动获取标题，请手动填写"
          : "请先粘贴有效的 B 站视频链接"
        this.titleHintOk = false
        return
      }
      this.titleFetching = true
      this.titleHint = ""
      try {
        const res = await fetch("/api/bilibili/view?bvid=" + encodeURIComponent(match[0]))
        const json = await res.json()
        if (json && json.code === 0 && json.data && json.data.title) {
          if (!this.form.title.trim()) {
            this.form.title = json.data.title
            this.titleHint = `已自动填入标题：${json.data.title}`
          } else {
            this.titleHint = `已获取标题：${json.data.title}（未覆盖已填写的标题）`
          }
          this.titleHintOk = true
        } else {
          this.titleHint = "自动获取标题失败，请手动填写"
          this.titleHintOk = false
        }
      } catch (error) {
        this.titleHint = "自动获取标题失败，请手动填写"
        this.titleHintOk = false
      } finally {
        this.titleFetching = false
      }
    },
    submitGuide() {
      this.formMessage = ""
      this.formError = false
      if (!isValidBilibiliUrl(this.form.url)) {
        this.formError = true
        this.formMessage = "请填写有效的 B 站视频链接，例如 https://www.bilibili.com/video/BV..."
        return
      }
      if (!this.form.title.trim()) {
        this.formError = true
        this.formMessage = "请填写攻略标题"
        return
      }
      if (!this.form.front.some(v => v)) {
        this.formError = true
        this.formMessage = "请至少选择 1 名前排角色"
        return
      }
      const guide = {
        id: 'user-' + Date.now(),
        title: this.form.title.trim(),
        url: this.form.url.trim(),
        team: {
          front: this.form.front.filter(v => v),
          back: this.form.back.filter(v => v),
          partner: this.form.partner.filter(v => v)
        },
        vows: [...this.form.vows],
        source: 'user',
        createdAt: new Date().toISOString()
      }
      const userGuides = loadUserGuides(this.itemId)
      userGuides.push(guide)
      saveUserGuides(this.itemId, userGuides)
      this.guides = this.loadGuides()
      this.form = { title: "", url: "", front: ["", "", "", ""], back: ["", ""], partner: ["", ""] }
      this.form.vows = []
      this.showGuideForm = false
      this.formMessage = ""
    },
    removeGuide(g) {
      if (!window.confirm(`确定删除攻略「${g.title}」吗？`)) return
      const userGuides = loadUserGuides(this.itemId).filter(x => x.id !== g.id)
      saveUserGuides(this.itemId, userGuides)
      this.guides = this.loadGuides()
    }
  },
  mounted() {
    this.guides = this.loadGuides()
  }
}
</script>

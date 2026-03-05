<script setup lang="ts">
import { useBangumiStore } from '@/stores/bangumi'
import SubjectCard from './SubjectCard.vue'
import { InlineObjectSortEnum, SubjectType, type InlineResponse2001 } from '@/api'
import type { ApiParams, TierItem } from '@/types'
import { useTierStore } from '@/stores/tier'

defineProps<{
  autofocus?: boolean
}>()
const emits = defineEmits<{
  cardClick: [subject: TierItem]
}>()

const {
  hasDuplicateInSelectedItems,
  hasDuplicateInAllItems,
  hasDuplicateInCurrentTier,
  hasDuplicateInRestItems
} = useTierStore()
const { searchSubject } = useBangumiStore()

const loading = ref(false)
const keyword = ref('')
const subjects = computed<TierItem[]>(() => response.value?.data || [])
const type = ref<SubjectType[]>([SubjectType.Anime])
// enum SubjectType转换为数组,条目类型 - 1 为 书籍 - 2 为 动画 - 3 为 音乐 - 4 为 游戏 - 6 为 三次元 没有 5
const typeArr = [
  { key: '动画', value: SubjectType.Anime },
  { key: '书籍', value: SubjectType.Book },
  { key: '音乐', value: SubjectType.Music },
  { key: '游戏', value: SubjectType.Game },
  { key: '三次元', value: SubjectType.Real }
]
const limit = 18
const offset = ref(0)
const page = ref(1)
const pageLength = computed<number>(() => {
  return Math.ceil((response.value?.total ?? 0) / (response.value?.limit ?? 1))
})
const onOnePage = computed(() => pageLength.value <= 1)
const searchParams = computed<ApiParams<'searchSubjects'>>(() => [
  limit,
  offset.value,
  {
    keyword: keyword.value,
    sort: InlineObjectSortEnum.Heat,
    filter: {
      type: type.value
    }
  }
])
const response = ref<InlineResponse2001>()
async function handleSearch() {
  response.value = undefined
  loading.value = true
  response.value = (await searchSubject(...searchParams.value)).data
  loading.value = false
}
// 初始化搜索
onBeforeMount(handleSearch)
// 类型选择改变时搜索
watch(type, handleSearch)
// 页码改变时搜索
watch(page, () => {
  offset.value = (page.value - 1) * limit
  handleSearch()
})
const transparent = 'rgba(255, 255, 255, 0)'
const primary = 'primary'
const btnColor = (hovering: boolean) => (hovering ? primary : transparent)

const inTier = (id: TierItem['id']): boolean => {
  return hasDuplicateInCurrentTier(id) || hasDuplicateInRestItems(id)
}
</script>
<template>
  <v-card class="px-4">
    <v-sheet class="">
      <v-card-item class="px-0">
        <template #prepend>
          <v-icon>mdi-cloud-search</v-icon>
        </template>
        <v-card-title>搜索</v-card-title>
      </v-card-item>
      <v-text-field
        v-model="keyword"
        label="关键字"
        @keypress.enter="handleSearch"
        :loading="loading"
        clearable
        :autofocus="autofocus"
        hide-details
        color="primary"
      ></v-text-field>
      <v-sheet class="d-flex">
        <v-checkbox
          v-model="type"
          :label="i.key"
          :value="i.value"
          v-for="i in typeArr"
          :key="i.key"
          hide-details
          color="primary"
        ></v-checkbox>
      </v-sheet>
      <v-sheet class="d-grid">
        <template v-for="i in 18" :key="i">
          <v-skeleton-loader v-if="loading" :class="{ border: loading }" type="card" height="200">
          </v-skeleton-loader>
        </template>
        <template v-for="subject in subjects" :key="subject.id">
          <v-hover v-slot="{ isHovering, props }">
            <SubjectCard
              v-bind="props"
              :subject="subject"
              :class="{
                'zoom-in': isHovering && !inTier(subject.id),
                'low-opacity': inTier(subject.id)
              }"
              :elevation="isHovering ? 12 : 1"
              :background-color="
                hasDuplicateInSelectedItems(subject.id) ? 'primary' : 'transparent'
              "
            >
              <template #overlay>
                <v-overlay
                  :model-value="!inTier(subject.id) && isHovering"
                  class="align-center justify-center"
                  scrim
                  contained
                >
                  <v-card-actions
                    class="h-100 justify-center"
                    v-if="!hasDuplicateInAllItems(subject.id)"
                  >
                    <v-btn
                      :class="{ 'show-background': isHovering }"
                      :color="btnColor(Boolean(isHovering))"
                      icon="mdi-plus-circle"
                      @click="emits('cardClick', subject)"
                    ></v-btn>
                  </v-card-actions>
                  <v-card-actions
                    class="h-100 justify-center"
                    v-else-if="hasDuplicateInSelectedItems(subject.id)"
                  >
                    <v-btn
                      class="show-background"
                      color="error"
                      icon="mdi-minus-circle"
                      @click="emits('cardClick', subject)"
                    ></v-btn>
                  </v-card-actions>
                </v-overlay>
              </template>
            </SubjectCard>
          </v-hover>
        </template>
      </v-sheet>
    </v-sheet>
    <v-spacer></v-spacer>
    <v-sheet class="mt-4" height="58">
      <v-pagination
        v-show="!onOnePage"
        v-model="page"
        :length="pageLength"
        color="primary"
        rounded="circle"
      ></v-pagination>
      <v-sheet v-show="onOnePage"></v-sheet>
    </v-sheet>
    <template #actions>
      <slot name="actions"></slot>
    </template>
  </v-card>
</template>
<style scoped>
.d-grid {
  display: grid;
  justify-content: space-around;
  grid-template-columns: repeat(auto-fill, 120px);
  grid-gap: 8px;
}

/* 卡片悬停 */
.v-card {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.zoom-in {
  transform: scale(1.2);
  z-index: 2;
}
.low-opacity {
  opacity: 0.5;
}
.show-background {
  background-color: white;
}
/* 已被选中 */
.is-selected {
  background-color: #f0f0f0;
}
</style>
@/stores/bangumi

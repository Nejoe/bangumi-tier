<script setup lang="ts">
import type { TierItem } from '@/types'

const BASE_IMG = 'https://lain.bgm.tv/img/no_icon_subject.png'
const props = defineProps<{
  size?: string
  subject: TierItem
  backgroundColor?: string
  tooltip?: boolean
}>()
const size = computed(() => props.size || 'medium')
const cardSize = computed<[number, number]>(() => {
  switch (size.value) {
    case 'small':
      return [60, 120]
    case 'medium':
      return [120, 200]
    case 'large':
      return [240, 360]
    case 'cover':
      return [80, 80]
    default:
      return [120, 200]
  }
})
const imgSize = computed<[number, number]>(() => {
  switch (size.value) {
    case 'small':
      return [60, 80]
    case 'medium':
      return [120, 160]
    case 'large':
      return [240, 320]
    case 'cover':
      return [80, 80]
    default:
      return [120, 160]
  }
})
const titleHeight = computed(() => cardSize.value[1] - imgSize.value[1])
</script>
<template>
  <v-card :width="cardSize[0]" :height="cardSize[1]">
    <v-img aspect-ratio="1" cover :height="imgSize[1]" :src="subject.image || BASE_IMG">
      <slot name="actions"></slot>
    </v-img>
    <v-sheet
      class="d-flex align-center"
      :style="`height: ${titleHeight}px;`"
      :color="backgroundColor"
    >
      <span class="text-center w-100 text-body-2 title px-1 font-weight-bold">
        {{ subject.name_cn || subject.name }}
      </span>
    </v-sheet>
    <slot name="overlay"></slot>
    <v-tooltip
      v-if="tooltip"
      activator="parent"
      :text="subject.name_cn || subject.name"
      location="bottom"
    >
    </v-tooltip>
  </v-card>
</template>
<style scoped>
/* 两行 */
.title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>

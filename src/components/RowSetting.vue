<script setup lang="ts">
import type { TierRow } from '@/types'

const props = defineProps<{
  row?: TierRow
}>()
const emits = defineEmits<{
  confirm: [row: TierRow]
  close: []
}>()
const input = props.row?.rowName ?? ''
const color = props.row?.rowColor ?? '#bfff7f'

// 颜色选择器的颜色,从红到绿共五个渐变颜色
const Swatches = [['#ff7f7f'], ['#ffbf7f'], ['#ffdf7f'], ['#FFFF7F'], ['#bfff7f']]
</script>
<template>
  <v-card prepend-icon="mdi-cog" title="行设置">
    <v-text-field
      class="mx-auto"
      label="行标题"
      v-model="input"
      width="350"
      clearable
    ></v-text-field>
    <v-color-picker
      v-model="color"
      :swatches="Swatches"
      class="mx-auto"
      show-swatches
      width="350"
    ></v-color-picker>
    <template #actions>
      <v-btn text="关闭" @click="emits('close')"></v-btn>
      <v-btn
        text="确定"
        @click="
          emits('confirm', {
            rowName: input,
            rowValues: row?.rowValues ?? [],
            rowColor: color
          })
        "
      ></v-btn>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { useTemplateStore } from '@/stores/template'
import type { TierTemplate } from '@/types'

defineProps<{
  templates: TierTemplate[]
}>()
const emits = defineEmits<{
  templateClick: [template: TierTemplate]
  templateAdd: []
  templateDelete: [templateID: string]
}>()
const templateStore = useTemplateStore()
const { decompress, compress } = templateStore
const { myTemplateIDs, currentTemplateID } = storeToRefs(templateStore)

const isCurrentTemplate = (id: string) => {
  return currentTemplateID.value === id
}
</script>
<template>
  <v-card>
    <v-card
      v-for="template in templates"
      :key="template.value?.toString()"
      class="mx-auto"
      :subtitle="`${template.value?.length ?? 0}个项目`"
      :title="template.title"
      :color="isCurrentTemplate(compress(template)) ? 'primary' : ''"
      @click="emits('templateClick', template)"
      link
    >
    </v-card>
    <template #actions>
      <v-btn
        text="删除选中"
        color="error"
        @click="emits('templateDelete', currentTemplateID)"
      ></v-btn>
      <v-spacer></v-spacer>
      <v-btn text="新增模板" @click="emits('templateAdd')"></v-btn>
    </template>
  </v-card>
</template>

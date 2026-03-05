<script setup lang="ts">
import { useTierStore } from '@/stores/tier'
import type { TierRow } from '@/types'
import draggable from 'vuedraggable'
import SubjectCard from './SubjectCard.vue'

const tierStore = useTierStore()
const { currentTier } = storeToRefs(tierStore)
const { deleteTierRow } = tierStore

const emits = defineEmits<{
  settingClick: [rowIndex: number, row: TierRow]
}>()
const rowDragOptions = {
  animation: 200,
  group: 'row',
  disabled: false,
  ghostClass: 'ghost'
}
const subjectDragOptions = {
  animation: 200,
  group: 'subject',
  disabled: false,
  ghostClass: 'ghost'
}
const drag = ref(false)
</script>
<template>
  <draggable
    :component-data="{
      type: 'transition-group'
    }"
    v-model="currentTier"
    v-bind="rowDragOptions"
    @start="drag = true"
    @end="drag = false"
    item-key="rowName"
    class="d-flex align-center flex-wrap"
  >
    <!-- 行 -->
    <template #item="{ element: row, index }">
      <v-sheet class="w-100 d-flex border-b" min-height="80" elevation="0">
        <v-sheet
          class="cursor-pointer d-flex justify-center align-center"
          @click="emits('settingClick', index, row)"
          :color="row.rowColor"
          min-width="100"
          width="100"
        >
          <div class="w-100 text-center">
            <span class="text-wrap">{{ row.rowName }}</span>
          </div>
        </v-sheet>
        <draggable
          :component-data="{
            type: 'transition-group'
          }"
          v-model="row.rowValues"
          v-bind="subjectDragOptions"
          @start="drag = true"
          @end="drag = false"
          item-key="id"
          class="w-100 d-flex align-center flex-wrap"
        >
          <template #item="{ element }">
            <SubjectCard :subject="element" size="cover" tooltip></SubjectCard>
          </template>
        </draggable>

        <!-- 删除面板 -->
        <v-sheet class="cursor-pointer d-flex justify-center align-center" color="error">
          <v-icon>mdi-delete</v-icon>
          <v-dialog activator="parent" max-width="340">
            <template #default="{ isActive }">
              <v-card
                prepend-icon="mdi-delete"
                :text="`确定删除此行？（不会删除此行项目）`"
                title="删除"
              >
                <template #actions>
                  <v-btn text="取消" @click="isActive.value = false"></v-btn>
                  <v-btn text="删除" color="error" @click="deleteTierRow(index)"></v-btn>
                </template>
              </v-card>
            </template>
          </v-dialog>
        </v-sheet>
      </v-sheet>
    </template>
  </draggable>
</template>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group-item {
  cursor: move;
}
</style>

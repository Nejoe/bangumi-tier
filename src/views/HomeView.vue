<script setup lang="ts">
import RowSetting from '@/components/RowSetting.vue'
import SearchPane from '@/components/SearchPane.vue'
import TierTable from '@/components/TierTable.vue'
import SubjectCard from '@/components/SubjectCard.vue'
import { useTierStore } from '@/stores/tier'
import type { TierItem, TierRow } from '@/types'
import draggable from 'vuedraggable'
import { useDisplay } from 'vuetify'
import { useTemplateStore } from '@/stores/template'
import { useHtml2Canvas } from 'vue3-html2canvas'

const { mobile } = useDisplay()
const tierStore = useTierStore()
const {
  editTierTitle,
  editTierRow,
  addTierRow,
  addSelectedItem,
  deleteSelectedItem,
  addSelectedItemsToRestItems,
  hasDuplicateInSelectedItems,
  hasDuplicateInAllItems,
  deleteRestItem
} = tierStore
const { tierTitle, restItems, selectedItems, currentTierTemplate } = storeToRefs(tierStore)

// 标题设置
const titleInputRef = ref()
const titleInput = ref('')
const inputVisible = ref(false)
const handleTitleClick = () => {
  titleInput.value = tierTitle.value
  inputVisible.value = true
  nextTick(() => {
    titleInputRef.value.focus()
  })
}
const handleChangeTitle = () => {
  if (!titleInput.value.trim()) {
    return
  }
  editTierTitle(titleInput.value)
  inputVisible.value = false
}

// 行设置
const editDialogVisible = ref(false)
const editIndex = ref<number>(-1)
const targetRow = ref<TierRow>()
const handleSetting = (index: number, row: TierRow) => {
  targetRow.value = row
  editIndex.value = index
  editDialogVisible.value = true
}

const drag = ref(false)
const subjectDragOptions = {
  animation: 200,
  group: 'subject',
  disabled: false,
  ghostClass: 'ghost'
}

// 搜索
const searchDialogVisible = ref(false)
const handleSearchPane = () => {
  searchDialogVisible.value = true
}
const handleConfirm = () => {
  addSelectedItemsToRestItems()
  searchDialogVisible.value = false
}
const handleClose = () => {
  // 通过函数循环删除可能删不干净
  for (const item of selectedItems.value) {
    deleteSelectedItem(item.id)
  }
  if (selectedItems.value.length) {
    handleClose()
  } else {
    searchDialogVisible.value = false
  }
}
const handleCardClick = (subject: TierItem) => {
  if (hasDuplicateInSelectedItems(subject.id)) {
    deleteSelectedItem(subject.id)
  } else if (hasDuplicateInAllItems(subject.id)) {
    console.log('已经在排行榜中')
  } else {
    addSelectedItem(subject)
  }
}

// 备选项
const isDeleting = ref(false)
const handleDeleteRestItem = (id: number) => {
  deleteRestItem(id)
}

// 模板
// const { decompress } = useTemplateStore()
// const { currentTemplateID } = storeToRefs(useTemplateStore())
// watchEffect(() => {
//   console.log(decompress(currentTemplateID.value), currentTemplateID.value)
// })

// 保存
const TableRef = ref()
const html2canvas = useHtml2Canvas()
const handleSave = async () => {
  const canvas = await html2canvas(TableRef.value, { type: 'dataURL', useCORS: true })
  console.log(TableRef.value.$el)

  const img = canvas
  const a = document.createElement('a')
  a.href = img
  a.download = tierTitle.value
  a.click()

  // html2canvas(TableRef.value.$el, { backgroundColor: '#ffffff', useCORS: true }).then((canvas) => {
  //   const img = canvas.toDataURL('image/png')
  //   const a = document.createElement('a')
  //   a.href = img
  //   a.download = tierTitle.value
  // a.click()
  // })
}
</script>

<template>
  <!-- <img ref="TableRef" src="https://lain.bgm.tv/pic/cover/l/23/5d/43558_ECoSc.jpg" /> -->
  <v-sheet class="mb-4 border-b" elevation="0">
    <v-sheet height="60" class="cursor-pointer d-flex align-center">
      <h1 v-show="!inputVisible" class="text-center w-100" @click="handleTitleClick">
        {{ tierTitle }}
      </h1>
      <v-text-field
        ref="titleInputRef"
        v-show="inputVisible"
        v-model="titleInput"
        @keypress.enter="handleChangeTitle"
        @blur="handleChangeTitle"
        placeholder="输入标题"
        hide-details
        clearable
      ></v-text-field>
    </v-sheet>
    <TierTable @settingClick="handleSetting" />
    <!-- 添加行 -->
    <v-btn
      @click="addTierRow({ rowName: '', rowValues: [], rowColor: '#BFFF7F' })"
      prepend-icon="mdi-plus"
      variant="text"
      text="新增一行"
      rounded="0"
      block
    >
    </v-btn>
  </v-sheet>
  <v-sheet class="d-flex flex-column ga-3">
    <!-- 搜索 -->
    <v-row justify="end" class="mx-1">
      <v-col cols="md-3" class="d-flex">
        <!-- 备选项 -->
        <v-switch v-model="isDeleting" label="删除模式" color="error" hide-details> </v-switch>
      </v-col>
      <v-col class="d-flex align-center justify-end">
        <v-btn
          @click="handleSearchPane"
          prepend-icon="mdi-cloud-search"
          color="primary"
          variant="flat"
          text="搜索"
        ></v-btn>
      </v-col>
    </v-row>

    <draggable
      :component-data="{
        type: 'transition-group'
      }"
      v-model="restItems"
      v-bind="subjectDragOptions"
      @start="drag = true"
      @end="drag = false"
      item-key="id"
      class="d-grid mb-4 mx-3"
    >
      <template #item="{ element }">
        <SubjectCard :subject="element" size="cover" elevation="4" tooltip>
          <template #overlay>
            <v-overlay
              :model-value="isDeleting"
              class="align-center justify-center"
              scrim
              contained
            >
              <v-btn
                class="show-background"
                color="error"
                icon="mdi-close-circle"
                @click="handleDeleteRestItem(element.id)"
              ></v-btn>
            </v-overlay>
          </template>
        </SubjectCard>
      </template>
    </draggable>
    <v-row v-if="!restItems.length" justify="center">
      <v-empty-state icon="$success">
        <template #media>
          <v-icon color="success"></v-icon>
        </template>

        <template #headline>
          <div class="text-h4">已完成</div>
        </template>

        <template #title>
          <div class="text-h6">{{ tierTitle }}</div>
        </template>

        <template #text>
          <div class="d-flex align-center text-medium-emphasis text-caption">
            点击下方分享模板或保存图片，或者点击左上方搜索按钮继续添加项目。
          </div>
        </template>
        <template #actions>
          <v-btn
            class="text-none"
            color="white"
            elevation="1"
            rounded="lg"
            size="small"
            text="分享模板"
            width="96"
          ></v-btn>

          <v-btn
            class="text-none"
            color="primary"
            elevation="1"
            rounded="lg"
            size="small"
            text="保存图片"
            width="96"
            @click="handleSave"
          ></v-btn>
        </template>
      </v-empty-state>
    </v-row>
  </v-sheet>

  <!-- 行设置面板 -->
  <v-dialog v-model="editDialogVisible" max-width="400">
    <template #default="{ isActive }">
      <RowSetting
        :row="targetRow"
        @confirm="(row) => editTierRow(editIndex, row).then(() => (isActive.value = false))"
        @close="isActive.value = false"
      />
    </template>
  </v-dialog>

  <!-- 搜索面板 -->
  <v-dialog v-model="searchDialogVisible" max-width="900" :fullscreen="mobile" persistent>
    <template #default>
      <SearchPane autofocus @card-click="handleCardClick">
        <template #actions>
          <v-btn text="关闭" @click="handleClose"></v-btn>
          <v-btn
            :text="`添加到模板${selectedItems.length ? `（${selectedItems.length}个）` : ''}`"
            color="primary"
            @click="handleConfirm"
          ></v-btn>
        </template>
      </SearchPane>
    </template>
  </v-dialog>
</template>
<style scoped>
.d-grid {
  display: grid;
  justify-content: space-around;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-gap: 8px;
}
.show-background {
  background-color: white;
}
</style>

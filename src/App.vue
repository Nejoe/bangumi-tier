<script setup lang="ts">
import TemplateList from './components/TemplateList.vue'
import { useTemplateStore } from './stores/template'
import { useTierStore } from './stores/tier'
import type { TierTemplate } from './types'
const links = [
  { text: '排行榜', to: { name: 'Home' } },
  { text: '关于', to: { name: 'About' } }
]

const templateStore = useTemplateStore()
const { deleteTemplate, addTemplate, compress } = templateStore
const { myTemplates, lock } = storeToRefs(templateStore)

const { resetTier, DefaultTier } = useTierStore()
// const {} = storeToRefs(useTierStore())
const handleTemplateDelete = (id: string) => {
  deleteTemplate(id).then(() => {
    resetTier()
  })
}
const handleTemplateAdd = () => {
  const template: TierTemplate = {
    title: new Date().toLocaleString(),
    value: [],
    rows: DefaultTier
  }
  addTemplate(compress(template))
}
const handleTemplateClick = (template: TierTemplate) => {
  lock.value = true
  resetTier(template).finally(() => {
    lock.value = false
  })
}
</script>

<template>
  <v-app id="inspire">
    <v-app-bar class="px-3" density="compact" flat>
      <!-- <v-avatar class="hidden-md-and-up" color="grey-darken-1" size="32"></v-avatar> -->

      <v-spacer></v-spacer>

      <v-tabs color="grey-darken-2">
        <v-tab v-for="link in links" :key="link.text" :text="link.text" :to="link.to"></v-tab>
      </v-tabs>
      <v-spacer></v-spacer>

      <!-- <v-avatar class="hidden-sm-and-down" color="grey-darken-1" size="32"></v-avatar> -->
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="12" md="2">
            <v-sheet rounded="lg">
              <!-- 左边 -->
              <TemplateList
                :templates="myTemplates"
                @template-delete="handleTemplateDelete"
                @template-add="handleTemplateAdd"
                @template-click="handleTemplateClick"
              ></TemplateList>
            </v-sheet>
          </v-col>

          <v-col cols="12" md="8">
            <v-sheet rounded="lg">
              <!-- 中间 -->
              <RouterView />
            </v-sheet>
          </v-col>

          <v-col cols="12" md="2">
            <v-sheet min-height="268" rounded="lg">
              <!-- 右边 -->
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>

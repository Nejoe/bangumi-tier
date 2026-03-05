import type { TierTemplate } from '@/types'
import { useTierStore } from './tier'

export const useTemplateStore = defineStore(
  'template',
  () => {
    const currentTemplateID = computed<string>(() => {
      const { currentTierTemplate } = storeToRefs(useTierStore())
      return compress(currentTierTemplate.value)
    })
    function compress(template: TierTemplate): string {
      const jsonOptions = JSON.stringify(template) // 将备选项信息转换为 JSON 格式的字符串
      const base64Options = btoa(encodeURIComponent(jsonOptions)) // 使用 btoa 函数进行 Base64 编码
      return base64Options
    }
    function decompress(code: string): TierTemplate {
      const jsonOptions = decodeURIComponent(atob(code)) // 解码 Base64 编码
      const options = JSON.parse(jsonOptions) // 将 JSON 字符串转换回原始备选项信息
      return options
    }

    // 防止点击列表，切换模板时，触发我的模板列表的更新
    const lock = ref(false)

    const myTemplateIDs = ref<string[]>([])
    // 当前模板id改变时，更新我的模板列表
    watch(
      () => currentTemplateID.value,
      (newID, oldID) => {
        if (lock.value) return
        if (myTemplateIDs.value.includes(oldID)) {
          myTemplateIDs.value.splice(myTemplateIDs.value.indexOf(oldID), 1, newID)
        }
      }
    )
    const deleteTemplate = async (id: string) => {
      myTemplateIDs.value.splice(myTemplateIDs.value.indexOf(id), 1)
    }
    const addTemplate = (compressValue: string) => {
      myTemplateIDs.value.push(compressValue)
    }
    const myTemplates = computed(() => myTemplateIDs.value.map(decompress))

    return {
      compress,
      decompress,
      currentTemplateID,
      myTemplateIDs,
      myTemplates,
      deleteTemplate,
      addTemplate,
      lock
    }
  },
  { persist: true }
)

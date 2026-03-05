import type { TierItem, TierRow, TierTableData, TierTemplate } from '@/types'
import { useBangumiStore } from './bangumi'

export const useTierStore = defineStore(
  'tier',
  () => {
    const tierTitle = ref<string>('排行榜')
    const editTierTitle = (title: string) => {
      tierTitle.value = title
    }
    const DefaultTier = [
      {
        rowName: 'S',
        rowValues: [],
        rowColor: '#ff7f7f'
      },
      {
        rowName: 'A',
        rowValues: [],
        rowColor: '#ffbf7f'
      },
      {
        rowName: 'B',
        rowValues: [],
        rowColor: '#ffdf7f'
      }
    ]
    const currentTier = ref<TierTableData>(DefaultTier)
    const currentTierRows = computed(() => {
      return currentTier.value?.map((row) => {
        return {
          rowName: row.rowName,
          rowValues: [],
          rowColor: row.rowColor
        }
      })
    })

    const editTierRow = async (rowIndex: number, row: TierRow) => {
      currentTier.value.splice(rowIndex, 1, row)
    }
    const deleteTierRow = async (rowIndex: number) => {
      // 删除行，但把行中的元素放回restItems
      const row = currentTier.value.splice(rowIndex, 1)[0]
      row.rowValues.forEach((item) => {
        restItems.value.push(item)
      })
    }
    const addTierRow = async (row: TierRow) => {
      currentTier.value.push(row)
    }
    const currentItems = computed<TierItem[]>(() => {
      return currentTier.value?.reduce((acc, row) => {
        return acc?.concat(row.rowValues)
      }, [] as TierItem[])
    })

    // 剩下的未加入tier的备选项
    const restItems = ref<TierItem[]>([])
    const deleteRestItem = (id: TierItem['id']): TierItem => {
      const index = restItems.value.findIndex((i) => i.id === id)
      if (index === -1) {
        throw new Error('项目不在列表中')
      }
      return restItems.value.splice(index, 1)[0]
    }

    // 搜索面板中选择的项
    const selectedItems = ref<TierItem[]>([])
    const addSelectedItem = (item: TierItem) => {
      if (selectedItems.value.find((i) => i.id === item.id)) {
        throw new Error('项目已经在列表中')
      }
      selectedItems.value.push(item)
    }
    const deleteSelectedItem = (id: TierItem['id']): TierItem => {
      const index = selectedItems.value.findIndex((i) => i.id === id)
      if (index === -1) {
        throw new Error('项目不在列表中')
      }
      return selectedItems.value.splice(index, 1)[0]
    }

    const addSelectedItemsToRestItems = () => {
      selectedItems.value.forEach((item) => {
        if (!restItems.value.find((i) => i.id === item.id)) {
          restItems.value.push(item)
        }
      })
      selectedItems.value.splice(0, selectedItems.value.length)
    }

    // 获取当前排行榜、备选项和已选择的所有项目
    const allItems = computed(() => {
      return currentItems.value.concat(restItems.value).concat(selectedItems.value)
    })
    const hasDuplicateItem = (id: TierItem['id'], items: TierItem[]) => {
      return items.some((item) => item.id === id)
    }
    const hasDuplicateInCurrentTier = (id: TierItem['id']) => {
      return hasDuplicateItem(id, currentItems.value)
    }
    const hasDuplicateInRestItems = (id: TierItem['id']) => {
      return hasDuplicateItem(id, restItems.value)
    }
    const hasDuplicateInSelectedItems = (id: TierItem['id']) => {
      return hasDuplicateItem(id, selectedItems.value)
    }
    const hasDuplicateInAllItems = (id: TierItem['id']) => {
      return hasDuplicateItem(id, allItems.value)
    }

    // 模板
    const templateItems = computed(() => {
      return currentItems.value?.concat(restItems.value)
    })
    const templateItemsID = computed(() => {
      return templateItems.value?.map((item) => item.id)
    })
    const currentTierTemplate = computed<TierTemplate>(() => {
      return {
        title: tierTitle.value,
        value: templateItemsID.value?.sort((a, b) => a - b),
        rows: currentTierRows.value
      }
    })

    // 重置排行榜, 重置时可以传入模板
    const resetTier = async (template?: TierTemplate) => {
      if (template) {
        tierTitle.value = template.title
        currentTier.value = template.rows

        const { getSubjectById } = useBangumiStore()
        const promises = template.value.map((id) => {
          return getSubjectById(id)
        })
        await Promise.all(promises)
          .then((items) => {
            const newItems: TierItem[] = items.map((item) => {
              return {
                image: item.data.images.large,
                score: item.data.rating.score,
                rank: item.data.rating.rank,
                date: item.data.date ?? '',
                ...item.data
              }
            })
            restItems.value.splice(0, restItems.value.length, ...newItems)
          })
          .catch((e) => {
            console.error(e)
          })
          .finally(() => {
            selectedItems.value.splice(0, selectedItems.value.length)
          })
        return
      }
      tierTitle.value = '排行榜'
      currentTier.value = DefaultTier
      restItems.value.splice(0, restItems.value.length)
      selectedItems.value.splice(0, selectedItems.value.length)
    }
    return {
      DefaultTier,
      tierTitle,
      editTierTitle,
      currentTier,
      resetTier,
      editTierRow,
      deleteTierRow,
      addTierRow,
      restItems,
      selectedItems,
      deleteRestItem,
      addSelectedItem,
      deleteSelectedItem,
      addSelectedItemsToRestItems,
      hasDuplicateInCurrentTier,
      hasDuplicateInRestItems,
      hasDuplicateInSelectedItems,
      hasDuplicateInAllItems,
      currentTierTemplate
    }
  },
  { persist: true }
)

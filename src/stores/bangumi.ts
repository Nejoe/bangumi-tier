import { DefaultApi } from '@/api'
import type { ApiParams, SearchResults } from '@/types'

/**
 * 项目类型
 * 1 为 书籍
 * 2 为 动画
 * 3 为 音乐
 * 4 为 游戏z
 * 6 为 三次元
 * 没有 5
 **/
export const useBangumiStore = defineStore('bangumi', () => {
  const DefaultApiFactory = () => new DefaultApi()
  const api = DefaultApiFactory()

  const searchSubjectByKeywords = async (...arg: ApiParams<'searchSubjectByKeywords'>) => {
    return api.searchSubjectByKeywords(...arg)
  }

  const searchSubject = async (...arg: ApiParams<'searchSubjects'>) => {
    return api.searchSubjects(...arg)
  }

  const getSubjectById = async (...arg: ApiParams<'getSubjectById'>) => {
    return api.getSubjectById(...arg)
  }
  return { searchSubjectByKeywords, searchSubject, getSubjectById }
})

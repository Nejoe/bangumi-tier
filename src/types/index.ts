import type {
  DefaultApiFactory,
  InlineResponse2001Data,
  LegacySubjectLarge,
  LegacySubjectMedium,
  LegacySubjectSmall
} from '@/api'

export type TierTableData = TierRow[]
export interface TierRow {
  rowName: string
  rowValues: TierItem[]
  rowColor?: string
}

export interface TierTemplate {
  title: string
  value: number[]
  rows: TierRow[]
}

export type TierItem = InlineResponse2001Data

type ApiFunction = ReturnType<typeof DefaultApiFactory>
export type ApiParams<K extends keyof ApiFunction> = Parameters<ApiFunction[K]>

export interface SearchResults {
  results: number
  list: LegacySubjectSmall[] | LegacySubjectMedium[] | LegacySubjectLarge[]
}

import { createContext, useContext } from 'react'
import { SchemaMutationMethods } from './types'
import type { useAdvancedModal } from './AdvancedModal'

export const MutationContext = createContext<SchemaMutationMethods | null>(null)
export const useMutationContext = () => useContext(MutationContext) as SchemaMutationMethods

type ShowAdvancedModal = ReturnType<typeof useAdvancedModal>['showAdvancedModal']

export const AdvancedModalContext = createContext<ShowAdvancedModal>(() => void 0)
export const useAdvancedModalContext = () => useContext(AdvancedModalContext)

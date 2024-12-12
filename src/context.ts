import { createContext, useContext } from 'react'
import { SchemaMutationMethods } from './types'

export const MutationContext = createContext<SchemaMutationMethods | null>(null)
export const useMutationContext = () => useContext(MutationContext) as SchemaMutationMethods

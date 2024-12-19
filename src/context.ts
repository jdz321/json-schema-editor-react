import { createContext, useContext, type ComponentType } from 'react'
import { JSONSchema, SchemaMutationMethods, TextEditorProps, DefinitionsProvider } from './types'
import type { useAdvancedModal } from './AdvancedModal'

export const MutationContext = createContext<SchemaMutationMethods | null>(null)
export const useMutationContext = () => useContext(MutationContext) as SchemaMutationMethods

type ShowAdvancedModal = ReturnType<typeof useAdvancedModal>['showAdvancedModal']

export const AdvancedModalContext = createContext<ShowAdvancedModal>(() => void 0)
export const useAdvancedModalContext = () => useContext(AdvancedModalContext)

interface EditorContextType extends SchemaMutationMethods {
  TextEditor: ComponentType<TextEditorProps>;
  showAdvancedModal: ShowAdvancedModal;
  definitions?: JSONSchema['definitions'];
  customFormat?: string[];
  definitionsProvider?: DefinitionsProvider;
}

export const EditorContext = createContext({} as EditorContextType)
export const useEditorContext = () => useContext(EditorContext)

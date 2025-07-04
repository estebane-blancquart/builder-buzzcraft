// =============================================================================
// HOOK - SÉLECTION ACTIONS (RESPONSABILITÉ UNIQUE)
// =============================================================================

import { useCallback } from 'react';
import { useBuilderDispatch } from '../context/BuilderContext';
import { uiActions } from '../store';
import type { Selection } from '../types';

// =============================================================================
// TYPES ACTIONS
// =============================================================================

export interface SelectionActions {
  readonly setSelection: (selection: Partial<Selection>) => void;
  readonly clearSelection: () => void;
  readonly selectPage: (pageId: string) => void;
  readonly selectModule: (pageId: string, moduleId: string) => void;
  readonly selectComponent: (pageId: string, moduleId: string, componentId: string) => void;
}

// =============================================================================
// HOOK ACTIONS (MEMOIZED CALLBACKS)
// =============================================================================

export function useSelectionActions(): SelectionActions {
  const dispatch = useBuilderDispatch();
  
  // Actions memoized pour éviter re-renders enfants
  const setSelection = useCallback((selection: Partial<Selection>) => {
    // Conversion sûre avec valeurs par défaut
    const safeSelection: Selection = {
      pageId: selection.pageId ?? null,
      moduleId: selection.moduleId ?? null,
      componentId: selection.componentId ?? null,
    };
    dispatch(uiActions.setSelection(safeSelection));
  }, [dispatch]);
  
  const clearSelection = useCallback(() => {
    dispatch(uiActions.clearSelection());
  }, [dispatch]);
  
  const selectPage = useCallback((pageId: string) => {
    const selection: Selection = { 
      pageId, 
      moduleId: null, 
      componentId: null 
    };
    dispatch(uiActions.setSelection(selection));
  }, [dispatch]);
  
  const selectModule = useCallback((pageId: string, moduleId: string) => {
    const selection: Selection = { 
      pageId, 
      moduleId, 
      componentId: null 
    };
    dispatch(uiActions.setSelection(selection));
  }, [dispatch]);
  
  const selectComponent = useCallback((pageId: string, moduleId: string, componentId: string) => {
    const selection: Selection = { 
      pageId, 
      moduleId, 
      componentId 
    };
    dispatch(uiActions.setSelection(selection));
  }, [dispatch]);
  
  return {
    setSelection,
    clearSelection,
    selectPage,
    selectModule,
    selectComponent,
  };
}

// =============================================================================
// HOOK CALLBACKS OPTIMISÉS (ÉVITE RE-RENDERS)
// =============================================================================

export function useSelectionCallbacks() {
  const actions = useSelectionActions();
  
  // Callbacks stables pour composants enfants
  return {
    onPageSelect: actions.selectPage,
    onModuleSelect: actions.selectModule,
    onComponentSelect: actions.selectComponent,
    onClearSelection: actions.clearSelection,
  };
}
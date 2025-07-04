// =============================================================================
// HOOKS - SÉLECTION OPTIMISÉE ET PURE (ENHANCED)
// =============================================================================

import { useMemo } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { 
  selectSelection, 
  selectCurrentSelection,
  selectCanNavigateUp,
  selectCanNavigateDown,
  selectModulesForPage,
  selectComponentsForModule,
  selectAllPages 
} from '../store';
import { uiActions } from '../store';

// =============================================================================
// TYPES POUR HOOK DE SÉLECTION (ENHANCED)
// =============================================================================

export interface SelectionState {
  readonly pageId: string | null;
  readonly moduleId: string | null;
  readonly componentId: string | null;
}

export interface SelectionActions {
  readonly setSelection: (selection: Partial<SelectionState>) => void;
  readonly clearSelection: () => void;
  readonly selectPage: (pageId: string) => void;
  readonly selectModule: (pageId: string, moduleId: string) => void;
  readonly selectComponent: (pageId: string, moduleId: string, componentId: string) => void;
  readonly navigateUp: () => void;
  readonly navigateDown: () => void;
  readonly navigateNext: () => void;
  readonly navigatePrevious: () => void;
}

export interface SelectionHelpers {
  readonly isPageSelected: (pageId: string) => boolean;
  readonly isModuleSelected: (moduleId: string) => boolean;
  readonly isComponentSelected: (componentId: string) => boolean;
  readonly hasSelection: () => boolean;
  readonly getSelectionLevel: () => 'none' | 'page' | 'module' | 'component';
  readonly getSelectionPath: () => readonly string[];
  readonly getSelectableChildren: () => readonly string[];
  readonly getCurrentIndex: () => number;
  readonly getSiblings: () => readonly string[];
}

export interface SelectionCapabilities {
  readonly canNavigateUp: boolean;
  readonly canNavigateDown: boolean;
  readonly canNavigateNext: boolean;
  readonly canNavigatePrevious: boolean;
  readonly canEdit: boolean;
  readonly canDelete: boolean;
}

export interface UseSelectionReturn {
  // État actuel
  readonly selection: SelectionState;
  readonly currentSelection: ReturnType<typeof selectCurrentSelection>;
  
  // Actions
  readonly actions: SelectionActions;
  
  // Helpers
  readonly helpers: SelectionHelpers;
  
  // Capabilities
  readonly capabilities: SelectionCapabilities;
}

// =============================================================================
// HOOK DE SÉLECTION OPTIMISÉ (ENHANCED)
// =============================================================================

export function useSelection(): UseSelectionReturn {
  const { state, dispatch } = useBuilder();
  
  // =============================================================================
  // SELECTORS MEMOIZED (PERFORMANCE)
  // =============================================================================
  
  const selection = useMemo(() => selectSelection(state), [state]);
  const currentSelection = useMemo(() => selectCurrentSelection(state), [state]);
  const canNavigateUp = useMemo(() => selectCanNavigateUp(state), [state]);
  const canNavigateDown = useMemo(() => selectCanNavigateDown(state), [state]);
  
  // Selectors pour navigation
  const allPages = useMemo(() => selectAllPages(state), [state]);
  
  const modulesForCurrentPage = useMemo(() => 
    selection.pageId ? selectModulesForPage(state)(selection.pageId) : []
  , [state, selection.pageId]);
  
  const componentsForCurrentModule = useMemo(() => 
    selection.moduleId ? selectComponentsForModule(state)(selection.moduleId) : []
  , [state, selection.moduleId]);
  
  // =============================================================================
  // NAVIGATION HELPERS (MEMOIZED)
  // =============================================================================
  
  const navigationHelpers = useMemo(() => {
    const getCurrentIndex = (): number => {
      if (selection.componentId) {
        return componentsForCurrentModule.findIndex(c => c.id === selection.componentId);
      } else if (selection.moduleId) {
        return modulesForCurrentPage.findIndex(m => m.id === selection.moduleId);
      } else if (selection.pageId) {
        return allPages.findIndex(p => p.id === selection.pageId);
      }
      return -1;
    };
    
    const getSiblings = (): readonly string[] => {
      if (selection.componentId) {
        return componentsForCurrentModule.map(c => c.id);
      } else if (selection.moduleId) {
        return modulesForCurrentPage.map(m => m.id);
      } else if (selection.pageId) {
        return allPages.map(p => p.id);
      }
      return [];
    };
    
    const getSelectableChildren = (): readonly string[] => {
      if (selection.pageId && !selection.moduleId) {
        return modulesForCurrentPage.map(m => m.id);
      } else if (selection.moduleId && !selection.componentId) {
        return componentsForCurrentModule.map(c => c.id);
      }
      return [];
    };
    
    return {
      getCurrentIndex,
      getSiblings,
      getSelectableChildren,
    };
  }, [selection, allPages, modulesForCurrentPage, componentsForCurrentModule]);
  
  // =============================================================================
  // CAPABILITIES MEMOIZED
  // =============================================================================
  
  const capabilities = useMemo((): SelectionCapabilities => {
    const siblings = navigationHelpers.getSiblings();
    const currentIndex = navigationHelpers.getCurrentIndex();
    
    return {
      canNavigateUp,
      canNavigateDown,
      canNavigateNext: currentIndex < siblings.length - 1,
      canNavigatePrevious: currentIndex > 0,
      canEdit: selection.pageId !== null,
      canDelete: selection.pageId !== null,
    };
  }, [canNavigateUp, canNavigateDown, navigationHelpers, selection.pageId]);
  
  // =============================================================================
  // ACTIONS MEMOIZED (ENHANCED NAVIGATION)
  // =============================================================================
  
  const actions = useMemo((): SelectionActions => ({
    setSelection: (selection) => dispatch(uiActions.setSelection(selection)),
    clearSelection: () => dispatch(uiActions.clearSelection()),
    selectPage: (pageId) => dispatch(uiActions.selectPage(pageId)),
    selectModule: (pageId, moduleId) => dispatch(uiActions.selectModule(pageId, moduleId)),
    selectComponent: (pageId, moduleId, componentId) => dispatch(uiActions.selectComponent(pageId, moduleId, componentId)),
    
    navigateUp: () => {
      if (selection.componentId) {
        // Composant → Module
        dispatch(uiActions.setSelection({
          pageId: selection.pageId,
          moduleId: selection.moduleId,
          componentId: null,
        }));
      } else if (selection.moduleId) {
        // Module → Page
        dispatch(uiActions.setSelection({
          pageId: selection.pageId,
          moduleId: null,
          componentId: null,
        }));
      } else if (selection.pageId) {
        // Page → Aucune sélection
        dispatch(uiActions.clearSelection());
      }
    },
    
    navigateDown: () => {
      const children = navigationHelpers.getSelectableChildren();
      
      if (children.length > 0) {
        if (selection.pageId && !selection.moduleId) {
          // Page → Premier module
          const firstModuleId = children[0];
          dispatch(uiActions.setSelection({
            pageId: selection.pageId,
            moduleId: firstModuleId,
            componentId: null,
          }));
        } else if (selection.moduleId && !selection.componentId) {
          // Module → Premier composant
          const firstComponentId = children[0];
          dispatch(uiActions.setSelection({
            pageId: selection.pageId,
            moduleId: selection.moduleId,
            componentId: firstComponentId,
          }));
        }
      }
    },
    
    navigateNext: () => {
      const siblings = navigationHelpers.getSiblings();
      const currentIndex = navigationHelpers.getCurrentIndex();
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < siblings.length) {
        const nextId = siblings[nextIndex];
        
        if (selection.componentId) {
          // Prochain composant dans le module
          dispatch(uiActions.setSelection({
            pageId: selection.pageId,
            moduleId: selection.moduleId,
            componentId: nextId,
          }));
        } else if (selection.moduleId) {
          // Prochain module dans la page
          dispatch(uiActions.setSelection({
            pageId: selection.pageId,
            moduleId: nextId,
            componentId: null,
          }));
        } else if (selection.pageId) {
          // Prochaine page
          dispatch(uiActions.setSelection({
            pageId: nextId,
            moduleId: null,
            componentId: null,
          }));
        }
      }
    },
    
    navigatePrevious: () => {
      const siblings = navigationHelpers.getSiblings();
      const currentIndex = navigationHelpers.getCurrentIndex();
      const prevIndex = currentIndex - 1;
      
      if (prevIndex >= 0) {
        const prevId = siblings[prevIndex];
        
        if (selection.componentId) {
          // Composant précédent dans le module
          dispatch(uiActions.setSelection({
            pageId: selection.pageId,
            moduleId: selection.moduleId,
            componentId: prevId,
          }));
        } else if (selection.moduleId) {
          // Module précédent dans la page
          dispatch(uiActions.setSelection({
            pageId: selection.pageId,
            moduleId: prevId,
            componentId: null,
          }));
        } else if (selection.pageId) {
          // Page précédente
          dispatch(uiActions.setSelection({
            pageId: prevId,
            moduleId: null,
            componentId: null,
          }));
        }
      }
    },
  }), [dispatch, selection, navigationHelpers]);
  
  // =============================================================================
  // HELPERS MEMOIZED (ENHANCED API)
  // =============================================================================
  
  const helpers = useMemo((): SelectionHelpers => ({
    isPageSelected: (pageId: string) => selection.pageId === pageId,
    isModuleSelected: (moduleId: string) => selection.moduleId === moduleId,
    isComponentSelected: (componentId: string) => selection.componentId === componentId,
    hasSelection: () => !!(selection.pageId || selection.moduleId || selection.componentId),
    
    getSelectionLevel: () => {
      if (selection.componentId) return 'component';
      if (selection.moduleId) return 'module';
      if (selection.pageId) return 'page';
      return 'none';
    },
    
    getSelectionPath: () => {
      const path: string[] = [];
      if (selection.pageId) path.push(selection.pageId);
      if (selection.moduleId) path.push(selection.moduleId);
      if (selection.componentId) path.push(selection.componentId);
      return path;
    },
    
    getSelectableChildren: navigationHelpers.getSelectableChildren,
    getCurrentIndex: navigationHelpers.getCurrentIndex,
    getSiblings: navigationHelpers.getSiblings,
  }), [selection, navigationHelpers]);
  
  // =============================================================================
  // RETURN HOOK
  // =============================================================================
  
  return {
    // État
    selection,
    currentSelection,
    
    // API
    actions,
    helpers,
    capabilities,
  };
}

// =============================================================================
// HOOKS SPÉCIALISÉS (PERFORMANCE + SIMPLICITÉ)
// =============================================================================

// Hook pour sélection simple (performance optimisée)
export function useSelectionState(): SelectionState {
  const { state } = useBuilder();
  return useMemo(() => selectSelection(state), [state]);
}

// Hook pour actions seulement
export function useSelectionActions(): SelectionActions {
  const fullHook = useSelection();
  return fullHook.actions;
}

// Hook pour vérifications de sélection (performance)
export function useSelectionChecks() {
  const selection = useSelectionState();
  
  return useMemo(() => ({
    isPageSelected: (pageId: string) => selection.pageId === pageId,
    isModuleSelected: (moduleId: string) => selection.moduleId === moduleId,  
    isComponentSelected: (componentId: string) => selection.componentId === componentId,
    hasAnySelection: !!(selection.pageId || selection.moduleId || selection.componentId),
    hasPageSelection: !!selection.pageId,
    hasModuleSelection: !!selection.moduleId,
    hasComponentSelection: !!selection.componentId,
  }), [selection]);
}

// Hook pour callbacks optimisés (évite re-renders enfants)
export function useSelectionCallbacks() {
  const { dispatch } = useBuilder();
  
  return useMemo(() => ({
    onPageSelect: (pageId: string) => dispatch(uiActions.selectPage(pageId)),
    onModuleSelect: (pageId: string, moduleId: string) => dispatch(uiActions.selectModule(pageId, moduleId)),
    onComponentSelect: (pageId: string, moduleId: string, componentId: string) => 
      dispatch(uiActions.selectComponent(pageId, moduleId, componentId)),
    onClearSelection: () => dispatch(uiActions.clearSelection()),
  }), [dispatch]);
}

// =============================================================================
// HOOK POUR CUSTOM SELECTION LOGIC (EXTENSIBLE)
// =============================================================================

export function useSelectionWithCustomLogic<T>(
  selector: (selection: SelectionState, state: any) => T,
  deps: readonly unknown[] = []
): T {
  const { state } = useBuilder();
  const selection = useSelectionState();
  
  return useMemo(
    () => selector(selection, state),
    [selection, state, ...deps]
  );
}

// =============================================================================
// EXPORT LEGACY (COMPATIBILITY)
// =============================================================================

// Export du hook principal sous l'ancien nom pour compatibilité
export { useSelection as useSelectionLegacy };
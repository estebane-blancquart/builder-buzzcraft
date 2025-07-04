// =============================================================================
// HOOK - SÉLECTION FACADE (COMPOSITION SIMPLE)
// =============================================================================

import { 
  useSelectionState, 
  useSelectionInfo, 
  useSelectionChecks,
  type SelectionLevel 
} from './useSelectionState';
import { 
  useSelectionActions,
  type SelectionActions 
} from './useSelectionActions';
import { 
  useNavigationCapabilities,
  useNavigationActions,
  useNavigationInfo,
  type NavigationCapabilities,
  type NavigationActions,
  type NavigationInfo 
} from './useSelectionNavigation';
import type { Selection } from '../types';

// =============================================================================
// TYPES FACADE
// =============================================================================

export interface UseSelectionReturn {
  // État (read-only)
  readonly state: Selection;
  readonly info: SelectionLevel;
  readonly checks: ReturnType<typeof useSelectionChecks>;
  
  // Actions
  readonly actions: SelectionActions;
  
  // Navigation
  readonly navigation: {
    readonly capabilities: NavigationCapabilities;
    readonly actions: NavigationActions;
    readonly info: NavigationInfo;
  };
}

// =============================================================================
// HOOK PRINCIPAL (FACADE SIMPLE)
// =============================================================================

export function useSelection(): UseSelectionReturn {
  // État
  const state = useSelectionState();
  const info = useSelectionInfo();
  const checks = useSelectionChecks();
  
  // Actions
  const actions = useSelectionActions();
  
  // Navigation
  const navigationCapabilities = useNavigationCapabilities();
  const navigationActions = useNavigationActions();
  const navigationInfo = useNavigationInfo();
  
  return {
    // État (immutable)
    state,
    info,
    checks,
    
    // Actions
    actions,
    
    // Navigation (groupé)
    navigation: {
      capabilities: navigationCapabilities,
      actions: navigationActions,
      info: navigationInfo,
    },
  };
}

// =============================================================================
// EXPORTS INDIVIDUELS (PERFORMANCE)
// =============================================================================

// Pour composants qui n'ont besoin que d'une partie
export { 
  useSelectionState,
  useSelectionInfo,
  useSelectionChecks,
  useSelectionActions,
  useNavigationCapabilities,
  useNavigationActions,
  useNavigationInfo
};

// Types
export type {
  SelectionLevel,
  SelectionActions,
  NavigationCapabilities,
  NavigationActions,
  NavigationInfo
};

// Type du core (pour éviter les imports multiples)
export type { Selection } from '../types';
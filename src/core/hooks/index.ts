// =============================================================================
// HOOKS - EXPORTS CENTRALISÉS (ARCHITECTURE PROPRE)
// =============================================================================

// Hook principal (facade)
export { useSelection } from './useSelection';

// Hooks granulaires pour performance
export { 
  useSelectionState,
  useSelectionInfo, 
  useSelectionChecks 
} from './useSelectionState';

export { 
  useSelectionActions,
  useSelectionCallbacks 
} from './useSelectionActions';

export { 
  useNavigationCapabilities,
  useNavigationActions,
  useNavigationInfo 
} from './useSelectionNavigation';

// Types centralisés
export type { 
  SelectionLevel 
} from './useSelectionState';

export type { 
  SelectionActions 
} from './useSelectionActions';

export type { 
  NavigationCapabilities,
  NavigationActions,
  NavigationInfo 
} from './useSelectionNavigation';

export type { 
  UseSelectionReturn 
} from './useSelection';

// Types du core (pour éviter les imports multiples)
export type { Selection } from '../types';

// =============================================================================
// FUTURE HOOKS (PRÊTS POUR EXTENSION)
// =============================================================================

// TODO: Hooks métier à ajouter
// export { useEditor } from './useEditor';
// export { useDragDrop } from './useDragDrop';
// export { useKeyboard } from './useKeyboard';
// export { useValidation } from './useValidation';
// export { useHistory } from './useHistory';
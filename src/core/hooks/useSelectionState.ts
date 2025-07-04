// =============================================================================
// HOOK - SÉLECTION STATE (RESPONSABILITÉ UNIQUE)
// =============================================================================

import { useMemo } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { selectSelection, selectCurrentSelection } from '../store';
import type { Selection } from '../types';

// =============================================================================
// TYPES STRICTS (ALIGNÉS AVEC LE CORE)
// =============================================================================

// Utilise le type Selection du core
export type SelectionState = Selection;

export interface SelectionLevel {
  readonly level: 'none' | 'page' | 'module' | 'component';
  readonly hasSelection: boolean;
  readonly path: readonly string[];
}

// =============================================================================
// HOOK STATE SEUL (PURE, MEMOIZED)
// =============================================================================

export function useSelectionState(): SelectionState {
  const { state } = useBuilder();
  
  return useMemo(() => selectSelection(state), [state]);
}

// =============================================================================
// HOOK INFORMATIONS SÉLECTION (DÉRIVÉES)
// =============================================================================

export function useSelectionInfo(): SelectionLevel {
  const selection = useSelectionState();
  
  return useMemo((): SelectionLevel => {
    // Niveau hiérarchique
    let level: SelectionLevel['level'] = 'none';
    if (selection.componentId) level = 'component';
    else if (selection.moduleId) level = 'module';
    else if (selection.pageId) level = 'page';
    
    // Chemin de sélection
    const path: string[] = [];
    if (selection.pageId) path.push(selection.pageId);
    if (selection.moduleId) path.push(selection.moduleId);
    if (selection.componentId) path.push(selection.componentId);
    
    return {
      level,
      hasSelection: level !== 'none',
      path: path as readonly string[],
    };
  }, [selection]);
}

// =============================================================================
// HOOK VÉRIFICATIONS (OPTIMISÉ)
// =============================================================================

export function useSelectionChecks() {
  const selection = useSelectionState();
  
  return useMemo(() => ({
    isPageSelected: (pageId: string): boolean => selection.pageId === pageId,
    isModuleSelected: (moduleId: string): boolean => selection.moduleId === moduleId,
    isComponentSelected: (componentId: string): boolean => selection.componentId === componentId,
    
    hasPageSelection: (): boolean => !!selection.pageId,
    hasModuleSelection: (): boolean => !!selection.moduleId,
    hasComponentSelection: (): boolean => !!selection.componentId,
    hasAnySelection: (): boolean => !!(selection.pageId || selection.moduleId || selection.componentId),
  }), [selection]);
}

// =============================================================================
// HOOK ENTITÉ ACTUELLE (AVEC NULL-SAFETY)
// =============================================================================

export function useCurrentSelection() {
  const { state } = useBuilder();
  
  return useMemo(() => selectCurrentSelection(state), [state]);
}
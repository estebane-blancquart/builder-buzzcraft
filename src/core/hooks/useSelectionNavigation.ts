// =============================================================================
// HOOK - SÉLECTION NAVIGATION (RESPONSABILITÉ UNIQUE)
// =============================================================================

import { useMemo, useCallback } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { 
  selectAllPages,
  selectModulesForPage,
  selectComponentsForModule,
  selectCanNavigateUp,
  selectCanNavigateDown 
} from '../store';
import { useSelectionState } from './useSelectionState';
import { useSelectionActions } from './useSelectionActions';
import type { Selection } from '../types';

// =============================================================================
// TYPES NAVIGATION
// =============================================================================

export interface NavigationCapabilities {
  readonly canNavigateUp: boolean;
  readonly canNavigateDown: boolean;
  readonly canNavigateNext: boolean;
  readonly canNavigatePrevious: boolean;
}

export interface NavigationActions {
  readonly navigateUp: () => void;
  readonly navigateDown: () => void;
  readonly navigateNext: () => void;
  readonly navigatePrevious: () => void;
}

export interface NavigationInfo {
  readonly siblings: readonly string[];
  readonly children: readonly string[];
  readonly currentIndex: number;
  readonly totalCount: number;
}

// =============================================================================
// HOOK NAVIGATION CAPABILITIES
// =============================================================================

export function useNavigationCapabilities(): NavigationCapabilities {
  const { state } = useBuilder();
  
  const canNavigateUp = useMemo(() => selectCanNavigateUp(state), [state]);
  const canNavigateDown = useMemo(() => selectCanNavigateDown(state), [state]);
  
  // Navigation horizontale (siblings)
  const { currentIndex, totalCount } = useNavigationInfo();
  
  return useMemo((): NavigationCapabilities => ({
    canNavigateUp,
    canNavigateDown,
    canNavigateNext: currentIndex < totalCount - 1,
    canNavigatePrevious: currentIndex > 0,
  }), [canNavigateUp, canNavigateDown, currentIndex, totalCount]);
}

// =============================================================================
// HOOK INFORMATIONS NAVIGATION
// =============================================================================

export function useNavigationInfo(): NavigationInfo {
  const { state } = useBuilder();
  const selection = useSelectionState();
  
  return useMemo((): NavigationInfo => {
    const allPages = selectAllPages(state);
    const modulesForPage = selection.pageId !== null ? selectModulesForPage(state)(selection.pageId) : [];
    const componentsForModule = selection.moduleId !== null ? selectComponentsForModule(state)(selection.moduleId) : [];
    
    // Déterminer les siblings selon le niveau de sélection
    let siblings: readonly string[];
    let children: readonly string[];
    let currentIndex: number;
    
    if (selection.componentId !== null) {
      // Niveau composant
      siblings = componentsForModule.map(c => c.id);
      children = [];
      currentIndex = siblings.indexOf(selection.componentId);
    } else if (selection.moduleId !== null) {
      // Niveau module
      siblings = modulesForPage.map(m => m.id);
      children = componentsForModule.map(c => c.id);
      currentIndex = siblings.indexOf(selection.moduleId);
    } else if (selection.pageId !== null) {
      // Niveau page
      siblings = allPages.map(p => p.id);
      children = modulesForPage.map(m => m.id);
      currentIndex = siblings.indexOf(selection.pageId);
    } else {
      // Aucune sélection
      siblings = allPages.map(p => p.id);
      children = [];
      currentIndex = -1;
    }
    
    return {
      siblings,
      children,
      currentIndex,
      totalCount: siblings.length,
    };
  }, [state, selection]);
}

// =============================================================================
// HOOK ACTIONS NAVIGATION (TYPE-SAFE)
// =============================================================================

export function useNavigationActions(): NavigationActions {
  const selection = useSelectionState();
  const { setSelection } = useSelectionActions();
  const { siblings, children } = useNavigationInfo();
  const { currentIndex } = useNavigationInfo();
  
  const navigateUp = useCallback(() => {
    if (selection.componentId !== null) {
      // Composant → Module (garde pageId et moduleId)
      setSelection({
        pageId: selection.pageId,
        moduleId: selection.moduleId,
        componentId: null,
      });
    } else if (selection.moduleId !== null) {
      // Module → Page (garde pageId seulement)
      setSelection({
        pageId: selection.pageId,
        moduleId: null,
        componentId: null,
      });
    } else if (selection.pageId !== null) {
      // Page → Aucune sélection (tout à null)
      setSelection({
        pageId: null,
        moduleId: null,
        componentId: null,
      });
    }
  }, [selection, setSelection]);
  
  const navigateDown = useCallback(() => {
    if (children.length === 0) return;
    
    const firstChildId = children[0];
    
    if (selection.pageId !== null && selection.moduleId === null) {
      // Page → Premier module
      setSelection({
        pageId: selection.pageId,
        moduleId: firstChildId ?? null,
        componentId: null,
      });
    } else if (selection.moduleId !== null && selection.componentId === null) {
      // Module → Premier composant  
      setSelection({
        pageId: selection.pageId,
        moduleId: selection.moduleId,
        componentId: firstChildId ?? null,
      });
    }
  }, [selection, children, setSelection]);
  
  const navigateNext = useCallback(() => {
    if (currentIndex >= siblings.length - 1) return;
    
    const nextId = siblings[currentIndex + 1];
    
    if (selection.componentId !== null) {
      setSelection({
        pageId: selection.pageId,
        moduleId: selection.moduleId,
        componentId: nextId ?? null,
      } satisfies Selection);
    } else if (selection.moduleId !== null) {
      setSelection({
        pageId: selection.pageId,
        moduleId: nextId ?? null,
        componentId: null,
      } satisfies Selection);
    } else if (selection.pageId !== null) {
      setSelection({
        pageId: nextId ?? null,
        moduleId: null,
        componentId: null,
      } satisfies Selection);
    }
  }, [selection, siblings, currentIndex, setSelection]);
  
  const navigatePrevious = useCallback(() => {
    if (currentIndex <= 0) return;
    
    const previousId = siblings[currentIndex - 1];
    
    if (selection.componentId !== null) {
      setSelection({
        pageId: selection.pageId,
        moduleId: selection.moduleId,
        componentId: previousId ?? null,
      } satisfies Selection);
    } else if (selection.moduleId !== null) {
      setSelection({
        pageId: selection.pageId,
        moduleId: previousId ?? null,
        componentId: null,
      } satisfies Selection);
    } else if (selection.pageId !== null) {
      setSelection({
        pageId: previousId ?? null,
        moduleId: null,
        componentId: null,
      } satisfies Selection);
    }
  }, [selection, siblings, currentIndex, setSelection]);
  
  return {
    navigateUp,
    navigateDown,
    navigateNext,
    navigatePrevious,
  };
}
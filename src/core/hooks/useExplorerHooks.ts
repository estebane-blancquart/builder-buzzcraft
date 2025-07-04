// =============================================================================
// EXPLORER HOOKS - HOOKS POUR EXPLORER PANEL
// =============================================================================
import { useMemo, useCallback } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { pageActions } from '../store/actions';
import { generatePageId, generateDefaultPageName } from '../utils';
import type { Page } from '../types';

// =============================================================================
// HOOK POUR DATA EXPLORER
// =============================================================================
export const useExplorerData = () => {
  const { state } = useBuilder();
  
  return useMemo(() => {
    const pages = Object.values(state.entities.pages);
    
    return {
      pages,
      pagesCount: pages.length,
      hasPages: pages.length > 0
    };
  }, [state.entities.pages]);
};

// =============================================================================
// HOOK POUR ACTIONS EXPLORER
// =============================================================================
export const useExplorerActions = () => {
  const { state, dispatch } = useBuilder();
  
  const createPage = useCallback(() => {
    const existingNames = Object.values(state.entities.pages).map((page: Page) => page.name);
    const newPageName = generateDefaultPageName(existingNames);
    const newPageId = generatePageId();
    
    const newPage: Page = {
      id: newPageId,
      name: newPageName,
      slug: newPageName.toLowerCase().replace(/\s+/g, '-'),
      title: newPageName,
      description: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    dispatch(pageActions.add(newPage));
    return newPageId;
  }, [state.entities.pages, dispatch]);
  
  return {
    createPage
  };
};

// =============================================================================
// HOOK POUR ÉTAT D'EXPANSION
// =============================================================================
export const useExpansionState = () => {
  const { state } = useBuilder();
  
  // État d'expansion basé sur la sélection actuelle
  const expandedPages = useMemo(() => {
    const expanded = new Set<string>();
    
    // Auto-expand la page sélectionnée
    if (state.ui.selection.pageId) {
      expanded.add(state.ui.selection.pageId);
    }
    
    return expanded;
  }, [state.ui.selection.pageId]);
  
  const expandedModules = useMemo(() => {
    const expanded = new Set<string>();
    
    // Auto-expand le module sélectionné
    if (state.ui.selection.moduleId) {
      expanded.add(state.ui.selection.moduleId);
    }
    
    return expanded;
  }, [state.ui.selection.moduleId]);
  
  const togglePageExpansion = useCallback((pageId: string) => {
    // Pour l'instant, on utilise la sélection pour gérer l'expansion
    // Dans une version plus avancée, on pourrait avoir un état séparé
    console.log('Toggle page expansion:', pageId);
  }, []);
  
  const toggleModuleExpansion = useCallback((moduleId: string) => {
    console.log('Toggle module expansion:', moduleId);
  }, []);
  
  return {
    expandedPages,
    expandedModules,
    togglePageExpansion,
    toggleModuleExpansion
  };
};
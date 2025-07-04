// =============================================================================
// EXPLORER PANEL - NAVIGATION PAGES/MODULES/COMPOSANTS (V2 EXEMPLAIRE)
// =============================================================================
import React, { useState, useCallback, useMemo } from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { createPageId, createUniqueName } from '../../../core/utils';
import { pageActions, uiActions } from '../../../core/store';
import { PageItem } from './PageItem';
import './Explorer.scss';


// =============================================================================
// HOOKS CUSTOM
// =============================================================================

/**
 * Hook pour gérer l'état d'expansion des éléments
 */
function useExpansionState() {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const togglePageExpansion = useCallback((pageId: string) => {
    setExpandedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  }, []);

  const toggleModuleExpansion = useCallback((moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedPages(new Set());
    setExpandedModules(new Set());
  }, []);

  const expandPage = useCallback((pageId: string) => {
    setExpandedPages(prev => new Set([...prev, pageId]));
  }, []);

  return {
    expandedPages,
    expandedModules,
    togglePageExpansion,
    toggleModuleExpansion,
    collapseAll,
    expandPage
  };
}

/**
 * Hook pour les actions du panel
 */
function useExplorerActions() {
  const { state, dispatch } = useBuilder();
  
  const createPage = useCallback(() => {
    const newPageId = createPageId();
    const existingPageNames = Object.values(state.entities.pages || {}).map(page => page.name);
    const pageName = createUniqueName('Nouvelle page', existingPageNames);
    
    const newPage = {
      id: newPageId,
      name: pageName,
      slug: pageName.toLowerCase().replace(/\s+/g, '-'),
      title: pageName,
      description: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Utiliser les action creators
    dispatch(pageActions.add(newPage));
    dispatch(uiActions.selectPage(newPageId));
    
    return newPageId;
  }, [state.entities.pages, dispatch]);

  const selectPage = useCallback((pageId: string) => {
    dispatch(uiActions.selectPage(pageId));
  }, [dispatch]);

  return {
    createPage,
    selectPage
  };
}

/**
 * Hook pour les données dérivées
 */
function useExplorerData() {
  const { state } = useBuilder();
  
  return useMemo(() => {
    const pages = state.entities.pages || {};
    const pageIds = Object.keys(pages);
    const pagesCount = pageIds.length;
    const hasSelection = state.ui.selection.pageId;
    const selectedPageId = hasSelection;
    
    return {
      pageIds,
      pagesCount,
      hasSelection,
      selectedPageId,
      hasPages: pagesCount > 0
    };
  }, [state.entities.pages, state.ui.selection.pageId]);
}

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================
export const ExplorerPanel: React.FC = () => {
  // Hooks custom pour separation of concerns
  const explorerData = useExplorerData();
  const explorerActions = useExplorerActions();
  const expansionState = useExpansionState();
  
  // =============================================================================
  // HANDLERS OPTIMISÉS
  // =============================================================================
  
  const handleCreatePage = useCallback(() => {
    const newPageId = explorerActions.createPage();
    expansionState.expandPage(newPageId);
  }, [explorerActions.createPage, expansionState.expandPage]);

  const handleSelectPage = useCallback((pageId: string) => {
    explorerActions.selectPage(pageId);
  }, [explorerActions.selectPage]);

  // =============================================================================
  // COMPOSANTS UI
  // =============================================================================
  
  const renderPagesList = useMemo(() => {
    return (
      <div className="pages-container" role="tree" aria-label="Pages du projet">
        {explorerData.pageIds.map(pageId => (
          <PageItem
            key={pageId}
            pageId={pageId}
            isSelected={explorerData.selectedPageId === pageId}
            isExpanded={expansionState.expandedPages.has(pageId)}
            onSelect={handleSelectPage}
            onToggleExpand={expansionState.togglePageExpansion}
            expandedModules={expansionState.expandedModules}
            onToggleModuleExpand={expansionState.toggleModuleExpansion}
          />
        ))}
      </div>
    );
  }, [
    explorerData.pageIds,
    explorerData.selectedPageId,
    expansionState.expandedPages,
    expansionState.expandedModules,
    handleSelectPage,
    expansionState.togglePageExpansion,
    expansionState.toggleModuleExpansion
  ]);

  // Retourner le JSX complet du composant
  return (
    <div className="explorer-panel">
      <div className="pages-header-row">
        <span className="pages-header-label">Pages</span>
        <button
          className="add-page-btn"
          title="Ajouter une page"
          onClick={handleCreatePage}
          aria-label="Ajouter une page"
        >
          +
        </button>
      </div>
      {renderPagesList}
    </div>
  );
};
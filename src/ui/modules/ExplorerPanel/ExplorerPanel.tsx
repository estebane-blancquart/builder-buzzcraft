// =============================================================================
// EXPLORER PANEL - COMPOSANT PRINCIPAL DÉCOUPLÉ
// =============================================================================
import React, { useState, useCallback, useMemo } from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { useSelection } from '../../../core/hooks';
import { pageActions } from '../../../core/store/actions';
import { selectAllPages } from '../../../core/store';
import { generatePageId, generateDefaultPageName } from '../../../core/utils';
import { PageItemContainer } from './containers/PageItemContainer';
import './Explorer.scss';

// =============================================================================
// HOOKS MÉTIER (LOGIQUE SÉPARÉE)
// =============================================================================

/**
 * Hook pour la gestion de l'état d'expansion
 */
function useExpansionState() {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const togglePageExpansion = useCallback((pageId: string) => {
    setExpandedPages(prev => {
      const next = new Set(prev);
      if (next.has(pageId)) {
        next.delete(pageId);
      } else {
        next.add(pageId);
      }
      return next;
    });
  }, []);

  const toggleModuleExpansion = useCallback((moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }, []);

  return {
    expandedPages,
    expandedModules,
    togglePageExpansion,
    toggleModuleExpansion,
  };
}

/**
 * Hook pour les actions du panel
 */
function useExplorerActions() {
  const { state, dispatch } = useBuilder();
  const { actions } = useSelection();
  
  const createPage = useCallback(() => {
    const newPageId = generatePageId();
    const existingPageNames = Object.values(state.entities.pages || {}).map(page => page.name);
    const pageName = generateDefaultPageName(existingPageNames);
    
    const newPage = {
      id: newPageId,
      name: pageName,
      slug: pageName.toLowerCase().replace(/\s+/g, '-'),
      title: pageName,
      description: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    dispatch(pageActions.add(newPage));
    actions.selectPage(newPageId);
    
    return newPageId;
  }, [state.entities.pages, dispatch, actions]);

  return {
    createPage,
  };
}

/**
 * Hook pour les données dérivées
 */
function useExplorerData() {
  const { state } = useBuilder();
  const { state: selection } = useSelection();
  
  return useMemo(() => {
    const pages = selectAllPages(state);
    const pagesCount = pages.length;
    const hasSelection = selection.pageId !== null;
    const selectedPageId = selection.pageId;
    
    return {
      pages,
      pagesCount,
      hasSelection,
      selectedPageId,
      hasPages: pagesCount > 0
    };
  }, [state, selection]);
}

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================
export const ExplorerPanel: React.FC = () => {
  // Hooks métier pour separation of concerns
  const explorerData = useExplorerData();
  const explorerActions = useExplorerActions();
  const expansionState = useExpansionState();

  // =============================================================================
  // HANDLERS PRINCIPAUX
  // =============================================================================
  const handleCreatePage = useCallback(() => {
    const newPageId = explorerActions.createPage();
    // Auto-expand la nouvelle page
    expansionState.togglePageExpansion(newPageId);
  }, [explorerActions, expansionState]);

  // =============================================================================
  // RENDER PRINCIPAL
  // =============================================================================
  return (
    <div className="explorer-panel">
      {/* Header du panel */}
      <div className="panel-header">
        <div className="header-title">
          <span className="header-icon">📁</span>
          <span>Explorer</span>
          <span className="header-count">({explorerData.pagesCount})</span>
        </div>
        
        <button 
          className="add-btn header-add-btn"
          onClick={handleCreatePage}
          title="Ajouter une page"
        >
          ➕
        </button>
      </div>

      {/* Contenu du panel */}
      <div className="panel-content">
        {explorerData.hasPages ? (
          <div className="pages-list">
            {explorerData.pages.map(page => (
              <PageItemContainer
                key={page.id}
                pageId={page.id}
                isExpanded={expansionState.expandedPages.has(page.id)}
                expandedModules={expansionState.expandedModules}
                onToggleExpand={expansionState.togglePageExpansion}
                onToggleModuleExpand={expansionState.toggleModuleExpansion}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <div className="empty-title">Aucune page</div>
            <div className="empty-message">
              Créez votre première page pour commencer
            </div>
            <button 
              className="empty-action-btn"
              onClick={handleCreatePage}
            >
              ➕ Créer une page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
// =============================================================================
// EXPLORER PANEL - ORCHESTRATEUR PRINCIPAL AVEC ARCHITECTURE
// =============================================================================
import React, { useState, useCallback, useMemo } from 'react';
import { PageItemContainer } from './containers/PageItemContainer';
import './ExplorerPanel.scss';

// =============================================================================
// ICÔNES (HEADER ET SEARCH)
// =============================================================================
const Icons = {
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 10L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  Close: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  Add: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  Folder: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 3.5C2 2.94772 2.44772 2.5 3 2.5H5.5L6.5 4H11C11.5523 4 12 4.44772 12 5V10.5C12 11.0523 11.5523 11.5 11 11.5H3C2.44772 11.5 2 11.0523 2 10.5V3.5Z" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  
  Structure: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 4H13M3 8H13M3 12H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 1V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
};

// =============================================================================
// DONNÉES PAGES (POUR LA LISTE)
// =============================================================================
const PAGE_LIST = ['page-1', 'page-2', 'page-3'];

// =============================================================================
// EXPLORER PANEL (ORCHESTRATEUR)
// =============================================================================
export const ExplorerPanel: React.FC = () => {
  // =============================================================================
  // ÉTAT LOCAL UI
  // =============================================================================
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(['page-1']));
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['module-1']));
  const [selection, setSelection] = useState<{pageId?: string; moduleId?: string; componentId?: string}>({
    pageId: 'page-1'
  });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // =============================================================================
  // FILTRAGE PAR RECHERCHE
  // =============================================================================
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return PAGE_LIST;
    
    return PAGE_LIST.filter(pageId => {
      // TODO: Filtrer selon le contenu réel des pages
      return pageId.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  // =============================================================================
  // HANDLERS D'EXPANSION
  // =============================================================================
  const handleTogglePageExpand = useCallback((pageId: string) => {
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

  const handleToggleModuleExpand = useCallback((moduleId: string) => {
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

  // =============================================================================
  // HANDLERS DE SÉLECTION
  // =============================================================================
  const handleSelectItem = useCallback((type: string, id: string) => {
    switch (type) {
      case 'page':
        setSelection({ pageId: id });
        break;
      case 'module':
        setSelection({ pageId: selection.pageId || 'page-1', moduleId: id });
        break;
      case 'component':
        setSelection({ 
          pageId: selection.pageId || 'page-1', 
          moduleId: selection.moduleId || '',
          componentId: id 
        });
        break;
    }
  }, [selection]);

  const handleComponentSelect = useCallback((pageId: string, moduleId: string, componentId: string) => {
    setSelection({ pageId, moduleId, componentId });
  }, []);

  const handleHover = useCallback((itemId: string | null) => {
    setHoveredItem(itemId);
  }, []);

  // =============================================================================
  // HANDLER CRÉATION PAGE
  // =============================================================================
  const handleCreatePage = useCallback(() => {
    console.log('Create new page');
    // TODO: Dispatch action pour créer une page
  }, []);

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="explorer">
      <div className="explorer__header">
        <div className="explorer__title">
          <Icons.Structure />
          <span>Explorer</span>
        </div>
      </div>

      <div className="explorer__search">
        <div className="search-field">
          <Icons.Search />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-field__input"
          />
          {searchQuery && (
            <button
              className="search-field__clear"
              onClick={() => setSearchQuery('')}
            >
              <Icons.Close />
            </button>
          )}
        </div>
      </div>

      <div className="explorer__content">
        <div className="tree">
          {filteredPages.length > 0 ? (
            <>
              {filteredPages.map(pageId => (
                <PageItemContainer
                  key={pageId}
                  pageId={pageId}
                  isExpanded={expandedPages.has(pageId)}
                  expandedModules={expandedModules}
                  selection={selection}
                  hoveredItem={hoveredItem}
                  onToggleExpand={handleTogglePageExpand}
                  onToggleModuleExpand={handleToggleModuleExpand}
                  onComponentSelect={handleComponentSelect}
                  onSelectItem={handleSelectItem}
                  onHover={handleHover}
                />
              ))}
              
              <div className="add-item add-item--page">
                <button 
                  className="add-item__btn"
                  onClick={handleCreatePage}
                  title="Add Page"
                >
                  <Icons.Add />
                  <span>New Page</span>
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Icons.Folder />
              <span>No files found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
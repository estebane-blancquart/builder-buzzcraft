// =============================================================================
// EXPLORER PANEL - VERSION CORRIGÉE AVEC BOUTONS UNIFORMES
// =============================================================================
import React, { useState, useCallback, useMemo } from 'react';
import './ExplorerPanel.scss';

// =============================================================================
// ICÔNES SVG MINIMALISTES (IDENTIQUES)
// =============================================================================
const Icons = {
  ChevronRight: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
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
  
  Page: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M8.5 1.5H3.5C3.22386 1.5 3 1.72386 3 2V12C3 12.2761 3.22386 12.5 3.5 12.5H10.5C10.7761 12.5 11 12.2761 11 12V4.5L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M8.5 1.5V4.5H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  Module: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6 5H10M6 7H10M6 9H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  
  Component: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7" cy="7" r="2" fill="currentColor"/>
    </svg>
  ),
  
  Add: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  Delete: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M8 3V2C8 1.44772 7.55228 1 7 1H5C4.44772 1 4 1.44772 4 2V3M1.5 3H10.5M9.5 3V9C9.5 9.55228 9.05228 10 8.5 10H3.5C2.94772 10 2.5 9.55228 2.5 9V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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

// Types et données (identiques à l'original)
interface MockPage {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

interface MockModule {
  id: string;
  name: string;
  type: string;
  layout: { desktop: number; tablet: number; mobile: number };
  styles: Record<string, any>;
  position: number;
  createdAt: number;
  updatedAt: number;
}

interface MockComponent {
  id: string;
  name: string;
  type: string;
  props: Record<string, any>;
  styles: Record<string, any>;
  layout: { span: number; position: number };
  createdAt: number;
  updatedAt: number;
}

interface MockState {
  entities: {
    pages: Record<string, MockPage>;
    modules: Record<string, MockModule>;
    components: Record<string, MockComponent>;
  };
  relations: {
    pageModules: Record<string, string[]>;
    moduleComponents: Record<string, string[]>;
  };
  meta: {
    activePageId: string | null;
    pageOrder: string[];
    projectName: string;
    projectId: string;
    version: string;
  };
}

const mockState: MockState = {
  entities: {
    pages: {
      'page-1': { 
        id: 'page-1', 
        name: 'Home', 
        slug: 'home', 
        title: 'Homepage',
        description: 'Main landing page',
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 3600000
      },
      'page-2': { 
        id: 'page-2', 
        name: 'About', 
        slug: 'about', 
        title: 'About page',
        description: 'Company information',
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now() - 7200000
      },
      'page-3': { 
        id: 'page-3', 
        name: 'Contact', 
        slug: 'contact', 
        title: 'Contact page',
        description: 'Contact form',
        createdAt: Date.now() - 259200000,
        updatedAt: Date.now() - 1800000
      }
    },
    modules: {
      'module-1': { 
        id: 'module-1', 
        name: 'Hero Section', 
        type: 'hero',
        layout: { desktop: 1, tablet: 1, mobile: 1 },
        styles: {},
        position: 0,
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 3600000
      },
      'module-2': { 
        id: 'module-2', 
        name: 'Features Grid', 
        type: 'features',
        layout: { desktop: 3, tablet: 2, mobile: 1 },
        styles: {},
        position: 1,
        createdAt: Date.now() - 82800000,
        updatedAt: Date.now() - 1800000
      }
    },
    components: {
      'comp-1': { 
        id: 'comp-1', 
        name: 'Main Heading', 
        type: 'title',
        props: { text: 'Welcome', level: 1 },
        styles: {},
        layout: { span: 1, position: 0 },
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 3600000
      },
      'comp-2': { 
        id: 'comp-2', 
        name: 'Hero Description', 
        type: 'text',
        props: { text: 'Hero subtitle' },
        styles: {},
        layout: { span: 1, position: 1 },
        createdAt: Date.now() - 86000000,
        updatedAt: Date.now() - 2400000
      },
      'comp-3': { 
        id: 'comp-3', 
        name: 'CTA Button', 
        type: 'button',
        props: { text: 'Get Started', variant: 'primary', size: 'lg' },
        styles: {},
        layout: { span: 1, position: 2 },
        createdAt: Date.now() - 85600000,
        updatedAt: Date.now() - 1200000
      }
    }
  },
  relations: {
    pageModules: {
      'page-1': ['module-1', 'module-2'],
      'page-2': ['module-1'],
      'page-3': []
    },
    moduleComponents: {
      'module-1': ['comp-1', 'comp-2', 'comp-3'],
      'module-2': []
    }
  },
  meta: {
    activePageId: 'page-1',
    pageOrder: ['page-1', 'page-2', 'page-3'],
    projectName: 'My Project',
    projectId: 'proj-1',
    version: '1.0.0'
  }
};

export const ExplorerPanel: React.FC = () => {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(['page-1']));
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['module-1']));
  const [selection, setSelection] = useState<{
    type: 'page' | 'module' | 'component';
    id: string;
  } | null>({ type: 'page', id: 'page-1' });
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const pages = useMemo(() => {
    return mockState.meta.pageOrder
      .map(id => mockState.entities.pages[id])
      .filter((page): page is MockPage => Boolean(page));
  }, []);

  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages;
    return pages.filter(page => 
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pages, searchQuery]);

  const togglePage = useCallback((pageId: string, event: React.MouseEvent) => {
    event.stopPropagation();
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

  const toggleModule = useCallback((moduleId: string, event: React.MouseEvent) => {
    event.stopPropagation();
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

  const selectItem = useCallback((type: 'page' | 'module' | 'component', id: string) => {
    setSelection({ type, id });
  }, []);

  const renderComponent = useCallback((component: MockComponent) => {
    const isSelected = selection?.type === 'component' && selection.id === component.id;
    const isHovered = hoveredItem === component.id;

    return (
      <div
        key={component.id}
        className={`tree-node tree-node--component ${isSelected ? 'tree-node--selected' : ''}`}
        onClick={() => selectItem('component', component.id)}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setHoveredItem(component.id);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setHoveredItem(null);
        }}
      >
        <div className="tree-node__content">
          <div className="tree-node__indent"></div>
          
          <div className="tree-node__icon">
            <Icons.Component />
          </div>
          
          <span className="tree-node__label">{component.name}</span>

          {isHovered && (
            <div className="tree-node__actions">
              <button className="tree-action tree-action--delete" title="Delete Component">
                <Icons.Delete />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }, [selection, selectItem, hoveredItem]);

  const renderModule = useCallback((module: MockModule) => {
    const isSelected = selection?.type === 'module' && selection.id === module.id;
    const isExpanded = expandedModules.has(module.id);
    const isHovered = hoveredItem === module.id;
    
    const componentIds = mockState.relations.moduleComponents[module.id] || [];
    const components = componentIds
      .map(id => mockState.entities.components[id])
      .filter((component): component is MockComponent => Boolean(component));

    return (
      <div key={module.id} className="tree-node tree-node--module">
        <div
          className={`tree-node__content ${isSelected ? 'tree-node--selected' : ''}`}
          onClick={() => selectItem('module', module.id)}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setHoveredItem(module.id);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setHoveredItem(null);
          }}
        >
          <button
            className={`tree-node__toggle ${isExpanded ? 'tree-node__toggle--expanded' : ''}`}
            onClick={(e) => toggleModule(module.id, e)}
            disabled={components.length === 0}
          >
            <Icons.ChevronRight />
          </button>
          
          <div className="tree-node__icon">
            <Icons.Module />
          </div>
          
          <span className="tree-node__label">{module.name}</span>

          {isHovered && (
            <div className="tree-node__actions">
              <button className="tree-action tree-action--delete" title="Delete Module">
                <Icons.Delete />
              </button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="tree-children">
            {components.length > 0 ? (
              components.map(component => renderComponent(component))
            ) : (
              <div className="empty-list">
                <span className="empty-text">No components</span>
              </div>
            )}
            <div className="add-item add-item--component">
              <button 
                className="add-item__btn"
                onClick={() => console.log('Add component to', module.id)}
                title="Add Component"
              >
                <Icons.Add />
                <span>New Component</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }, [selection, expandedModules, selectItem, toggleModule, renderComponent, hoveredItem]);

  const renderPage = useCallback((page: MockPage) => {
    const isSelected = selection?.type === 'page' && selection.id === page.id;
    const isExpanded = expandedPages.has(page.id);
    const isHovered = hoveredItem === page.id;
    
    const moduleIds = mockState.relations.pageModules[page.id] || [];
    const modules = moduleIds
      .map(id => mockState.entities.modules[id])
      .filter((module): module is MockModule => Boolean(module));

    return (
      <div key={page.id} className="tree-node tree-node--page">
        <div
          className={`tree-node__content ${isSelected ? 'tree-node--selected' : ''}`}
          onClick={() => selectItem('page', page.id)}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setHoveredItem(page.id);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setHoveredItem(null);
          }}
        >
          <button
            className={`tree-node__toggle ${isExpanded ? 'tree-node__toggle--expanded' : ''}`}
            onClick={(e) => togglePage(page.id, e)}
            disabled={modules.length === 0}
          >
            <Icons.ChevronRight />
          </button>
          
          <div className="tree-node__icon">
            <Icons.Page />
          </div>
          
          <span className="tree-node__label">{page.name}</span>

          {isHovered && (
            <div className="tree-node__actions">
              <button className="tree-action tree-action--delete" title="Delete Page">
                <Icons.Delete />
              </button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="tree-children">
            {modules.length > 0 ? (
              modules.map(module => renderModule(module))
            ) : (
              <div className="empty-list">
                <span className="empty-text">No modules</span>
              </div>
            )}
            <div className="add-item add-item--module">
              <button 
                className="add-item__btn"
                onClick={() => console.log('Add module to', page.id)}
                title="Add Module"
              >
                <Icons.Add />
                <span>New Module</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }, [selection, expandedPages, selectItem, togglePage, renderModule, hoveredItem]);

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
              {filteredPages.map(page => renderPage(page))}
              {/* BOUTON NEW PAGE IDENTIQUE AUX AUTRES */}
              <div className="add-item add-item--page">
                <button 
                  className="add-item__btn"
                  onClick={() => console.log('Add new page')}
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
// =============================================================================
// EXPLORER PANEL - COMPOSANT PRINCIPAL
// =============================================================================
import React, { useState } from 'react';
import './Explorer.scss';

// =============================================================================
// TYPES TEMPORAIRES
// =============================================================================
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

// =============================================================================
// DONNÉES TEMPORAIRES (EN ATTENDANT LE STORE)
// =============================================================================
const mockState: MockState = {
  entities: {
    pages: {
      'page-1': { 
        id: 'page-1', 
        name: 'Accueil', 
        slug: 'accueil', 
        title: 'Page d\'accueil', 
        description: '', 
        createdAt: Date.now(), 
        updatedAt: Date.now() 
      },
      'page-2': { 
        id: 'page-2', 
        name: 'À propos', 
        slug: 'about', 
        title: 'À propos', 
        description: '', 
        createdAt: Date.now(), 
        updatedAt: Date.now() 
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
        createdAt: Date.now(), 
        updatedAt: Date.now() 
      },
      'module-2': { 
        id: 'module-2', 
        name: 'Fonctionnalités', 
        type: 'features', 
        layout: { desktop: 3, tablet: 2, mobile: 1 }, 
        styles: {}, 
        position: 1, 
        createdAt: Date.now(), 
        updatedAt: Date.now() 
      }
    },
    components: {
      'comp-1': { 
        id: 'comp-1', 
        name: 'Titre principal', 
        type: 'title', 
        props: { text: 'Bienvenue', level: 1 }, 
        styles: {}, 
        layout: { span: 1, position: 0 }, 
        createdAt: Date.now(), 
        updatedAt: Date.now() 
      },
      'comp-2': { 
        id: 'comp-2', 
        name: 'Sous-titre', 
        type: 'text', 
        props: { text: 'Description' }, 
        styles: {}, 
        layout: { span: 1, position: 1 }, 
        createdAt: Date.now(), 
        updatedAt: Date.now() 
      }
    }
  },
  relations: {
    pageModules: {
      'page-1': ['module-1', 'module-2'],
      'page-2': []
    },
    moduleComponents: {
      'module-1': ['comp-1', 'comp-2'],
      'module-2': []
    }
  },
  meta: {
    activePageId: 'page-1',
    pageOrder: ['page-1', 'page-2'],
    projectName: 'Nouveau projet',
    projectId: 'proj-1',
    version: '1.0.0'
  }
};

// =============================================================================
// COMPOSANT EXPLORER PANEL SIMPLIFIÉ
// =============================================================================
export const ExplorerPanel: React.FC = () => {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(['page-1']));
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['module-1']));
  const [selection, setSelection] = useState<{type: 'page' | 'module' | 'component', id: string} | null>({ type: 'page', id: 'page-1' });

  // =============================================================================
  // HANDLERS
  // =============================================================================
  const togglePage = (pageId: string) => {
    setExpandedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const selectItem = (type: 'page' | 'module' | 'component', id: string) => {
    setSelection({ type, id });
  };

  // =============================================================================
  // HELPERS
  // =============================================================================
  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'title': return '📝';
      case 'text': return '📄';
      case 'button': return '🔘';
      case 'image': return '🖼️';
      default: return '📦';
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'hero': return '🦸';
      case 'features': return '⭐';
      case 'content': return '📝';
      default: return '📦';
    }
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="explorer-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="header-title">
          <span className="header-icon">🗂️</span>
          <span>Explorer</span>
          <span className="header-count">({Object.keys(mockState.entities.pages).length})</span>
        </div>
        <div className="header-actions">
          <button 
            className="action-btn"
            onClick={() => console.log('Ajouter page')}
            title="Ajouter une page"
          >
            ➕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="panel-content">
        <div className="pages-list">
          {Object.values(mockState.entities.pages).map(page => {
            const isPageSelected = selection?.type === 'page' && selection.id === page.id;
            const isPageExpanded = expandedPages.has(page.id);
            const pageModuleIds = mockState.relations.pageModules[page.id] || [];
            const pageModules = pageModuleIds
              .map(moduleId => mockState.entities.modules[moduleId])
              .filter((m): m is MockModule => Boolean(m));

            return (
              <div key={page.id} className={`page-item ${isPageSelected ? 'selected' : ''}`}>
                {/* Page Header */}
                <div 
                  className="page-header"
                  onClick={() => selectItem('page', page.id)}
                >
                  <div className="page-info">
                    <button
                      className="expand-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePage(page.id);
                      }}
                    >
                      {isPageExpanded ? '▼' : '▶'}
                    </button>
                    <div className="page-icon">📄</div>
                    <div className="page-details">
                      <div className="page-name">{page.name}</div>
                      <div className="page-meta">
                        <span className="module-count">{pageModules.length} modules</span>
                      </div>
                    </div>
                  </div>
                  <div className="page-actions">
                    <button 
                      className="action-btn add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Ajouter module à', page.id);
                      }}
                      title="Ajouter un module"
                    >
                      ➕
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Supprimer page', page.id);
                      }}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Page Content (Modules) */}
                {isPageExpanded && (
                  <div className="page-content">
                    {pageModules.length > 0 ? (
                      pageModules.map(module => {
                        const isModuleSelected = selection?.type === 'module' && selection.id === module.id;
                        const isModuleExpanded = expandedModules.has(module.id);
                        const moduleComponentIds = mockState.relations.moduleComponents[module.id] || [];
                        const moduleComponents = moduleComponentIds
                          .map(compId => mockState.entities.components[compId])
                          .filter((c): c is MockComponent => Boolean(c));

                        return (
                          <div key={module.id} className={`module-item ${isModuleSelected ? 'selected' : ''}`}>
                            {/* Module Header */}
                            <div 
                              className="module-header"
                              onClick={() => selectItem('module', module.id)}
                            >
                              <div className="module-info">
                                <button
                                  className="expand-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleModule(module.id);
                                  }}
                                >
                                  {isModuleExpanded ? '▼' : '▶'}
                                </button>
                                <div className="module-icon">
                                  {getModuleIcon(module.type)}
                                </div>
                                <div className="module-details">
                                  <div className="module-name">{module.name}</div>
                                  <div className="module-type">{module.type}</div>
                                </div>
                              </div>
                              <div className="module-actions">
                                <button 
                                  className="action-btn add-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Ajouter composant à', module.id);
                                  }}
                                  title="Ajouter un composant"
                                >
                                  ➕
                                </button>
                                <button 
                                  className="action-btn delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Supprimer module', module.id);
                                  }}
                                  title="Supprimer"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>

                            {/* Module Content (Components) */}
                            {isModuleExpanded && (
                              <div className="module-content">
                                {moduleComponents.length > 0 ? (
                                  moduleComponents.map(component => {
                                    const isComponentSelected = selection?.type === 'component' && selection.id === component.id;

                                    return (
                                      <div 
                                        key={component.id} 
                                        className={`component-item ${isComponentSelected ? 'selected' : ''}`}
                                        onClick={() => selectItem('component', component.id)}
                                      >
                                        <div className="component-header">
                                          <div className="component-info">
                                            <div className="component-icon">
                                              {getComponentIcon(component.type)}
                                            </div>
                                            <div className="component-details">
                                              <div className="component-name">{component.name}</div>
                                              <div className="component-type">{component.type}</div>
                                            </div>
                                          </div>
                                          <div className="component-actions">
                                            <button 
                                              className="action-btn delete-btn"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                console.log('Supprimer composant', component.id);
                                              }}
                                              title="Supprimer"
                                            >
                                              🗑️
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="empty-state">
                                    <div className="empty-icon">📦</div>
                                    <div className="empty-title">Aucun composant</div>
                                    <div className="empty-description">Ajoutez votre premier composant</div>
                                    <button 
                                      className="empty-action"
                                      onClick={() => console.log('Ajouter composant à', module.id)}
                                    >
                                      ➕ Ajouter un composant
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <div className="empty-title">Aucun module</div>
                        <div className="empty-description">Ajoutez votre premier module</div>
                        <button 
                          className="empty-action"
                          onClick={() => console.log('Ajouter module à', page.id)}
                        >
                          ➕ Ajouter un module
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
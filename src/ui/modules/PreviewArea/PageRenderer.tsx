// =============================================================================
// PAGE RENDERER - RENDU DES PAGES
// =============================================================================
import React from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { ComponentFactory } from './ComponentFactory';

// =============================================================================
// COMPOSANT PAGE RENDERER
// =============================================================================
export const PageRenderer: React.FC = () => {
  const { state } = useBuilder();
  
  // Récupérer la page sélectionnée ou la première page
  const selectedPageId = state.ui.selection.pageId;
  const firstPageId = Object.keys(state.entities.pages || {})[0];
  const currentPageId = selectedPageId || firstPageId;
  
  const currentPage = currentPageId ? state.entities.pages?.[currentPageId] : null;
  const pageModuleIds = currentPageId ? state.relations.pageModules?.[currentPageId] || [] : [];

  // Si pas de page ou pas de modules, ne rien afficher
  if (!currentPage || pageModuleIds.length === 0) {
    return <div className="page-renderer" />;
  }

  return (
    <div className="page-renderer">
      <div className="page-content">
        {pageModuleIds.map(moduleId => {
          const module = state.entities.modules?.[moduleId];
          const moduleComponentIds = state.relations.moduleComponents?.[moduleId] || [];
          if (!module) return null;
          return (
            <div key={moduleId} className={`module-container ${module.type}`}
              data-layout-desktop={module.layout.desktop}
              data-layout-tablet={module.layout.tablet}
              data-layout-mobile={module.layout.mobile}
            >
              <div className="module-grid">
                {moduleComponentIds.map(componentId => {
                  const component = state.entities.components?.[componentId];
                  if (!component) return null;
                  return (
                    <div key={componentId} className="component-wrapper" data-span={component.layout?.span || 1}>
                      <ComponentFactory component={component} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
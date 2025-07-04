// =============================================================================
// PAGE RENDERER - COMPOSANT UI PUR POUR RENDU DES PAGES
// =============================================================================
import React from 'react';
import { ComponentFactory } from './ComponentFactory';
import { useBuilder } from '../../../../core/context/BuilderContext';

// =============================================================================
// TYPES
// =============================================================================
interface PageRendererProps {
  pageId?: string | undefined;
}

// =============================================================================
// COMPOSANT PAGE RENDERER
// =============================================================================
export const PageRenderer: React.FC<PageRendererProps> = ({ pageId }) => {
  const { state } = useBuilder();

  // =============================================================================
  // SÉLECTION DE LA PAGE
  // =============================================================================
  const currentPageId = pageId || state.ui.selection.pageId || Object.keys(state.entities.pages || {})[0];
  const currentPage = currentPageId ? state.entities.pages?.[currentPageId] : null;
  const pageModuleIds = currentPageId ? state.relations.pageModules?.[currentPageId] || [] : [];

  // =============================================================================
  // RENDU VIDE SI PAS DE DONNÉES
  // =============================================================================
  if (!currentPage || pageModuleIds.length === 0) {
    return <div className="page-renderer" />;
  }

  // =============================================================================
  // RENDU DES MODULES
  // =============================================================================
  const renderModules = () => {
    return pageModuleIds.map((moduleId: string) => {
      const module = state.entities.modules?.[moduleId];
      const moduleComponentIds = state.relations.moduleComponents?.[moduleId] || [];

      if (!module) return null;

      return (
        <div
          key={moduleId}
          className={`module-container ${module.type}`}
          data-module-id={moduleId}
          data-layout-desktop={module.layout.desktop}
          data-layout-tablet={module.layout.tablet}
          data-layout-mobile={module.layout.mobile}
        >
          <div className="module-grid">
            {moduleComponentIds.map((componentId: string) => {
              const component = state.entities.components?.[componentId];
              if (!component) return null;

              return (
                <div
                  key={componentId}
                  className="component-wrapper"
                  data-component-id={componentId}
                  data-span={component.layout?.span || 1}
                >
                  <ComponentFactory component={component} />
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="page-renderer" data-page-id={currentPageId}>
      <div className="page-content">
        {renderModules()}
      </div>
    </div>
  );
};
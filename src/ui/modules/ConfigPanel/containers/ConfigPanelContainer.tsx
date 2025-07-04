// =============================================================================
// CONFIG PANEL CONTAINER - VERSION FIXÉE
// =============================================================================
import React, { useMemo } from 'react';
import { useBuilder } from '../../../../core/context/BuilderContext';
import { ConfigPanel } from '../ConfigPanel';

// =============================================================================
// CONTAINER PRINCIPAL
// =============================================================================
export const ConfigPanelContainer: React.FC = () => {
  const { state } = useBuilder();
  const { selection } = state.ui;

  // =============================================================================
  // SÉLECTION INFO CALCULÉE
  // =============================================================================
  const selectionInfo = useMemo(() => {
    const { pageId, moduleId, componentId } = selection;

    // Composant sélectionné
    if (componentId && pageId) {
      const component = state.entities.components[componentId];
      if (component) {
        return {
          type: 'component' as const,
          label: 'Composant',
          icon: '🧩',
          elementName: component.name,
          availableTabs: ['content', 'style']
        };
      }
    }

    // Module sélectionné
    if (moduleId && pageId) {
      const module = state.entities.modules[moduleId];
      if (module) {
        return {
          type: 'module' as const,
          label: 'Module',
          icon: '📋',
          elementName: module.name,
          availableTabs: ['position', 'style']
        };
      }
    }

    // Page sélectionnée
    if (pageId) {
      const page = state.entities.pages[pageId];
      if (page) {
        return {
          type: 'page' as const,
          label: 'Page',
          icon: '📄',
          elementName: page.name,
          availableTabs: ['style']
        };
      }
    }

    return {
      type: 'none' as const,
      label: 'Configuration',
      icon: '⚙️',
      elementName: '',
      availableTabs: []
    };
  }, [state, selection]);


  // =============================================================================
  // RENDU CONDITIONNEL (AUCUNE SÉLECTION)
  // =============================================================================
  if (selectionInfo.type === 'none') {
    return (
      <div className="config-panel">
        <div className="panel-header">
          <div className="header-title">
            <span className="header-icon">⚙️</span>
            <span>Configuration</span>
          </div>
        </div>
        <div className="panel-content">
          <div className="empty-state">
            <div className="empty-icon">⚙️</div>
          </div>
        </div>
      </div>
    );
  }

  // =============================================================================
  // RENDU AVEC SÉLECTION
  // =============================================================================
  return (
    <ConfigPanel
      selectionInfo={selectionInfo}
    />
  );
};
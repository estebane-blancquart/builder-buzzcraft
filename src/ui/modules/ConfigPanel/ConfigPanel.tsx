// =============================================================================
// CONFIG PANEL - ORCHESTRATEUR PRINCIPAL AVEC ARCHITECTURE
// =============================================================================
import React, { useState, useCallback, useMemo } from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { ConfigHeader } from './components/ConfigHeader';
import { ConfigTabs } from './components/ConfigTabs';
import { ConfigContentContainer } from './containers/ConfigContentContainer';
import { ConfigActionsContainer } from './containers/ConfigActionsContainer';
import './ConfigPanel.scss';

// =============================================================================
// CONFIG PANEL (ORCHESTRATEUR)
// =============================================================================
export const ConfigPanel: React.FC = () => {
  // =============================================================================
  // ÉTAT LOCAL UI
  // =============================================================================
  const { state } = useBuilder();
  const selection = state.ui.selection;
  const [activeTab, setActiveTab] = useState<string>('content');

  // =============================================================================
  // CALCUL DE LA SÉLECTION INFO
  // =============================================================================
  const selectionInfo = useMemo(() => {
    const { pageId, moduleId, componentId } = selection;

    // Composant sélectionné
    if (componentId && pageId) {
      const component = state.entities.components?.[componentId];
      if (component) {
        return {
          type: 'component' as const,
          label: 'Composant',
          icon: '🧩',
          elementName: component.name,
          availableTabs: ['content', 'style', 'layout'] as string[],
          selectedId: componentId
        };
      }
    }

    // Module sélectionné
    if (moduleId && pageId) {
      const module = state.entities.modules?.[moduleId];
      if (module) {
        return {
          type: 'module' as const,
          label: 'Module',
          icon: '📋',
          elementName: module.name,
          availableTabs: ['layout', 'style'] as string[],
          selectedId: moduleId
        };
      }
    }

    // Page sélectionnée
    if (pageId) {
      const page = state.entities.pages?.[pageId];
      if (page) {
        return {
          type: 'page' as const,
          label: 'Page',
          icon: '📄',
          elementName: page.name,
          availableTabs: ['style'] as string[],
          selectedId: pageId
        };
      }
    }

    return {
      type: 'none' as const,
      label: 'Configuration',
      icon: '⚙️',
      elementName: '',
      availableTabs: [] as string[],
      selectedId: ''
    };
  }, [selection, state.entities]);

  // =============================================================================
  // HANDLERS DE NAVIGATION
  // =============================================================================
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // =============================================================================
  // MISE À JOUR DE L'ONGLET ACTIF SELON LA SÉLECTION
  // =============================================================================
  React.useEffect(() => {
    if (selectionInfo.availableTabs.length > 0 && !selectionInfo.availableTabs.includes(activeTab)) {
      setActiveTab(selectionInfo.availableTabs[0] || 'content');
    }
  }, [selectionInfo.availableTabs, activeTab]);

  // =============================================================================
  // RENDER (DÉLÉGATION AUX CONTAINERS)
  // =============================================================================
  return (
    <div className="config-panel">
      {/* Header */}
      <ConfigHeader
        icon={selectionInfo.icon}
        label={selectionInfo.label}
        elementName={selectionInfo.elementName}
      />

      {/* Tabs de navigation */}
      {selectionInfo.availableTabs.length > 0 && (
        <ConfigTabs
          availableTabs={selectionInfo.availableTabs as string[]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}

      {/* Contenu de la section active */}
      <div className="panel-content">
        <ConfigContentContainer
          selectionType={selectionInfo.type}
          selectedId={selectionInfo.selectedId}
          activeTab={activeTab}
        />
      </div>

      {/* Actions rapides */}
      <ConfigActionsContainer
        selectionType={selectionInfo.type}
        selectedId={selectionInfo.selectedId}
      />
    </div>
  );
};
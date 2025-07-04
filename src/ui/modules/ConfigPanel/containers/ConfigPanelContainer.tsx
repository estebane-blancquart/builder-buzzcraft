// =============================================================================
// CONFIG PANEL CONTAINER - LOGIQUE DE CONNEXION AU STORE
// =============================================================================
import React, { useCallback, useMemo } from 'react';
import { useBuilder } from '../../../../core/context/BuilderContext';
import { useSelection } from '../../../../core/hooks';
import { componentActions, moduleActions } from '../../../../core/store/actions';
import { ConfigPanel, type SelectionInfo, type ConfigPanelProps } from '../components/ConfigPanel';
import type { Page, Module, Component } from '../../../../core/types';

// =============================================================================
// CONTAINER (LOGIQUE DE CONNEXION)
// =============================================================================
export const ConfigPanelContainer: React.FC = () => {
  const { state, dispatch } = useBuilder();
  const { state: selection } = useSelection();

  // =============================================================================
  // DONNÉES SÉLECTÉES DU STORE
  // =============================================================================
  const selectionInfo = useMemo((): SelectionInfo => {
    const { pageId, moduleId, componentId } = selection;
    
    // Aucune sélection
    if (!pageId) {
      return {
        type: 'none',
        label: 'Configuration',
        icon: '⚙️',
        elementName: '',
        availableTabs: []
      };
    }
    
    // Composant sélectionné
    if (componentId) {
      const component = state.entities.components[componentId];
      if (component) {
        return {
          type: 'component',
          label: 'Composant',
          icon: '📝',
          elementName: component.name,
          availableTabs: ['Layout', 'Style', 'Contenu']
        };
      }
    }
    
    // Module sélectionné
    if (moduleId) {
      const module = state.entities.modules[moduleId];
      if (module) {
        return {
          type: 'module',
          label: 'Module',
          icon: '📋',
          elementName: module.name,
          availableTabs: ['Layout', 'Style']
        };
      }
    }
    
    // Page sélectionnée
    const page = state.entities.pages[pageId];
    if (page) {
      return {
        type: 'page',
        label: 'Page',
        icon: '📄',
        elementName: page.name,
        availableTabs: ['Style']
      };
    }
    
    return {
      type: 'none',
      label: 'Configuration',
      icon: '⚙️',
      elementName: '',
      availableTabs: []
    };
  }, [state, selection]);

  const selectedEntity = useMemo((): Page | Module | Component | null => {
    const { pageId, moduleId, componentId } = selection;
    
    if (componentId) {
      return state.entities.components[componentId] || null;
    }
    
    if (moduleId) {
      return state.entities.modules[moduleId] || null;
    }
    
    if (pageId) {
      return state.entities.pages[pageId] || null;
    }
    
    return null;
  }, [state, selection]);

  // =============================================================================
  // CALLBACKS CONNECTÉS AU STORE
  // =============================================================================
  const handleUpdateComponent = useCallback((componentId: string, updates: any) => {
    dispatch(componentActions.update(componentId, {
      ...updates,
      updatedAt: Date.now()
    }));
  }, [dispatch]);

  const handleUpdateComponentStyle = useCallback((componentId: string, styleUpdates: any) => {
    const component = state.entities.components[componentId];
    if (!component) return;

    dispatch(componentActions.update(componentId, {
      styles: {
        ...component.styles,
        ...styleUpdates
      },
      updatedAt: Date.now()
    }));
  }, [dispatch, state.entities.components]);

  const handleUpdateComponentProps = useCallback((componentId: string, propUpdates: any) => {
    const component = state.entities.components[componentId];
    if (!component) return;

    dispatch(componentActions.update(componentId, {
      props: {
        ...component.props,
        ...propUpdates
      },
      updatedAt: Date.now()
    }));
  }, [dispatch, state.entities.components]);

  const handleUpdateModule = useCallback((moduleId: string, updates: any) => {
    dispatch(moduleActions.update(moduleId, {
      ...updates,
      updatedAt: Date.now()
    }));
  }, [dispatch]);

  const handleUpdateModuleLayout = useCallback((moduleId: string, layoutUpdates: any) => {
    const module = state.entities.modules[moduleId];
    if (!module) return;

    dispatch(moduleActions.update(moduleId, {
      layout: {
        ...module.layout,
        ...layoutUpdates
      },
      updatedAt: Date.now()
    }));
  }, [dispatch, state.entities.modules]);

  const handleUpdateModuleStyle = useCallback((moduleId: string, styleUpdates: any) => {
    const module = state.entities.modules[moduleId];
    if (!module) return;

    dispatch(moduleActions.update(moduleId, {
      styles: {
        ...module.styles,
        ...styleUpdates
      },
      updatedAt: Date.now()
    }));
  }, [dispatch, state.entities.modules]);

  // =============================================================================
  // PROPS MAPPING (STORE → COMPOSANT PUR)
  // =============================================================================
  const configPanelProps: ConfigPanelProps = {
    // Data pure
    selectionInfo,
    selectedEntity,
    
    // Callbacks découplés
    onUpdateComponent: handleUpdateComponent,
    onUpdateComponentStyle: handleUpdateComponentStyle,
    onUpdateComponentProps: handleUpdateComponentProps,
    onUpdateModule: handleUpdateModule,
    onUpdateModuleLayout: handleUpdateModuleLayout,
    onUpdateModuleStyle: handleUpdateModuleStyle,
  };

  // =============================================================================
  // RENDER (DÉLÉGATION AU COMPOSANT PUR)
  // =============================================================================
  return <ConfigPanel {...configPanelProps} />;
};
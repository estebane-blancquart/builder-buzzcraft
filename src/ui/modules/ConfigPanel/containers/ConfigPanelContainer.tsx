// =============================================================================
// CONFIG PANEL CONTAINER - LOGIQUE DE CONNEXION AU STORE + RENDU
// =============================================================================
import React, { useMemo } from 'react';
import { useBuilder } from '../../../../core/context/BuilderContext';
import { useSelection } from '../../../../core/hooks';
import type { SelectionInfo } from '../../../../core/types';

// =============================================================================
// CONTAINER (LOGIQUE + RENDU)
// =============================================================================

export const ConfigPanelContainer: React.FC = () => {
  const { state } = useBuilder(); // ✅ dispatch supprimé
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
          availableTabs: ['contenu', 'position', 'style']
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
          availableTabs: ['position', 'style']
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
        availableTabs: ['style']
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

  const selectedEntity = useMemo(() => {
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
  // RENDU CONDITIONNEL (AUCUNE SÉLECTION)
  // =============================================================================
  if (selectionInfo.type === 'none') {
    return (
      <div className="config-panel empty" style={{ padding: '20px', textAlign: 'center' }}>
        <div className="empty-state">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>{selectionInfo.icon}</div>
          <h4>{selectionInfo.label}</h4>
          <p>Sélectionnez un élément pour voir ses propriétés</p>
        </div>
      </div>
    );
  }

  // =============================================================================
  // RENDU AVEC SÉLECTION
  // =============================================================================
  return (
    <div className="config-panel" style={{ padding: '20px' }}>
      {/* Header avec infos sélection */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>{selectionInfo.icon}</span>
          <div>
            <h4 style={{ margin: 0 }}>{selectionInfo.label}</h4>
            <span style={{ color: '#666', fontSize: '14px' }}>{selectionInfo.elementName}</span>
          </div>
        </div>
      </div>

      {/* Onglets disponibles */}
      <div style={{ marginBottom: '20px' }}>
        <h5>Onglets disponibles :</h5>
        {selectionInfo.availableTabs.map(tab => (
          <span key={tab} style={{
            display: 'inline-block',
            margin: '4px',
            padding: '8px 12px',
            background: '#f0f0f0',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {tab}
          </span>
        ))}
      </div>

      {/* Info debug */}
      <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '4px', fontSize: '14px' }}>
        <div><strong>Type:</strong> {selectionInfo.type}</div>
        <div><strong>Entity:</strong> {selectedEntity ? 'Présent' : 'Null'}</div>
      </div>
    </div>
  );
};
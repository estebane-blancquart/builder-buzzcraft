// =============================================================================
// CONFIG CONTENT CONTAINER - LOGIQUE DE CONNEXION
// =============================================================================
import React, { useCallback } from 'react';
import { useBuilder } from '../../../../core/context/BuilderContext';
import { Component } from '../../../../core/types';
import { ContentForm } from '../components/ContentForm';
import { StyleForm } from '../components/StyleForm';
import { LayoutForm } from '../components/LayoutForm';

// =============================================================================
// INTERFACES
// =============================================================================
interface ConfigContentContainerProps {
  readonly selectionType: 'component' | 'module' | 'page' | 'none';
  readonly selectedId: string;
  readonly activeTab: string;
}

// =============================================================================
// CONTAINER (LOGIQUE DE CONNEXION)
// =============================================================================
export const ConfigContentContainer: React.FC<ConfigContentContainerProps> = ({
  selectionType,
  selectedId,
  activeTab
}) => {
  // =============================================================================
  // HOOKS
  // =============================================================================
  const { state } = useBuilder();

  // =============================================================================
  // SÉLECTEURS DE DONNÉES
  // =============================================================================
  const entity = selectionType === 'component' 
    ? state.entities.components?.[selectedId]
    : selectionType === 'module'
    ? state.entities.modules?.[selectedId]
    : selectionType === 'page'
    ? state.entities.pages?.[selectedId]
    : null;

  // =============================================================================
  // HANDLERS (LOGIQUE MÉTIER)
  // =============================================================================
  const handleUpdateComponentProps = useCallback((componentId: string, propUpdates: any) => {
    console.log('Update component props:', componentId, propUpdates);
    // TODO: Dispatch action pour mettre à jour les props du composant
  }, []);

  const handleUpdateComponentStyle = useCallback((componentId: string, styleUpdates: any) => {
    console.log('Update component style:', componentId, styleUpdates);
    // TODO: Dispatch action pour mettre à jour le style du composant
  }, []);

  const handleUpdateComponent = useCallback((componentId: string, updates: any) => {
    console.log('Update component:', componentId, updates);
    // TODO: Dispatch action pour mettre à jour le composant
  }, []);

  const handleUpdateModuleLayout = useCallback((moduleId: string, layoutUpdates: any) => {
    console.log('Update module layout:', moduleId, layoutUpdates);
    // TODO: Dispatch action pour mettre à jour le layout du module
  }, []);

  const handleUpdateModuleStyle = useCallback((moduleId: string, styleUpdates: any) => {
    console.log('Update module style:', moduleId, styleUpdates);
    // TODO: Dispatch action pour mettre à jour le style du module
  }, []);

  // =============================================================================
  // GUARD CLAUSE - ZONE VIDE SI PAS D'ENTITÉ
  // =============================================================================
  if (!entity) {
    return <div className="empty-state" />;
  }

  // =============================================================================
  // RENDU DU CONTENU SELON L'ONGLET ACTIF
  // =============================================================================
  switch (activeTab) {
    case 'content':
      if (selectionType === 'component' && entity) {
        return (
          <ContentForm
            component={entity as Component}
            onUpdateComponentProps={handleUpdateComponentProps}
            onUpdateComponentStyle={handleUpdateComponentStyle}
          />
        );
      }
      return <div className="empty-state" />;

    case 'style':
      return (
        <StyleForm
          entity={entity as any}
          entityType={selectionType as 'component' | 'module'}
          onUpdateComponentStyle={handleUpdateComponentStyle}
          onUpdateModuleStyle={handleUpdateModuleStyle}
        />
      );

    case 'layout':
      return (
        <LayoutForm
          entity={entity as any}
          entityType={selectionType as 'component' | 'module'}
          onUpdateComponent={handleUpdateComponent}
          onUpdateComponentStyle={handleUpdateComponentStyle}
          onUpdateModuleLayout={handleUpdateModuleLayout}
          onUpdateModuleStyle={handleUpdateModuleStyle}
        />
      );

    default:
      return <div className="empty-state" />;
  }
};
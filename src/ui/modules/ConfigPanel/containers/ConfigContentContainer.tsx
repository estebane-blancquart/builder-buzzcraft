// =============================================================================
// CONFIG CONTENT CONTAINER - LOGIQUE DE CONNEXION
// =============================================================================
import React, { useCallback } from 'react';
import { ContentForm } from '../components/ContentForm';
import { StyleForm } from '../components/StyleForm';
import { LayoutForm } from '../components/LayoutForm';

// =============================================================================
// DONNÉES MOCK
// =============================================================================
const mockEntities = {
  components: {
    'comp-1': {
      id: 'comp-1',
      name: 'Main Heading',
      type: 'title',
      props: { text: 'Bienvenue sur BuzzCraft', level: 1 },
      styles: { color: '#2d3748', fontSize: '32px' },
      layout: { span: 1, position: 0 }
    }
  } as Record<string, any>,
  modules: {
    'module-1': {
      id: 'module-1',
      name: 'Hero Section',
      layout: { desktop: 1, tablet: 1, mobile: 1 },
      styles: { background: '#f8f9fa', padding: '20px' }
    }
  } as Record<string, any>
};

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
  // SÉLECTEURS DE DONNÉES
  // =============================================================================
  const entity = selectionType === 'component' 
    ? mockEntities.components[selectedId]
    : selectionType === 'module'
    ? mockEntities.modules[selectedId]
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
  // GUARD CLAUSE
  // =============================================================================
  if (!entity) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎯</div>
        <div className="empty-title">Aucune sélection</div>
        <div className="empty-description">
          Sélectionnez un élément dans l'explorer ou la zone de prévisualisation pour voir ses propriétés
        </div>
      </div>
    );
  }

  // =============================================================================
  // RENDU DU CONTENU SELON L'ONGLET ACTIF
  // =============================================================================
  switch (activeTab) {
    case 'content':
      if (selectionType === 'component') {
        return (
          <ContentForm
            component={entity}
            onUpdateComponentProps={handleUpdateComponentProps}
            onUpdateComponentStyle={handleUpdateComponentStyle}
          />
        );
      }
      return null;

    case 'style':
      return (
        <StyleForm
          entity={entity}
          entityType={selectionType as 'component' | 'module'}
          onUpdateComponentStyle={handleUpdateComponentStyle}
          onUpdateModuleStyle={handleUpdateModuleStyle}
        />
      );

    case 'layout':
      return (
        <LayoutForm
          entity={entity}
          entityType={selectionType as 'component' | 'module'}
          onUpdateComponent={handleUpdateComponent}
          onUpdateComponentStyle={handleUpdateComponentStyle}
          onUpdateModuleLayout={handleUpdateModuleLayout}
          onUpdateModuleStyle={handleUpdateModuleStyle}
        />
      );

    default:
      return null;
  }
};
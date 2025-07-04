// =============================================================================
// COMPONENT ITEM CONTAINER - LOGIQUE DE CONNEXION AVEC DONNÉES MOCK
// =============================================================================
import React, { useCallback } from 'react';
import { ComponentItem, type ComponentItemProps } from '../components/ComponentItem';

// =============================================================================
// DONNÉES MOCK (PARTAGÉES)
// =============================================================================
const mockData = {
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
  } as Record<string, any>
};

// =============================================================================
// INTERFACE CONTAINER
// =============================================================================
interface ComponentItemContainerProps {
  readonly componentId: string;
  readonly pageId: string;
  readonly moduleId: string;
  readonly selection: { pageId?: string; moduleId?: string; componentId?: string };
  readonly hoveredItem: string | null;
  readonly onSelect: (componentId: string) => void;
  readonly onHover: (itemId: string | null) => void;
}

// =============================================================================
// CONTAINER (LOGIQUE DE CONNEXION)
// =============================================================================
export const ComponentItemContainer: React.FC<ComponentItemContainerProps> = ({
  componentId,
  selection,
  hoveredItem,
  onSelect,
  onHover
}) => {
  // =============================================================================
  // SÉLECTEURS DE DONNÉES
  // =============================================================================
  const component = mockData.components[componentId];

  // =============================================================================
  // ÉTAT DÉRIVÉ
  // =============================================================================
  const isSelected = selection.componentId === componentId;

  // =============================================================================
  // HANDLERS (LOGIQUE MÉTIER)
  // =============================================================================
  const handleSelect = useCallback((selectedComponentId: string) => {
    onSelect(selectedComponentId);
  }, [onSelect]);

  const handleEdit = useCallback((selectedComponentId: string, newName: string) => {
    console.log('Edit component:', selectedComponentId, newName);
    // TODO: Dispatch action pour modifier le nom
  }, []);

  const handleDelete = useCallback((selectedComponentId: string) => {
    console.log('Delete component:', selectedComponentId);
    // TODO: Dispatch action pour supprimer le composant
  }, []);

  // =============================================================================
  // GUARD CLAUSE
  // =============================================================================
  if (!component) {
    return null;
  }

  // =============================================================================
  // PROPS MAPPING (STORE → COMPOSANT PUR)
  // =============================================================================
  const componentItemProps: ComponentItemProps = {
    // Data pure
    component,
    
    // État UI dérivé
    isSelected,
    hoveredItem,
    
    // Callbacks découplés
    onSelect: handleSelect,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onHover,
  };

  // =============================================================================
  // RENDER (DÉLÉGATION AU COMPOSANT PUR)
  // =============================================================================
  return <ComponentItem {...componentItemProps} />;
};
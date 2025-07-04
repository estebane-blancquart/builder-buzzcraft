// =============================================================================
// COMPONENT ITEM CONTAINER - LOGIQUE DE CONNEXION AU STORE
// =============================================================================
import React, { useCallback } from 'react';
import { useBuilder } from '../../../../core/context/BuilderContext';
import { useSelection } from '../../../../core/hooks';
import { componentActions } from '../../../../core/store/actions';
import { ComponentItem, type ComponentItemProps } from '../components/ComponentItem';

// =============================================================================
// INTERFACE CONTAINER
// =============================================================================
interface ComponentItemContainerProps {
  readonly componentId: string;
  readonly moduleId: string;
  readonly pageId: string;
  readonly onSelect: (componentId: string) => void;
}

// =============================================================================
// CONTAINER (LOGIQUE DE CONNEXION)
// =============================================================================
export const ComponentItemContainer: React.FC<ComponentItemContainerProps> = ({
  componentId,
  moduleId,
  pageId,
  onSelect
}) => {
  const { state, dispatch } = useBuilder();
  const { state: selection, actions } = useSelection();

  // =============================================================================
  // DONNÉES SÉLECTÉES DU STORE
  // =============================================================================
  const component = state.entities.components[componentId];
  const isSelected = selection.componentId === componentId;

  // =============================================================================
  // CALLBACKS CONNECTÉS AU STORE
  // =============================================================================
  const handleSelect = useCallback((componentId: string) => {
    onSelect(componentId);
  }, [onSelect]);

  const handleEdit = useCallback((componentId: string, newName: string) => {
    dispatch(componentActions.update(componentId, { 
      name: newName,
      updatedAt: Date.now()
    }));
  }, [dispatch]);

  const handleDelete = useCallback((componentId: string) => {
    // Supprimer le composant
    dispatch(componentActions.remove(componentId, moduleId));
    
    // Clear selection si ce composant était sélectionné
    if (selection.componentId === componentId) {
      actions.selectModule(pageId, moduleId);
    }
  }, [dispatch, selection.componentId, actions, pageId, moduleId]);

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
    pageId,
    moduleId,
    
    // État UI dérivé
    isSelected,
    
    // Callbacks découplés
    onSelect: handleSelect,
    onEdit: handleEdit,
    onDelete: handleDelete,
  };

  // =============================================================================
  // RENDER (DÉLÉGATION AU COMPOSANT PUR)
  // =============================================================================
  return <ComponentItem {...componentItemProps} />;
};
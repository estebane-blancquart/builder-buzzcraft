// =============================================================================
// CONFIG ACTIONS CONTAINER - LOGIQUE DE CONNEXION
// =============================================================================
import React, { useCallback } from 'react';
import { ConfigActions, type ConfigActionsProps } from '../components/ConfigActions';

// =============================================================================
// INTERFACES
// =============================================================================
interface ConfigActionsContainerProps {
  readonly selectionType: 'component' | 'module' | 'page' | 'none';
  readonly selectedId: string;
}

// =============================================================================
// CONTAINER (LOGIQUE DE CONNEXION)
// =============================================================================
export const ConfigActionsContainer: React.FC<ConfigActionsContainerProps> = ({
  selectionType,
  selectedId
}) => {
  // =============================================================================
  // HANDLERS (LOGIQUE MÉTIER)
  // =============================================================================
  const handleDuplicate = useCallback(() => {
    console.log('Duplicate element:', selectionType, selectedId);
    // TODO: Dispatch action pour dupliquer l'élément
    switch (selectionType) {
      case 'component':
        // TODO: componentActions.duplicate(selectedId)
        break;
      case 'module':
        // TODO: moduleActions.duplicate(selectedId)
        break;
      case 'page':
        // TODO: pageActions.duplicate(selectedId)
        break;
    }
  }, [selectionType, selectedId]);

  const handleDelete = useCallback(() => {
    console.log('Delete element:', selectionType, selectedId);
    // TODO: Dispatch action pour supprimer l'élément
    switch (selectionType) {
      case 'component':
        // TODO: componentActions.remove(selectedId)
        break;
      case 'module':
        // TODO: moduleActions.remove(selectedId)
        break;
      case 'page':
        // TODO: pageActions.remove(selectedId)
        break;
    }
  }, [selectionType, selectedId]);

  // =============================================================================
  // GUARD CLAUSE
  // =============================================================================
  if (selectionType === 'none') {
    return null;
  }

  // =============================================================================
  // PROPS MAPPING (STORE → COMPOSANT PUR)
  // =============================================================================
  const configActionsProps: ConfigActionsProps = {
    onDuplicate: handleDuplicate,
    onDelete: handleDelete
  };

  // =============================================================================
  // RENDER (DÉLÉGATION AU COMPOSANT PUR)
  // =============================================================================
  return <ConfigActions {...configActionsProps} />;
};
// =============================================================================
// CONFIG ACTIONS - COMPOSANT PUR DÉCOUPLÉ
// =============================================================================
import React from 'react';

// =============================================================================
// INTERFACES PROPS
// =============================================================================
export interface ConfigActionsProps {
  readonly onDuplicate: () => void;
  readonly onDelete: () => void;
}

// =============================================================================
// COMPOSANT CONFIG ACTIONS PUR
// =============================================================================
export const ConfigActions: React.FC<ConfigActionsProps> = React.memo(({
  onDuplicate,
  onDelete
}) => {
  return (
    <div className="panel-footer">
      <div className="quick-actions">
        <button className="action-btn duplicate-btn" onClick={onDuplicate}>
          <span>📋</span>
          <span>Dupliquer</span>
        </button>
        <button className="action-btn delete-btn" onClick={onDelete}>
          <span>🗑️</span>
          <span>Supprimer</span>
        </button>
      </div>
    </div>
  );
});

ConfigActions.displayName = 'ConfigActions';
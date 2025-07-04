// =============================================================================
// COMPONENT ITEM - COMPOSANT PUR DÉCOUPLÉ
// =============================================================================
import React, { useState } from 'react';
import type { Component } from '../../../../core/types';

// =============================================================================
// INTERFACES PROPS (DÉCOUPLÉES)
// =============================================================================
export interface ComponentItemProps {
  // Data pure
  readonly component: Component;
  readonly pageId: string;
  readonly moduleId: string;
  
  // État UI dérivé
  readonly isSelected: boolean;
  
  // Callbacks découplés
  readonly onSelect: (componentId: string) => void;
  readonly onEdit: (componentId: string, newName: string) => void;
  readonly onDelete: (componentId: string) => void;
}

// =============================================================================
// COMPOSANT COMPONENT ITEM PUR
// =============================================================================
export const ComponentItem: React.FC<ComponentItemProps> = React.memo(({
  component,
  pageId, // ✅ Utilisé dans le JSX (data attributes)
  moduleId, // ✅ Utilisé dans le JSX (data attributes)
  isSelected,
  onSelect,
  onEdit,
  onDelete
}) => {
  // =============================================================================
  // ÉTAT LOCAL (ÉDITION INLINE)
  // =============================================================================
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  // =============================================================================
  // HANDLERS PURS (AUCUNE DÉPENDANCE STORE)
  // =============================================================================
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component.id);
  };

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(component.name);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditName('');
  };

  const handleEditSave = () => {
    if (editName.trim() && editName !== component.name) {
      onEdit(component.id, editName.trim());
    }
    setIsEditing(false);
    setEditName('');
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer le composant "${component.name}" ?`)) {
      onDelete(component.id);
    }
  };

  // =============================================================================
  // ICÔNE PAR TYPE
  // =============================================================================
  const getComponentIcon = (type: string): string => {
    switch (type) {
      case 'title':
        return '📝';
      case 'text':
        return '📄';
      case 'image':
        return '🖼️';
      case 'button':
        return '🔘';
      case 'list':
        return '📋';
      case 'video':
        return '🎥';
      case 'spacer':
        return '⬜';
      case 'icon':
        return '⭐';
      default:
        return '📝';
    }
  };

  // =============================================================================
  // RENDER DÉCOUPLÉ
  // =============================================================================
  return (
    <div className={`component-item ${isSelected ? 'selected' : ''}`} data-page-id={pageId} data-module-id={moduleId}>
      <div className="component-header" onClick={handleSelect}>
        <div className="component-info">
          <div className="component-icon">
            {getComponentIcon(component.type)}
          </div>
          
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={handleEditCancel}
              className="component-name-input"
              autoFocus
            />
          ) : (
            <span className="component-name">{component.name}</span>
          )}
          
          <span className="component-type">({component.type})</span>
        </div>

        <div className="component-actions">
          <button 
            className="action-btn edit-btn"
            onClick={handleEditStart}
            title="Éditer"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={handleDelete}
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
});

// Display name pour debug
ComponentItem.displayName = 'ComponentItem';
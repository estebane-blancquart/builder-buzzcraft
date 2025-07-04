// =============================================================================
// COMPONENT ITEM - COMPOSANT COMPONENT DANS L'EXPLORER
// =============================================================================
import React, { useState } from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { ComponentType } from '../../../core/types';
import { componentActions } from '../../../core/store/actions';

// =============================================================================
// INTERFACE
// =============================================================================
interface ComponentItemProps {
  componentId: string;
  moduleId: string;
  pageId: string;
  isSelected: boolean;
  onSelect: (pageId: string, moduleId: string, componentId: string) => void;
}

// =============================================================================
// COMPOSANT COMPONENT ITEM
// =============================================================================
export const ComponentItem: React.FC<ComponentItemProps> = ({ 
  componentId, 
  moduleId, 
  pageId, 
  isSelected, 
  onSelect 
}) => {
  const { state, dispatch } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  
  const component = state.entities.components?.[componentId];
  if (!component) return null;

  // =============================================================================
  // HANDLERS
  // =============================================================================
  const handleEditStart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditName(component.name);
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (editName.trim() && editName !== component.name) {
      dispatch(componentActions.update(componentId, {
        name: editName.trim(),
        updatedAt: Date.now()
      }));
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setEditName(component.name);
      setIsEditing(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer le composant "${component.name}" ?`)) {
      dispatch(componentActions.remove(componentId, moduleId));
    }
  };

  // =============================================================================
  // HELPERS
  // =============================================================================
  const getComponentIcon = (type: ComponentType) => {
    const icons = {
      title: '📝',
      text: '📄',
      image: '🖼️',
      button: '🔵',
      icon: '⭐',
      spacer: '📏',
      list: '📋',
      video: '🎬'
    };
    return icons[type] || '🧩';
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div 
      className={`component-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(pageId, moduleId, componentId)}
    >
      <div className="component-content">
        <span className="component-icon">{getComponentIcon(component.type)}</span>
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
            className="component-edit-input"
            autoFocus
          />
        ) : (
          <span className="component-title">{component.name}</span>
        )}
      </div>
      <div className="component-actions">
        <button 
          className="action-btn"
          onClick={handleEditStart}
          title="Renommer"
        >
          ✏️
        </button>
        <button 
          className="action-btn delete"
          onClick={handleDelete}
          title="Supprimer"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
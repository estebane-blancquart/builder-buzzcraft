// =============================================================================
// COMPONENT ITEM - COMPOSANT PUR DÉCOUPLÉ  
// =============================================================================
import React, { useState } from 'react';

// =============================================================================
// ICÔNES (EXTRAITES DU EXPLORER PANEL)
// =============================================================================
const Icons = {
  Component: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="7" cy="7" r="2" fill="currentColor"/>
    </svg>
  ),
  
  Delete: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M8 3V2C8 1.44772 7.55228 1 7 1H5C4.44772 1 4 1.44772 4 2V3M1.5 3H10.5M9.5 3V9C9.5 9.55228 9.05228 10 8.5 10H3.5C2.94772 10 2.5 9.55228 2.5 9V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// =============================================================================
// INTERFACES PROPS (DÉCOUPLÉES)
// =============================================================================
export interface ComponentItemProps {
  // Data pure
  readonly component: {
    readonly id: string;
    readonly name: string;
    readonly type: string;
  };
  
  // État UI dérivé
  readonly isSelected: boolean;
  readonly hoveredItem: string | null;
  
  // Callbacks découplés
  readonly onSelect: (componentId: string) => void;
  readonly onEdit: (componentId: string, newName: string) => void;
  readonly onDelete: (componentId: string) => void;
  readonly onHover: (itemId: string | null) => void;
}

// =============================================================================
// COMPOSANT COMPONENT ITEM PUR
// =============================================================================
export const ComponentItem: React.FC<ComponentItemProps> = React.memo(({
  component,
  isSelected,
  hoveredItem,
  onSelect,
  onEdit,
  onDelete,
  onHover
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
    setIsEditing(true);
    setEditName(component.name);
  };

  const handleEditSave = () => {
    if (editName.trim() && editName !== component.name) {
      onEdit(component.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(component.id);
  };

  const handleMouseEnter = () => {
    onHover(component.id);
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  // =============================================================================
  // ÉTAT DÉRIVÉ
  // =============================================================================
  const isHovered = hoveredItem === component.id;

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="tree-node tree-node--component">
      <div
        className={`tree-node__content ${isSelected ? 'tree-node--selected' : ''}`}
        onClick={handleSelect}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="tree-node__spacer"></div>

        <div className="tree-node__icon">
          <Icons.Component />
        </div>

        <div className="tree-node__label">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={handleKeyDown}
              className="tree-node__edit-input"
              autoFocus
            />
          ) : (
            <span onDoubleClick={handleEditStart}>{component.name}</span>
          )}
        </div>

        {isHovered && !isEditing && (
          <div className="tree-node__actions">
            <button
              className="tree-action"
              onClick={handleDelete}
              title="Delete component"
            >
              <Icons.Delete />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
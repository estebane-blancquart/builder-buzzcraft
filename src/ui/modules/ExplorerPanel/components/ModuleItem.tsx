// =============================================================================
// MODULE ITEM - COMPOSANT PUR DÉCOUPLÉ  
// =============================================================================
import React, { useState } from 'react';
import { ComponentItemContainer } from '../containers/ComponentItemContainer';

// =============================================================================
// ICÔNES (EXTRAITES DU EXPLORER PANEL)
// =============================================================================
const Icons = {
  ChevronRight: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  Module: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6 5H10M6 7H10M6 9H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  
  Add: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
export interface ModuleItemProps {
  // Data pure
  readonly module: {
    readonly id: string;
    readonly name: string;
    readonly type: string;
  };
  readonly components: readonly any[];
  readonly pageId: string;
  
  // État UI dérivé
  readonly isSelected: boolean;
  readonly isExpanded: boolean;
  readonly hoveredItem: string | null;
  readonly selection: { pageId?: string; moduleId?: string; componentId?: string };
  
  // Callbacks découplés
  readonly onSelect: (moduleId: string) => void;
  readonly onToggleExpand: (moduleId: string) => void;
  readonly onEdit: (moduleId: string, newName: string) => void;
  readonly onDelete: (moduleId: string) => void;
  readonly onCreateComponent: (moduleId: string) => void;
  readonly onComponentSelect: (componentId: string) => void;
  readonly onHover: (itemId: string | null) => void;
}

// =============================================================================
// MODAL TYPES DE COMPOSANTS
// =============================================================================
const COMPONENT_TYPES = [
  { id: 'heading', label: 'Heading', icon: 'H' },
  { id: 'paragraph', label: 'Paragraph', icon: 'P' },
  { id: 'image', label: 'Image', icon: '🖼️' },
  { id: 'button', label: 'Button', icon: '⬜' },
  { id: 'list', label: 'List', icon: '📝' },
  { id: 'video', label: 'Video', icon: '🎥' },
  { id: 'spacer', label: 'Spacer', icon: '⬜' },
  { id: 'quote', label: 'Quote', icon: '💬' }
];

// =============================================================================
// COMPOSANT MODULE ITEM PUR
// =============================================================================
export const ModuleItem: React.FC<ModuleItemProps> = React.memo(({
  module,
  components,
  pageId,
  isSelected,
  isExpanded,
  hoveredItem,
  selection,
  onSelect,
  onToggleExpand,
  onEdit,
  onDelete,
  onCreateComponent,
  onComponentSelect,
  onHover
}) => {
  // =============================================================================
  // ÉTAT LOCAL (ÉDITION INLINE + MODAL)
  // =============================================================================
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =============================================================================
  // HANDLERS PURS (AUCUNE DÉPENDANCE STORE)
  // =============================================================================
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(module.id);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(module.id);
  };

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditName(module.name);
  };

  const handleEditSave = () => {
    if (editName.trim() && editName !== module.name) {
      onEdit(module.id, editName.trim());
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
    onDelete(module.id);
  };

  const handleCreateComponent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleComponentTypeSelect = (componentType: string) => {
    onCreateComponent(componentType);
    setIsModalOpen(false);
  };

  const handleMouseEnter = () => {
    onHover(module.id);
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  // =============================================================================
  // ÉTAT DÉRIVÉ
  // =============================================================================
  const isHovered = hoveredItem === module.id;

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <>
      <div className="tree-node tree-node--module">
        <div
          className={`tree-node__content ${isSelected ? 'tree-node--selected' : ''}`}
          onClick={handleSelect}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`tree-node__toggle ${isExpanded ? 'tree-node__toggle--expanded' : ''}`}
            onClick={handleToggleExpand}
          >
            <Icons.ChevronRight />
          </button>

          <div className="tree-node__icon">
            <Icons.Module />
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
              <span onDoubleClick={handleEditStart}>{module.name}</span>
            )}
          </div>

          {isHovered && !isEditing && (
            <div className="tree-node__actions">
              <button
                className="tree-action"
                onClick={handleDelete}
                title="Delete module"
              >
                <Icons.Delete />
              </button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="tree-children">
            {components.length > 0 ? (
              components.map(component => (
                <ComponentItemContainer
                  key={component.id}
                  componentId={component.id}
                  pageId={pageId}
                  moduleId={module.id}
                  selection={selection}
                  hoveredItem={hoveredItem}
                  onSelect={onComponentSelect}
                  onHover={onHover}
                />
              ))
            ) : (
              <div className="empty-list">
                <span className="empty-text">No components</span>
              </div>
            )}
            
            <div className="add-item add-item--component">
              <button 
                className="add-item__btn"
                onClick={handleCreateComponent}
                title="Add Component"
              >
                <Icons.Add />
                <span>New Component</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL SÉLECTION TYPE COMPOSANT */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose Component Type</h3>
              <button 
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="component-types-grid">
                {COMPONENT_TYPES.map(type => (
                  <button
                    key={type.id}
                    className="component-type-btn"
                    onClick={() => handleComponentTypeSelect(type.id)}
                  >
                    <span className="component-type-icon">{type.icon}</span>
                    <span className="component-type-label">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
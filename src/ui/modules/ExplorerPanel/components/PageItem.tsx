// =============================================================================
// PAGE ITEM - COMPOSANT PUR DÉCOUPLÉ  
// =============================================================================
import React, { useState } from 'react';
import { ModuleItemContainer } from '../containers/ModuleItemContainer';

// =============================================================================
// ICÔNES (EXTRAITES DU EXPLORER PANEL)
// =============================================================================
const Icons = {
  ChevronRight: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  Page: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M8.5 1.5H3.5C3.22386 1.5 3 1.72386 3 2V12C3 12.2761 3.22386 12.5 3.5 12.5H10.5C10.7761 12.5 11 12.2761 11 12V4.5L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M8.5 1.5V4.5H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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
export interface PageItemProps {
  // Data pure
  readonly page: {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
    readonly title: string;
  };
  readonly modules: readonly any[];
  
  // État UI dérivé
  readonly isSelected: boolean;
  readonly isExpanded: boolean;
  readonly expandedModules: Set<string>;
  readonly hoveredItem: string | null;
  readonly selection: { pageId?: string; moduleId?: string; componentId?: string };
  
  // Callbacks découplés
  readonly onSelect: (pageId: string) => void;
  readonly onToggleExpand: (pageId: string) => void;
  readonly onToggleModuleExpand: (moduleId: string) => void;
  readonly onEdit: (pageId: string, newName: string) => void;
  readonly onDelete: (pageId: string) => void;
  readonly onCreateModule: (pageId: string) => void;
  readonly onComponentSelect: (pageId: string, moduleId: string, componentId: string) => void;
  readonly onSelectItem: (type: string, id: string) => void;
  readonly onHover: (itemId: string | null) => void;
}

// =============================================================================
// COMPOSANT PAGE ITEM PUR
// =============================================================================
export const PageItem: React.FC<PageItemProps> = React.memo(({
  page,
  modules,
  isSelected,
  isExpanded,
  expandedModules,
  hoveredItem,
  selection,
  onSelect,
  onToggleExpand,
  onToggleModuleExpand,
  onEdit,
  onDelete,
  onCreateModule,
  onComponentSelect,
  onSelectItem,
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
    onSelect(page.id);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(page.id);
  };

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditName(page.name);
  };

  const handleEditSave = () => {
    if (editName.trim() && editName !== page.name) {
      onEdit(page.id, editName.trim());
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
    onDelete(page.id);
  };

  const handleCreateModule = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreateModule(page.id);
  };

  const handleMouseEnter = () => {
    onHover(page.id);
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  // =============================================================================
  // ÉTAT DÉRIVÉ
  // =============================================================================
  const isHovered = hoveredItem === page.id;

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="tree-node tree-node--page">
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
          <Icons.Page />
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
            <span onDoubleClick={handleEditStart}>{page.name}</span>
          )}
        </div>

        {isHovered && !isEditing && (
          <div className="tree-node__actions">
            <button
              className="tree-action"
              onClick={handleDelete}
              title="Delete page"
            >
              <Icons.Delete />
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="tree-children">
          {modules.length > 0 ? (
            modules.map(module => (
              <ModuleItemContainer
                key={module.id}
                moduleId={module.id}
                pageId={page.id}
                isExpanded={expandedModules.has(module.id)}
                selection={selection}
                hoveredItem={hoveredItem}
                onToggleExpand={onToggleModuleExpand}
                onComponentSelect={onComponentSelect}
                onSelectItem={onSelectItem}
                onHover={onHover}
              />
            ))
          ) : (
            <div className="empty-list">
              <span className="empty-text">No modules</span>
            </div>
          )}
          
          <div className="add-item add-item--module">
            <button 
              className="add-item__btn"
              onClick={handleCreateModule}
              title="Add Module"
            >
              <Icons.Add />
              <span>New Module</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
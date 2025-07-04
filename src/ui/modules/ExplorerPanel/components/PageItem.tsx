// =============================================================================
// PAGE ITEM - COMPOSANT PUR DÉCOUPLÉ
// =============================================================================
import React, { useState } from 'react';
import type { Page, Module } from '../../../../core/types';
import { ModuleItemContainer } from '../containers/ModuleItemContainer';

// =============================================================================
// INTERFACES PROPS (DÉCOUPLÉES)
// =============================================================================
export interface PageItemProps {
  // Data pure
  readonly page: Page;
  readonly modules: readonly Module[];
  
  // État UI dérivé
  readonly isSelected: boolean;
  readonly isExpanded: boolean;
  readonly expandedModules: Set<string>;
  
  // Callbacks découplés
  readonly onSelect: (pageId: string) => void;
  readonly onToggleExpand: (pageId: string) => void;
  readonly onEdit: (pageId: string, newName: string) => void;
  readonly onDelete: (pageId: string) => void;
  readonly onCreateModule: (pageId: string) => void;
  readonly onModuleToggleExpand: (moduleId: string) => void;
  readonly onComponentSelect: (pageId: string, moduleId: string, componentId: string) => void;
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
  onSelect,
  onToggleExpand,
  onEdit,
  onDelete,
  onCreateModule,
  onModuleToggleExpand,
  onComponentSelect
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
    setEditName(page.name);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditName('');
  };

  const handleEditSave = () => {
    if (editName.trim() && editName !== page.name) {
      onEdit(page.id, editName.trim());
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
    if (window.confirm(`Supprimer la page "${page.name}" ?`)) {
      onDelete(page.id);
    }
  };

  const handleCreateModule = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreateModule(page.id);
  };

  // =============================================================================
  // RENDER DÉCOUPLÉ
  // =============================================================================
  return (
    <div className={`page-item ${isSelected ? 'selected' : ''}`}>
      {/* En-tête page */}
      <div className="page-header" onClick={handleSelect}>
        <div className="page-expand">
          <button 
            className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
            onClick={handleToggleExpand}
            title={isExpanded ? 'Réduire' : 'Développer'}
          >
            {isExpanded ? '📂' : '📁'}
          </button>
        </div>

        <div className="page-info">
          <div className="page-icon">📄</div>
          
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={handleEditCancel}
              className="page-name-input"
              autoFocus
            />
          ) : (
            <span className="page-name">{page.name}</span>
          )}
        </div>

        <div className="page-actions">
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

      {/* Contenu page (modules) */}
      {isExpanded && (
        <div className="page-content">
          {modules.map(module => (
            <ModuleItemContainer
              key={module.id}
              moduleId={module.id}
              pageId={page.id}
              isExpanded={expandedModules.has(module.id)}
              onToggleExpand={onModuleToggleExpand}
              onComponentSelect={onComponentSelect}
            />
          ))}
          
          {/* Bouton ajouter module */}
          <div className="add-module-section">
            <button 
              className="add-btn add-module-btn"
              onClick={handleCreateModule}
              title="Ajouter un module"
            >
              ➕ Ajouter module
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// Display name pour debug
PageItem.displayName = 'PageItem';
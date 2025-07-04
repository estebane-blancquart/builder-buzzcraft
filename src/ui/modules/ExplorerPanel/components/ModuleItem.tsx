// =============================================================================
// MODULE ITEM - COMPOSANT PUR DÉCOUPLÉ  
// =============================================================================
import React, { useState } from 'react';
import type { Module, Component } from '../../../../core/types';
import { ComponentItemContainer } from '../containers/ComponentItemContainer';

// =============================================================================
// INTERFACES PROPS (DÉCOUPLÉES)
// =============================================================================
export interface ModuleItemProps {
  // Data pure
  readonly module: Module;
  readonly components: readonly Component[];
  readonly pageId: string;
  
  // État UI dérivé
  readonly isSelected: boolean;
  readonly isExpanded: boolean;
  
  // Callbacks découplés
  readonly onSelect: (moduleId: string) => void;
  readonly onToggleExpand: (moduleId: string) => void;
  readonly onEdit: (moduleId: string, newName: string) => void;
  readonly onDelete: (moduleId: string) => void;
  readonly onCreateComponent: (moduleId: string, componentType: string) => void;
  readonly onComponentSelect: (componentId: string) => void;
}

// =============================================================================
// COMPOSANT MODULE ITEM PUR
// =============================================================================
export const ModuleItem: React.FC<ModuleItemProps> = React.memo(({
  module,
  components,
  pageId,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  onEdit,
  onDelete,
  onCreateComponent,
  onComponentSelect
}) => {
  // =============================================================================
  // ÉTAT LOCAL (ÉDITION INLINE)
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
    setEditName(module.name);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditName('');
  };

  const handleEditSave = () => {
    if (editName.trim() && editName !== module.name) {
      onEdit(module.id, editName.trim());
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
    if (window.confirm(`Supprimer le module "${module.name}" ?`)) {
      onDelete(module.id);
    }
  };

  const handleShowModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleComponentCreate = (componentType: string) => {
    onCreateComponent(module.id, componentType);
    setIsModalOpen(false);
  };

  // =============================================================================
  // RENDER DÉCOUPLÉ
  // =============================================================================
  return (
    <div className={`module-item ${isSelected ? 'selected' : ''}`}>
      {/* En-tête module */}
      <div className="module-header" onClick={handleSelect}>
        <div className="module-expand">
          <button 
            className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
            onClick={handleToggleExpand}
            title={isExpanded ? 'Réduire' : 'Développer'}
          >
            {isExpanded ? '📂' : '📁'}
          </button>
        </div>

        <div className="module-info">
          <div className="module-icon">📋</div>
          
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={handleEditCancel}
              className="module-name-input"
              autoFocus
            />
          ) : (
            <span className="module-name">{module.name}</span>
          )}
          
          <span className="module-type">({module.type})</span>
        </div>

        <div className="module-actions">
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

      {/* Contenu module (composants) */}
      {isExpanded && (
        <div className="module-content">
          {components.map(component => (
            <ComponentItemContainer
              key={component.id}
              componentId={component.id}
              moduleId={module.id}
              pageId={pageId}
              onSelect={onComponentSelect}
            />
          ))}
          
          {/* Bouton ajouter composant */}
          <div className="add-component-section">
            <button 
              className="add-btn add-component-btn"
              onClick={handleShowModal}
              title="Ajouter un composant"
            >
              ➕ Ajouter composant
            </button>
          </div>
        </div>
      )}

      {/* Modal sélection composants */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Choisir un composant</h3>
            <div className="component-grid">
              {[
                { type: 'heading', label: 'Titre', icon: '📝' },
                { type: 'paragraph', label: 'Paragraphe', icon: '📄' },
                { type: 'image', label: 'Image', icon: '🖼️' },
                { type: 'button', label: 'Bouton', icon: '🔘' },
                { type: 'list', label: 'Liste', icon: '📋' },
                { type: 'video', label: 'Vidéo', icon: '🎥' },
                { type: 'spacer', label: 'Espacement', icon: '⬜' },
                { type: 'quote', label: 'Citation', icon: '💬' }
              ].map(({ type, label, icon }) => (
                <button
                  key={type}
                  className="component-option"
                  onClick={() => handleComponentCreate(type)}
                >
                  <span className="component-icon">{icon}</span>
                  <span className="component-label">{label}</span>
                </button>
              ))}
            </div>
            <button 
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// Display name pour debug
ModuleItem.displayName = 'ModuleItem';
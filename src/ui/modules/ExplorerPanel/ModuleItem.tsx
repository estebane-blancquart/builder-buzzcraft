// =============================================================================
// MODULE ITEM - COMPOSANT MODULE DANS L'EXPLORER
// =============================================================================
import React, { useState } from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { generateComponentId, generateDefaultComponentName } from '../../../core/utils';
import { ModuleType, ComponentType, TitleProps, ButtonProps, ImageProps, ListProps, SpacerProps, TextProps, VideoProps } from '../../../core/types';
import { ComponentItem } from './ComponentItem';
import { ComponentSelectorModal } from './ComponentSelectorModal';
import { moduleActions, componentActions } from '../../../core/store/actions';

// =============================================================================
// INTERFACE
// =============================================================================
interface ModuleItemProps {
  moduleId: string;
  pageId: string;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (pageId: string, moduleId: string) => void;
  onSelectComponent: (pageId: string, moduleId: string, componentId: string) => void;
  onToggleExpand: (moduleId: string) => void;
}

// =============================================================================
// COMPOSANT MODULE ITEM
// =============================================================================
export const ModuleItem: React.FC<ModuleItemProps> = ({ 
  moduleId, 
  pageId, 
  isSelected, 
  isExpanded,
  onSelect, 
  onSelectComponent,
  onToggleExpand
}) => {
  const { state, dispatch } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const module = state.entities.modules?.[moduleId];
  const moduleComponentIds = state.relations.moduleComponents?.[moduleId] || [];
  
  if (!module) return null;

  // =============================================================================
  // HANDLERS
  // =============================================================================
  const handleClick = () => {
    // Un clic = sélectionner seulement
    onSelect(pageId, moduleId);
  };

  const handleDoubleClick = () => {
    // Double-clic = déplier/fermer
    onToggleExpand(moduleId);
  };

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(module.name);
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (editName.trim() && editName !== module.name) {
      dispatch(moduleActions.update(moduleId, {
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
      setEditName(module.name);
      setIsEditing(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer le module "${module.name}" ?`)) {
      dispatch(moduleActions.remove(moduleId, pageId));
    }
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectComponentType = (componentType: string) => {
    const newComponentId = generateComponentId();
    
    // Générer le nom par défaut selon le type
    const moduleComponents = moduleComponentIds.map(id => state.entities.components?.[id]).filter(Boolean);
    const existingComponentNames = moduleComponents.map(comp => comp?.name || '');
    
    // Créer le composant selon le type sélectionné
    let newComponent: any;
    
    switch (componentType) {
      case 'heading':
        newComponent = {
          id: newComponentId,
          name: generateDefaultComponentName('title', existingComponentNames),
          type: 'title' as ComponentType,
          span: 1,
          position: moduleComponentIds.length,
          props: {
            text: 'Nouveau titre',
            level: 2 as const,
            align: 'left' as const
          } as TitleProps,
          styles: {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        break;
      
      case 'paragraph':
        newComponent = {
          id: newComponentId,
          name: generateDefaultComponentName('text', existingComponentNames),
          type: 'text' as ComponentType,
          span: 1,
          position: moduleComponentIds.length,
          props: {
            text: 'Nouveau paragraphe de contenu.',
            align: 'left' as const
          } as TextProps,
          styles: {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        break;
      
      case 'image':
        newComponent = {
          id: newComponentId,
          name: generateDefaultComponentName('image', existingComponentNames),
          type: 'image' as ComponentType,
          span: 1,
          position: moduleComponentIds.length,
          props: {
            src: '',
            alt: 'Image'
          } as ImageProps,
          styles: {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        break;
      
      case 'button':
        newComponent = {
          id: newComponentId,
          name: generateDefaultComponentName('button', existingComponentNames),
          type: 'button' as ComponentType,
          span: 1,
          position: moduleComponentIds.length,
          props: {
            text: 'Cliquez ici',
            variant: 'primary' as const,
            size: 'md' as const
          } as ButtonProps,
          styles: {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        break;
      
      case 'list':
        newComponent = {
          id: newComponentId,
          name: generateDefaultComponentName('list', existingComponentNames),
          type: 'list' as ComponentType,
          span: 1,
          position: moduleComponentIds.length,
          props: {
            items: ['Élément 1', 'Élément 2', 'Élément 3'],
            listStyle: 'bulleted' as const
          } as ListProps,
          styles: {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        break;
      
      case 'video':
        newComponent = {
          id: newComponentId,
          name: generateDefaultComponentName('video', existingComponentNames),
          type: 'video' as ComponentType,
          span: 1,
          position: moduleComponentIds.length,
          props: {
            src: '',
            controls: true
          } as VideoProps,
          styles: {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        break;
      
      case 'quote':
        newComponent = {
          id: newComponentId,
          name: generateDefaultComponentName('text', existingComponentNames),
          type: 'text' as ComponentType,
          span: 1,
          position: moduleComponentIds.length,
          props: {
            text: 'Citation inspirante...',
            align: 'center' as const
          } as TextProps,
          styles: {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        break;
      
      case 'spacer':
        newComponent = {
          id: newComponentId,
          name: generateDefaultComponentName('spacer', existingComponentNames),
          type: 'spacer' as ComponentType,
          span: 1,
          position: moduleComponentIds.length,
          props: {
            height: '40px'
          } as SpacerProps,
          styles: {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        break;
      
      default:
        newComponent = {
          id: newComponentId,
          name: generateDefaultComponentName('title', existingComponentNames),
          type: 'title' as ComponentType,
          span: 1,
          position: moduleComponentIds.length,
          props: {
            text: `Composant ${componentType}`,
            level: 2 as const,
            align: 'left' as const
          } as TitleProps,
          styles: {},
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
    }

    dispatch(componentActions.add(moduleId, newComponent));
  };

  // =============================================================================
  // HELPERS
  // =============================================================================
  const getModuleIcon = (type: ModuleType) => {
    const icons = {
      section: '📋',
      hero: '🎯',
      features: '⭐',
      gallery: '🖼️',
      contact: '📞',
      footer: '🦶'
    };
    return icons[type] || '🧩';
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <>
      <div className="module-item-container">
        <div 
          className={`module-item ${isSelected && !state.ui.selection.componentId ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <div className="module-content">
            <span className="expand-icon">
              {moduleComponentIds.length > 0 ? (isExpanded ? '📂' : '📁') : getModuleIcon(module.type)}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleEditSubmit}
                onKeyDown={handleKeyDown}
                className="module-edit-input"
                autoFocus
              />
            ) : (
              <span className="module-title">{module.name}</span>
            )}
          </div>
          <div className="module-actions">
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

        {/* Composants du module (si déplié) */}
        {isExpanded && (
          <div className="components-container">
            {moduleComponentIds.map(componentId => (
              <ComponentItem
                key={componentId}
                componentId={componentId}
                moduleId={moduleId}
                pageId={pageId}
                isSelected={state.ui.selection.componentId === componentId}
                onSelect={onSelectComponent}
              />
            ))}
            <button 
              className="add-component-btn"
              onClick={handleOpenModal}
              title="Ajouter un composant"
            >
              ➕ Ajouter un composant
            </button>
          </div>
        )}
      </div>

      {/* Modal de sélection de composants */}
      <ComponentSelectorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelect={handleSelectComponentType}
        moduleId={moduleId}
      />
    </>
  );
};
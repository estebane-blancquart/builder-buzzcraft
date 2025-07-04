// =============================================================================
// PAGE ITEM - COMPOSANT PAGE DANS L'EXPLORER
// =============================================================================
import React, { useState } from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { generateModuleId, generateDefaultModuleName } from '../../../core/utils';
import { ModuleType } from '../../../core/types';
import { ModuleItem } from './ModuleItem';
import { pageActions, moduleActions } from '../../../core/store/actions';
import { uiActions } from '../../../core/store/actions';

// =============================================================================
// INTERFACE
// =============================================================================
interface PageItemProps {
  pageId: string;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (pageId: string) => void;
  onToggleExpand: (pageId: string) => void;
  expandedModules: Set<string>;
  onToggleModuleExpand: (moduleId: string) => void;
}

// =============================================================================
// COMPOSANT PAGE ITEM
// =============================================================================
export const PageItem: React.FC<PageItemProps> = ({ 
  pageId, 
  isExpanded, 
  onToggleExpand,
  expandedModules,
  onToggleModuleExpand
}) => {
  const { state, dispatch } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  
  const page = state.entities.pages[pageId];
  const pageModuleIds = state.relations.pageModules?.[pageId] || [];
  
  if (!page) return null;

  // =============================================================================
  // HANDLERS
  // =============================================================================
  const handleClick = () => {
    // Un clic = sélectionner seulement
    dispatch(uiActions.setSelection({
      pageId,
      moduleId: null,
      componentId: null
    }));
  };

  const handleDoubleClick = () => {
    // Double-clic = déplier/fermer
    onToggleExpand(pageId);
  };

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(page.name);
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (editName.trim() && editName !== page.name) {
      dispatch(pageActions.update(pageId, {
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
      setEditName(page.name);
      setIsEditing(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer la page "${page.name}" ?`)) {
      dispatch(pageActions.remove(pageId));
    }
  };

  const handleAddModule = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newModuleId = generateModuleId();
    
    // Utiliser la fonction existante pour générer le nom
    const pageModules = pageModuleIds.map(id => state.entities.modules?.[id]).filter(Boolean);
    const existingModuleNames = pageModules.map(module => module?.name || '');
    const moduleName = generateDefaultModuleName(existingModuleNames);
    const newModule = {
      id: newModuleId,
      name: moduleName,
      type: 'section' as ModuleType,
      layout: {
        desktop: 1 as 1,
        tablet: 1 as 1,
        mobile: 1 as 1
      },
      styles: {},
      position: pageModuleIds.length,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    dispatch(moduleActions.add(pageId, newModule));
  };

  const handleSelectModule = (pageId: string, moduleId: string) => {
    dispatch(uiActions.setSelection({
      pageId,
      moduleId,
      componentId: null
    }));
  };

  const handleSelectComponent = (pageId: string, moduleId: string, componentId: string) => {
    dispatch(uiActions.setSelection({
      pageId,
      moduleId,
      componentId
    }));
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  const isPageSelected = state.ui.selection.pageId === pageId && !state.ui.selection.moduleId && !state.ui.selection.componentId;
  
  return (
    <div className="page-item-container">
      <div 
        className={`page-item ${isPageSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div className="page-content">
          <span className="expand-icon">
            {pageModuleIds.length > 0 ? (isExpanded ? '📂' : '📁') : '📄'}
          </span>
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={handleKeyDown}
              className="page-edit-input"
              autoFocus
            />
          ) : (
            <span className="page-title">{page.name}</span>
          )}
        </div>
        <div className="page-actions">
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

      {/* Modules de la page (si dépliée) */}
      {isExpanded && (
        <div className="modules-container">
          {pageModuleIds.map(moduleId => (
            <ModuleItem
              key={moduleId}
              moduleId={moduleId}
              pageId={pageId}
              isSelected={state.ui.selection.moduleId === moduleId}
              isExpanded={expandedModules.has(moduleId)}
              onSelect={handleSelectModule}
              onSelectComponent={handleSelectComponent}
              onToggleExpand={onToggleModuleExpand}
            />
          ))}
          <button 
            className="add-module-btn"
            onClick={handleAddModule}
            title="Ajouter un module"
          >
            ➕ Ajouter un module
          </button>
        </div>
      )}
    </div>
  );
};
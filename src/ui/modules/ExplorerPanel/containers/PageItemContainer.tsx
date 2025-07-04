// =============================================================================
// PAGE ITEM CONTAINER - LOGIQUE DE CONNEXION AU STORE
// =============================================================================
import React, { useCallback, useMemo } from 'react';
import { useBuilder } from '../../../../core/context/BuilderContext';
import { useSelection } from '../../../../core/hooks';
import { pageActions, moduleActions } from '../../../../core/store/actions';
import { selectModulesForPage } from '../../../../core/store';
import { generateModuleId, generateDefaultModuleName } from '../../../../core/utils';
import { PageItem, type PageItemProps } from '../components/PageItem';
import type { ModuleType } from '../../../../core/types';

// =============================================================================
// INTERFACE CONTAINER
// =============================================================================
interface PageItemContainerProps {
  readonly pageId: string;
  readonly isExpanded: boolean;
  readonly expandedModules: Set<string>;
  readonly onToggleExpand: (pageId: string) => void;
  readonly onToggleModuleExpand: (moduleId: string) => void;
}

// =============================================================================
// CONTAINER (LOGIQUE DE CONNEXION)
// =============================================================================
export const PageItemContainer: React.FC<PageItemContainerProps> = ({
  pageId,
  isExpanded,
  expandedModules,
  onToggleExpand,
  onToggleModuleExpand
}) => {
  const { state, dispatch } = useBuilder();
  const { state: selection, actions } = useSelection();

  // =============================================================================
  // DONNÉES SÉLECTÉES DU STORE
  // =============================================================================
  const page = state.entities.pages[pageId];
  const modules = useMemo(() => 
    selectModulesForPage(state)(pageId), 
    [state, pageId]
  );
  
  const isSelected = selection.pageId === pageId;

  // =============================================================================
  // CALLBACKS CONNECTÉS AU STORE
  // =============================================================================
  const handleSelect = useCallback((pageId: string) => {
    actions.selectPage(pageId);
  }, [actions]);

  const handleEdit = useCallback((pageId: string, newName: string) => {
    dispatch(pageActions.update(pageId, { 
      name: newName,
      updatedAt: Date.now()
    }));
  }, [dispatch]);

  const handleDelete = useCallback((pageId: string) => {
    // Supprimer la page et ses relations
    dispatch(pageActions.remove(pageId));
    
    // Clear selection si cette page était sélectionnée
    if (selection.pageId === pageId) {
      actions.clearSelection();
    }
  }, [dispatch, selection.pageId, actions]);

  const handleCreateModule = useCallback((pageId: string) => {
    const newModuleId = generateModuleId();
    const existingNames = modules.map(m => m.name);
    const moduleName = generateDefaultModuleName(existingNames);
    
    const newModule = {
      id: newModuleId,
      name: moduleName,
      type: 'section' as ModuleType,
      position: modules.length,
      layout: {
        desktop: 3 as const,
        tablet: 2 as const,
        mobile: 1 as const
      },
      styles: {},
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    dispatch(moduleActions.add(pageId, newModule));
    actions.selectModule(pageId, newModuleId);
  }, [dispatch, modules, actions]);

  const handleComponentSelect = useCallback((pageId: string, moduleId: string, componentId: string) => {
    actions.selectComponent(pageId, moduleId, componentId);
  }, [actions]);

  // =============================================================================
  // GUARD CLAUSE
  // =============================================================================
  if (!page) {
    return null;
  }

  // =============================================================================
  // PROPS MAPPING (STORE → COMPOSANT PUR)
  // =============================================================================
  const pageItemProps: PageItemProps = {
    // Data pure
    page,
    modules,
    
    // État UI dérivé
    isSelected,
    isExpanded,
    expandedModules,
    
    // Callbacks découplés
    onSelect: handleSelect,
    onToggleExpand,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onCreateModule: handleCreateModule,
    onModuleToggleExpand: onToggleModuleExpand,
    onComponentSelect: handleComponentSelect,
  };

  // =============================================================================
  // RENDER (DÉLÉGATION AU COMPOSANT PUR)
  // =============================================================================
  return <PageItem {...pageItemProps} />;
};
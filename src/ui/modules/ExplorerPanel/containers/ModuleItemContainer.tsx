// =============================================================================
// MODULE ITEM CONTAINER - LOGIQUE DE CONNEXION AU STORE
// =============================================================================
import React, { useCallback, useMemo } from 'react';
import { useBuilder } from '../../../../core/context/BuilderContext';
import { useSelection } from '../../../../core/hooks';
import { moduleActions, componentActions } from '../../../../core/store/actions';
import { selectComponentsForModule } from '../../../../core/store';
import { generateComponentId, generateDefaultComponentName } from '../../../../core/utils';
import { ModuleItem, type ModuleItemProps } from '../components/ModuleItem';
import type { ComponentType, TitleProps, TextProps, ImageProps, ButtonProps, ListProps, VideoProps, SpacerProps } from '../../../../core/types';

// =============================================================================
// INTERFACE CONTAINER
// =============================================================================
interface ModuleItemContainerProps {
  readonly moduleId: string;
  readonly pageId: string;
  readonly isExpanded: boolean;
  readonly onToggleExpand: (moduleId: string) => void;
  readonly onComponentSelect: (pageId: string, moduleId: string, componentId: string) => void;
}

// =============================================================================
// CONTAINER (LOGIQUE DE CONNEXION)
// =============================================================================
export const ModuleItemContainer: React.FC<ModuleItemContainerProps> = ({
  moduleId,
  pageId,
  isExpanded,
  onToggleExpand,
  onComponentSelect
}) => {
  const { state, dispatch } = useBuilder();
  const { state: selection, actions } = useSelection();

  // =============================================================================
  // DONNÉES SÉLECTÉES DU STORE
  // =============================================================================
  const module = state.entities.modules[moduleId];
  const components = useMemo(() => 
    selectComponentsForModule(state)(moduleId), 
    [state, moduleId]
  );
  
  const isSelected = selection.moduleId === moduleId;

  // =============================================================================
  // CALLBACKS CONNECTÉS AU STORE
  // =============================================================================
  const handleSelect = useCallback((moduleId: string) => {
    actions.selectModule(pageId, moduleId);
  }, [actions, pageId]);

  const handleEdit = useCallback((moduleId: string, newName: string) => {
    dispatch(moduleActions.update(moduleId, { 
      name: newName,
      updatedAt: Date.now()
    }));
  }, [dispatch]);

  const handleDelete = useCallback((moduleId: string) => {
    // Supprimer le module et ses relations
    dispatch(moduleActions.remove(moduleId, pageId));
    
    // Clear selection si ce module était sélectionné
    if (selection.moduleId === moduleId) {
      actions.selectPage(pageId);
    }
  }, [dispatch, selection.moduleId, actions, pageId]);

  const handleCreateComponent = useCallback((moduleId: string, componentType: string) => {
    const newComponentId = generateComponentId();
    const existingNames = components.map(c => c.name);
    const componentName = generateDefaultComponentName(componentType, existingNames);
    
    // Mapping des types modal vers types système
    const typeMapping: Record<string, ComponentType> = {
      'heading': 'title',
      'paragraph': 'text',
      'image': 'image',
      'button': 'button',
      'list': 'list',
      'video': 'video',
      'spacer': 'spacer',
      'quote': 'text'
    };
    
    const systemType = typeMapping[componentType] || 'text';
    
    // Props par défaut selon le type
    const getDefaultProps = (type: ComponentType) => {
      switch (type) {
        case 'title':
          return { text: 'Nouveau titre', level: 2 } as TitleProps;
        case 'text':
          return { text: 'Nouveau paragraphe' } as TextProps;
        case 'image':
          return { src: '', alt: 'Image' } as ImageProps;
        case 'button':
          return { text: 'Nouveau bouton', variant: 'primary' } as ButtonProps;
        case 'list':
          return { items: ['Élément 1', 'Élément 2'], listStyle: 'bulleted' as const } as ListProps;
        case 'video':
          return { src: '', controls: true } as VideoProps;
        case 'spacer':
          return { height: '20px' } as SpacerProps;
        default:
          return { text: 'Nouveau contenu' } as TextProps;
      }
    };
    
    const newComponent = {
      id: newComponentId,
      name: componentName,
      type: systemType,
      props: getDefaultProps(systemType),
      span: 1 as const, // ✅ Type littéral strict
      layout: { span: 1 as const, position: components.length }, // ✅ Type littéral strict
      styles: {},
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    dispatch(componentActions.add(moduleId, newComponent));
    actions.selectComponent(pageId, moduleId, newComponentId);
  }, [dispatch, components, actions, pageId]);

  const handleComponentSelect = useCallback((componentId: string) => {
    onComponentSelect(pageId, moduleId, componentId);
  }, [onComponentSelect, pageId, moduleId]);

  // =============================================================================
  // GUARD CLAUSE
  // =============================================================================
  if (!module) {
    return null;
  }

  // =============================================================================
  // PROPS MAPPING (STORE → COMPOSANT PUR)
  // =============================================================================
  const moduleItemProps: ModuleItemProps = {
    // Data pure
    module,
    components,
    pageId,
    
    // État UI dérivé
    isSelected,
    isExpanded,
    
    // Callbacks découplés
    onSelect: handleSelect,
    onToggleExpand,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onCreateComponent: handleCreateComponent,
    onComponentSelect: handleComponentSelect,
  };

  // =============================================================================
  // RENDER (DÉLÉGATION AU COMPOSANT PUR)
  // =============================================================================
  return <ModuleItem {...moduleItemProps} />;
};
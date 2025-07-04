// =============================================================================
// MODULE ITEM CONTAINER - LOGIQUE DE CONNEXION AVEC DONNÉES MOCK
// =============================================================================
import React, { useCallback } from 'react';
import { ModuleItem, type ModuleItemProps } from '../components/ModuleItem';

// =============================================================================
// DONNÉES MOCK (PARTAGÉES)
// =============================================================================
const mockData = {
  modules: {
    'module-1': { 
      id: 'module-1', 
      name: 'Hero Section', 
      type: 'hero',
      layout: { desktop: 1, tablet: 1, mobile: 1 },
      styles: {},
      position: 0,
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000
    },
    'module-2': { 
      id: 'module-2', 
      name: 'Features Grid', 
      type: 'features',
      layout: { desktop: 3, tablet: 2, mobile: 1 },
      styles: {},
      position: 1,
      createdAt: Date.now() - 82800000,
      updatedAt: Date.now() - 1800000
    }
  } as Record<string, any>,
  components: {
    'comp-1': { 
      id: 'comp-1', 
      name: 'Main Heading', 
      type: 'title',
      props: { text: 'Welcome', level: 1 },
      styles: {},
      layout: { span: 1, position: 0 },
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000
    },
    'comp-2': { 
      id: 'comp-2', 
      name: 'Hero Description', 
      type: 'text',
      props: { text: 'Hero subtitle' },
      styles: {},
      layout: { span: 1, position: 1 },
      createdAt: Date.now() - 86000000,
      updatedAt: Date.now() - 2400000
    },
    'comp-3': { 
      id: 'comp-3', 
      name: 'CTA Button', 
      type: 'button',
      props: { text: 'Get Started', variant: 'primary', size: 'lg' },
      styles: {},
      layout: { span: 1, position: 2 },
      createdAt: Date.now() - 85600000,
      updatedAt: Date.now() - 1200000
    }
  } as Record<string, any>,
  relations: {
    moduleComponents: {
      'module-1': ['comp-1', 'comp-2', 'comp-3'],
      'module-2': []
    } as Record<string, string[]>
  }
};

// =============================================================================
// INTERFACE CONTAINER
// =============================================================================
interface ModuleItemContainerProps {
  readonly moduleId: string;
  readonly pageId: string;
  readonly isExpanded: boolean;
  readonly selection: { pageId?: string; moduleId?: string; componentId?: string };
  readonly hoveredItem: string | null;
  readonly onToggleExpand: (moduleId: string) => void;
  readonly onComponentSelect: (pageId: string, moduleId: string, componentId: string) => void;
  readonly onSelectItem: (type: string, id: string) => void;
  readonly onHover: (itemId: string | null) => void;
}

// =============================================================================
// CONTAINER (LOGIQUE DE CONNEXION)
// =============================================================================
export const ModuleItemContainer: React.FC<ModuleItemContainerProps> = ({
  moduleId,
  pageId,
  isExpanded,
  selection,
  hoveredItem,
  onToggleExpand,
  onComponentSelect,
  onSelectItem,
  onHover
}) => {
  // =============================================================================
  // SÉLECTEURS DE DONNÉES
  // =============================================================================
  const module = mockData.modules[moduleId];
  const componentIds = mockData.relations.moduleComponents[moduleId] || [];
  const components = componentIds.map(id => mockData.components[id]).filter(Boolean);

  // =============================================================================
  // ÉTAT DÉRIVÉ
  // =============================================================================
  const isSelected = selection.moduleId === moduleId && !selection.componentId;

  // =============================================================================
  // HANDLERS (LOGIQUE MÉTIER)
  // =============================================================================
  const handleSelect = useCallback((selectedModuleId: string) => {
    onSelectItem('module', selectedModuleId);
  }, [onSelectItem]);

  const handleEdit = useCallback((selectedModuleId: string, newName: string) => {
    console.log('Edit module:', selectedModuleId, newName);
    // TODO: Dispatch action pour modifier le nom
  }, []);

  const handleDelete = useCallback((selectedModuleId: string) => {
    console.log('Delete module:', selectedModuleId);
    // TODO: Dispatch action pour supprimer le module
  }, []);

  const handleCreateComponent = useCallback((componentType: string) => {
    console.log('Create component:', componentType, 'in module:', moduleId);
    // TODO: Dispatch action pour créer un composant
  }, [moduleId]);

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
    hoveredItem,
    selection,
    
    // Callbacks découplés
    onSelect: handleSelect,
    onToggleExpand,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onCreateComponent: handleCreateComponent,
    onComponentSelect: handleComponentSelect,
    onHover,
  };

  // =============================================================================
  // RENDER (DÉLÉGATION AU COMPOSANT PUR)
  // =============================================================================
  return <ModuleItem {...moduleItemProps} />;
};
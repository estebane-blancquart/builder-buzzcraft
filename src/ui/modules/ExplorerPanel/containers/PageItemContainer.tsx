// =============================================================================
// PAGE ITEM CONTAINER - LOGIQUE DE CONNEXION AVEC DONNÉES MOCK
// =============================================================================
import React, { useCallback } from 'react';
import { PageItem, type PageItemProps } from '../components/PageItem';

// =============================================================================
// DONNÉES MOCK (EXTRAITES DU EXPLORER PANEL)
// =============================================================================
const mockData = {
  pages: {} as Record<string, any>,
  modules: {} as Record<string, any>,
  components: {} as Record<string, any>,
  relations: {
    pageModules: {} as Record<string, string[]>,
    moduleComponents: {} as Record<string, string[]>
  }
};

// =============================================================================
// INTERFACE CONTAINER
// =============================================================================
interface PageItemContainerProps {
  readonly pageId: string;
  readonly isExpanded: boolean;
  readonly expandedModules: Set<string>;
  readonly selection: { pageId?: string; moduleId?: string; componentId?: string };
  readonly hoveredItem: string | null;
  readonly onToggleExpand: (pageId: string) => void;
  readonly onToggleModuleExpand: (moduleId: string) => void;
  readonly onComponentSelect: (pageId: string, moduleId: string, componentId: string) => void;
  readonly onSelectItem: (type: string, id: string) => void;
  readonly onHover: (itemId: string | null) => void;
}

// =============================================================================
// CONTAINER (LOGIQUE DE CONNEXION)
// =============================================================================
export const PageItemContainer: React.FC<PageItemContainerProps> = ({
  pageId,
  isExpanded,
  expandedModules,
  selection,
  hoveredItem,
  onToggleExpand,
  onToggleModuleExpand,
  onComponentSelect,
  onSelectItem,
  onHover
}) => {
  // =============================================================================
  // SÉLECTEURS DE DONNÉES
  // =============================================================================
  const page = mockData.pages[pageId];
  const moduleIds = mockData.relations.pageModules[pageId] || [];
  const modules = moduleIds.map(id => mockData.modules[id]).filter(Boolean);

  // =============================================================================
  // ÉTAT DÉRIVÉ
  // =============================================================================
  const isSelected = selection.pageId === pageId && !selection.moduleId;

  // =============================================================================
  // HANDLERS (LOGIQUE MÉTIER)
  // =============================================================================
  const handleSelect = useCallback((selectedPageId: string) => {
    onSelectItem('page', selectedPageId);
  }, [onSelectItem]);

  const handleEdit = useCallback((selectedPageId: string, newName: string) => {
    console.log('Edit page:', selectedPageId, newName);
    // TODO: Dispatch action pour modifier le nom
  }, []);

  const handleDelete = useCallback((selectedPageId: string) => {
    console.log('Delete page:', selectedPageId);
    // TODO: Dispatch action pour supprimer la page
  }, []);

  const handleCreateModule = useCallback((selectedPageId: string) => {
    console.log('Create module for page:', selectedPageId);
    // TODO: Dispatch action pour créer un module
  }, []);

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
    hoveredItem,
    selection,

    // Callbacks découplés
    onSelect: handleSelect,
    onToggleExpand,
    onToggleModuleExpand,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onCreateModule: handleCreateModule,
    onComponentSelect,
    onSelectItem,
    onHover,
  };

  // =============================================================================
  // RENDER (DÉLÉGATION AU COMPOSANT PUR)
  // =============================================================================
  return <PageItem {...pageItemProps} />;
};
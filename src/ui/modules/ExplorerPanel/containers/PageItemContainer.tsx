// =============================================================================
// PAGE ITEM CONTAINER - LOGIQUE DE CONNEXION AVEC DONNÉES MOCK
// =============================================================================
import React, { useCallback } from 'react';
import { PageItem, type PageItemProps } from '../components/PageItem';

// =============================================================================
// DONNÉES MOCK (EXTRAITES DU EXPLORER PANEL)
// =============================================================================
const mockData = {
  pages: {
    'page-1': { 
      id: 'page-1', 
      name: 'Home', 
      slug: 'home',
      title: 'Homepage',
      description: 'Main landing page',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000
    },
    'page-2': { 
      id: 'page-2', 
      name: 'About', 
      slug: 'about',
      title: 'About Us',
      description: 'Company information',
      createdAt: Date.now() - 82800000,
      updatedAt: Date.now() - 7200000
    },
    'page-3': { 
      id: 'page-3', 
      name: 'Contact', 
      slug: 'contact',
      title: 'Contact Us',
      description: 'Get in touch',
      createdAt: Date.now() - 79200000,
      updatedAt: Date.now() - 1800000
    }
  } as Record<string, any>,
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
    pageModules: {
      'page-1': ['module-1', 'module-2'],
      'page-2': ['module-1'],
      'page-3': []
    } as Record<string, string[]>,
    moduleComponents: {
      'module-1': ['comp-1', 'comp-2', 'comp-3'],
      'module-2': []
    } as Record<string, string[]>
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
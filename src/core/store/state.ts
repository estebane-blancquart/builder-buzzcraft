// =============================================================================
// STORE - ÉTAT NORMALISÉ
// =============================================================================

import type { Page, Module, Component, UIState } from '../types';

// =============================================================================
// ÉTAT NORMALISÉ (COMME UNE BASE DE DONNÉES)
// =============================================================================

export interface NormalizedBuilderState {
  // Entités séparées (tables)
  entities: {
    pages: Record<string, Page>;
    modules: Record<string, Module>;
    components: Record<string, Component>;
  };
  
  // Relations entre entités (IDs seulement)
  relations: {
    pageModules: Record<string, string[]>;      // pageId -> moduleIds[]
    moduleComponents: Record<string, string[]>; // moduleId -> componentIds[]
  };
  
  // État de l'interface utilisateur
  ui: UIState;
  
  // Métadonnées globales
  meta: {
    activePageId: string | null;
    pageOrder: string[];        // Ordre des pages
    projectName: string;
    projectId: string;
    version: string;
  };
}

// =============================================================================
// ÉTAT INITIAL
// =============================================================================

export const initialState: NormalizedBuilderState = {
  entities: {
    pages: {}, // Aucune page par défaut
    modules: {},
    components: {},
  },
  relations: {
    pageModules: {},
    moduleComponents: {},
  },
  
  ui: {
    // Device et viewport
    activeDevice: 'desktop',
    viewport: {
      zoom: 1,
      showGrid: false,
      showRulers: false,
      isFullscreen: false,
      snapToGrid: true,
    },
    
    // Preview settings (NOUVEAU)
    preview: {
      activeDevice: 'desktop',
      zoom: 1,
      isFullscreen: false,
      showGrid: false,
      isLoading: false
    },
    
    // Sélection
    selection: {
      pageId: null,
      moduleId: null,
      componentId: null,
    },
    
    // Édition
    editing: {
      componentId: null,
      field: null,
      value: '',
      originalValue: '',
    },
    
    // Layout des panels
    layout: {
      explorerPanel: {
        isCollapsed: false,
        width: 280,
        isVisible: true,
      },
      configPanel: {
        isCollapsed: false,
        width: 320,
        isVisible: true,
      },
      previewArea: {
        device: 'desktop',
        viewport: {
          zoom: 1,
          showGrid: false,
          showRulers: false,
          isFullscreen: false,
          snapToGrid: true,
        },
      },
    },
    
    // Notifications
    notifications: [],
    
    // Historique
    history: {
      past: [],
      present: null,
      future: [],
      maxHistory: 50,
    },
    
    // États temporaires
    isLoading: false,
    isDirty: false,
    lastSaved: undefined,
  },
  
  meta: {
    activePageId: null,
    pageOrder: [],
    projectName: 'Nouveau projet',
    projectId: '',
    version: '1.0.0',
  },
};
// =============================================================================
// STORE - REDUCER OPTIMISÉ ET SIMPLIFIÉ (FIXED + PREVIEW)
// =============================================================================

import type { NormalizedBuilderState } from './state';
import type { BuilderAction } from './actions';
import type { Selection } from '../types';

// =============================================================================
// HELPER POUR NORMALISER SELECTION (undefined → null)
// =============================================================================

function normalizeSelection(payload: Selection): {
  pageId: string | null;
  moduleId: string | null;
  componentId: string | null;
} {
  return {
    pageId: payload.pageId ?? null,
    moduleId: payload.moduleId ?? null,
    componentId: payload.componentId ?? null,
  };
}

// =============================================================================
// REDUCER PRINCIPAL (OPTIMISÉ + PREVIEW)
// =============================================================================

export function builderReducer(
  state: NormalizedBuilderState, 
  action: BuilderAction
): NormalizedBuilderState {
  switch (action.type) {
    // Pages
    case 'page/add':
    case 'page/remove':
    case 'page/update':
    case 'page/setActive':
    case 'page/reorder':
      return {
        ...state,
        entities: entitiesReducer(state.entities, action),
        relations: relationsReducer(state.relations, action),
        meta: metaReducer(state.meta, action),
      };

    // Modules
    case 'module/add':
    case 'module/remove':
    case 'module/update':
    case 'module/reorder':
    case 'module/move':
      return {
        ...state,
        entities: entitiesReducer(state.entities, action),
        relations: relationsReducer(state.relations, action),
      };

    // Components
    case 'component/add':
    case 'component/remove':
    case 'component/update':
    case 'component/reorder':
    case 'component/move':
      return {
        ...state,
        entities: entitiesReducer(state.entities, action),
        relations: relationsReducer(state.relations, action),
      };

    // UI
    case 'ui/setDevice':
    case 'ui/setViewport':
    case 'ui/setSelection':
    case 'ui/clearSelection':
    case 'ui/setEditing':
    case 'ui/addNotification':
    case 'ui/removeNotification':
    case 'ui/setLoading':
    case 'ui/setDirty':
    case 'ui/updatePanel':
      return {
        ...state,
        ui: uiReducer(state.ui, action),
      };

    // Preview Actions (NOUVEAU)
    case 'preview/setDevice':
    case 'preview/setZoom':
    case 'preview/zoomIn':
    case 'preview/zoomOut':
    case 'preview/resetZoom':
    case 'preview/toggleFullscreen':
    case 'preview/toggleGrid':
    case 'preview/setLoading':
      return {
        ...state,
        ui: {
          ...state.ui,
          preview: previewReducer(state.ui.preview, action),
        },
      };

    // Meta
    case 'meta/save':
    case 'meta/load':
    case 'meta/reset':
      return {
        ...state,
        meta: metaReducer(state.meta, action),
      };

    // History
    case 'history/undo':
    case 'history/redo':
    case 'history/clear':
      return handleHistoryAction(state, action);

    default:
      return state;
  }
}

// =============================================================================
// PREVIEW REDUCER (NOUVEAU)
// =============================================================================

function previewReducer(preview: any, action: BuilderAction): any {
  switch (action.type) {
    case 'preview/setDevice':
      return {
        ...preview,
        activeDevice: action.payload.device
      };

    case 'preview/setZoom':
      return {
        ...preview,
        zoom: Math.max(0.1, Math.min(3, action.payload.zoom))
      };

    case 'preview/zoomIn':
      return {
        ...preview,
        zoom: Math.min(3, preview.zoom + 0.25)
      };

    case 'preview/zoomOut':
      return {
        ...preview,
        zoom: Math.max(0.1, preview.zoom - 0.25)
      };

    case 'preview/resetZoom':
      return {
        ...preview,
        zoom: 1
      };

    case 'preview/toggleFullscreen':
      return {
        ...preview,
        isFullscreen: !preview.isFullscreen
      };

    case 'preview/toggleGrid':
      return {
        ...preview,
        showGrid: !preview.showGrid
      };

    case 'preview/setLoading':
      return {
        ...preview,
        isLoading: action.payload.isLoading
      };

    default:
      return preview;
  }
}

// =============================================================================
// ENTITIES REDUCER (INCHANGÉ)
// =============================================================================

function entitiesReducer(
  entities: NormalizedBuilderState['entities'], 
  action: BuilderAction
): NormalizedBuilderState['entities'] {
  switch (action.type) {
    // Pages
    case 'page/add':
      return {
        ...entities,
        pages: {
          ...entities.pages,
          [action.payload.id]: action.payload,
        },
      };
    case 'page/remove': {
      const { pageId } = action.payload;
      const { [pageId]: deletedPage, ...remainingPages } = entities.pages;
      return {
        ...entities,
        pages: remainingPages,
      };
    }
    case 'page/update': {
      const { pageId, updates } = action.payload;
      return {
        ...entities,
        pages: {
          ...entities.pages,
          [pageId]: {
            ...entities.pages[pageId]!,
            ...updates,
            updatedAt: Date.now(),
          },
        },
      };
    }
    // Modules
    case 'module/add':
      return {
        ...entities,
        modules: {
          ...entities.modules,
          [action.payload.module.id]: action.payload.module,
        },
      };
    case 'module/remove': {
      const { moduleId } = action.payload;
      const { [moduleId]: deletedModule, ...remainingModules } = entities.modules;
      return {
        ...entities,
        modules: remainingModules,
      };
    }
    case 'module/update': {
      const { moduleId, updates } = action.payload;
      return {
        ...entities,
        modules: {
          ...entities.modules,
          [moduleId]: {
            ...entities.modules[moduleId]!,
            ...updates,
            updatedAt: Date.now(),
          },
        },
      };
    }
    // Components
    case 'component/add':
      return {
        ...entities,
        components: {
          ...entities.components,
          [action.payload.component.id]: action.payload.component,
        },
      };
    case 'component/remove': {
      const { componentId } = action.payload;
      const { [componentId]: deletedComponent, ...remainingComponents } = entities.components;
      return {
        ...entities,
        components: remainingComponents,
      };
    }
    case 'component/update': {
      const { componentId, updates } = action.payload;
      return {
        ...entities,
        components: {
          ...entities.components,
          [componentId]: {
            ...entities.components[componentId]!,
            ...updates,
            updatedAt: Date.now(),
          },
        },
      };
    }
    default:
      return entities;
  }
}

// =============================================================================
// RELATIONS REDUCER (INCHANGÉ)
// =============================================================================

function relationsReducer(
  relations: NormalizedBuilderState['relations'], 
  action: BuilderAction
): NormalizedBuilderState['relations'] {
  switch (action.type) {
    // Pages
    case 'page/remove': {
      const { pageId } = action.payload;
      const { [pageId]: deletedPageModules, ...remainingPageModules } = relations.pageModules;
      return {
        ...relations,
        pageModules: remainingPageModules,
      };
    }
    // Modules
    case 'module/add': {
      const currentModules = relations.pageModules[action.payload.pageId] || [];
      return {
        ...relations,
        pageModules: {
          ...relations.pageModules,
          [action.payload.pageId]: [...currentModules, action.payload.module.id],
        },
      };
    }
    case 'module/remove': {
      const { moduleId, pageId } = action.payload;
      const updatedModules = relations.pageModules[pageId]?.filter(
        id => id !== moduleId
      ) || [];
      const { [moduleId]: deletedModuleComponents, ...remainingModuleComponents } = relations.moduleComponents;
      return {
        ...relations,
        pageModules: {
          ...relations.pageModules,
          [pageId]: updatedModules,
        },
        moduleComponents: remainingModuleComponents,
      };
    }
    case 'module/reorder': {
      const { pageId, moduleIds } = action.payload;
      return {
        ...relations,
        pageModules: {
          ...relations.pageModules,
          [pageId]: moduleIds,
        },
      };
    }
    // Components
    case 'component/add': {
      const currentComponents = relations.moduleComponents[action.payload.moduleId] || [];
      return {
        ...relations,
        moduleComponents: {
          ...relations.moduleComponents,
          [action.payload.moduleId]: [...currentComponents, action.payload.component.id],
        },
      };
    }
    case 'component/remove': {
      const { componentId, moduleId } = action.payload;
      const updatedComponents = relations.moduleComponents[moduleId]?.filter(
        id => id !== componentId
      ) || [];
      return {
        ...relations,
        moduleComponents: {
          ...relations.moduleComponents,
          [moduleId]: updatedComponents,
        },
      };
    }
    default:
      return relations;
  }
}

// =============================================================================
// UI REDUCER (INCHANGÉ)
// =============================================================================

function uiReducer(ui: NormalizedBuilderState['ui'], action: BuilderAction): NormalizedBuilderState['ui'] {
  switch (action.type) {
    case 'ui/setDevice':
      return {
        ...ui,
        activeDevice: action.payload.device,
      };
    case 'ui/setViewport':
      return {
        ...ui,
        viewport: {
          ...ui.viewport,
          ...action.payload,
        },
      };
    case 'ui/setSelection':
      return {
        ...ui,
        selection: {
          ...ui.selection,
          ...normalizeSelection(action.payload),
        },
      };
    case 'ui/clearSelection':
      return {
        ...ui,
        selection: {
          pageId: null,
          moduleId: null,
          componentId: null,
        },
      };
    default:
      return ui;
  }
}

// =============================================================================
// META REDUCER (INCHANGÉ)
// =============================================================================

function metaReducer(meta: NormalizedBuilderState['meta'], action: BuilderAction): NormalizedBuilderState['meta'] {
  switch (action.type) {
    case 'page/add':
      return {
        ...meta,
        pageOrder: [...meta.pageOrder, action.payload.id],
        activePageId: meta.activePageId ?? action.payload.id,
      };
    case 'page/remove': {
      const { pageId } = action.payload;
      return {
        ...meta,
        pageOrder: meta.pageOrder.filter(id => id !== pageId),
        activePageId: meta.activePageId === pageId ? null : meta.activePageId,
      };
    }
    case 'page/setActive':
      return {
        ...meta,
        activePageId: action.payload.pageId,
      };
    case 'page/reorder':
      return {
        ...meta,
        pageOrder: action.payload.pageIds,
      };
    default:
      return meta;
  }
}

// =============================================================================
// HISTORY HANDLER (INCHANGÉ)
// =============================================================================

function handleHistoryAction(state: NormalizedBuilderState, action: BuilderAction): NormalizedBuilderState {
  switch (action.type) {
    case 'history/undo':
    case 'history/redo':
      return state;
    case 'history/clear':
      return {
        ...state,
        ui: {
          ...state.ui,
          history: {
            past: [],
            present: null,
            future: [],
            maxHistory: 50,
          },
        },
      };
    default:
      return state;
  }
}
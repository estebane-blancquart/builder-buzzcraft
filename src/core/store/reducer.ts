// =============================================================================
// STORE - REDUCER OPTIMISÉ ET SIMPLIFIÉ (FIXED)
// =============================================================================

import type { NormalizedBuilderState } from './state';
import type { BuilderAction } from './actions';
import type { Selection } from '../types';
import { isBatchAction, extractActionsFromBatch } from './actions';

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
// REDUCER PRINCIPAL (OPTIMISÉ)
// =============================================================================

export function builderReducer(
  state: NormalizedBuilderState, 
  action: BuilderAction
): NormalizedBuilderState {
  // Support des batch actions pour optimisations futures
  if (isBatchAction(action)) {
    return extractActionsFromBatch(action).reduce(builderReducer, state);
  }

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

    // UI (SIMPLIFIÉ)
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
// ENTITIES REDUCER (INCHANGÉ - DÉJÀ OPTIMISÉ)
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
// RELATIONS REDUCER (OPTIMISÉ)
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
        moduleComponents: {
          ...relations.moduleComponents,
          [action.payload.module.id]: [],
        },
      };
    }
    case 'module/remove': {
      const { moduleId, pageId } = action.payload;
      const updatedPageModules = relations.pageModules[pageId]?.filter(
        id => id !== moduleId
      ) || [];
      const { [moduleId]: deletedModuleComponents, ...remainingModuleComponents } = relations.moduleComponents;
      return {
        ...relations,
        pageModules: {
          ...relations.pageModules,
          [pageId]: updatedPageModules,
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
    case 'module/move': {
      const { moduleId, fromPageId, toPageId, toIndex } = action.payload;
      const fromModules = relations.pageModules[fromPageId]?.filter(id => id !== moduleId) || [];
      const toModules = [...(relations.pageModules[toPageId] || [])];
      toModules.splice(toIndex ?? 0, 0, moduleId);
      return {
        ...relations,
        pageModules: {
          ...relations.pageModules,
          [fromPageId]: fromModules,
          [toPageId]: toModules,
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
    case 'component/reorder': {
      const { moduleId, componentIds } = action.payload;
      return {
        ...relations,
        moduleComponents: {
          ...relations.moduleComponents,
          [moduleId]: componentIds,
        },
      };
    }
    case 'component/move': {
      const { componentId, fromModuleId, toModuleId, toIndex } = action.payload;
      const fromComponents = relations.moduleComponents[fromModuleId]?.filter(id => id !== componentId) || [];
      const toComponents = [...(relations.moduleComponents[toModuleId] || [])];
      toComponents.splice(toIndex ?? 0, 0, componentId);
      return {
        ...relations,
        moduleComponents: {
          ...relations.moduleComponents,
          [fromModuleId]: fromComponents,
          [toModuleId]: toComponents,
        },
      };
    }
    default:
      return relations;
  }
}

// =============================================================================
// UI REDUCER (SIMPLIFIÉ + FIXED)
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
    case 'ui/setEditing':
      return {
        ...ui,
        editing: action.payload || {
          componentId: null,
          field: null,
          value: '',
          originalValue: '',
        },
      };
    case 'ui/addNotification':
      return {
        ...ui,
        notifications: [...ui.notifications, action.payload],
      };
    case 'ui/removeNotification':
      return {
        ...ui,
        notifications: ui.notifications.filter(n => n.id !== action.payload.notificationId),
      };
    case 'ui/setLoading':
      return {
        ...ui,
        isLoading: action.payload.isLoading,
      };
    case 'ui/setDirty':
      return {
        ...ui,
        isDirty: action.payload.isDirty,
      };
    case 'ui/updatePanel': {
      // Correction: update only known panels in layout
      const panelId = action.payload.panelId;
      if (panelId === 'explorerPanel' || panelId === 'configPanel') {
        return {
          ...ui,
          layout: {
            ...ui.layout,
            [panelId]: {
              ...ui.layout[panelId],
              ...action.payload.updates,
            },
          },
        };
      }
      return ui;
    }
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
        activePageId: action.payload.id,
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
// HISTORY HANDLER (NOUVEAU - POUR UNDO/REDO)
// =============================================================================

function handleHistoryAction(state: NormalizedBuilderState, action: BuilderAction): NormalizedBuilderState {
  switch (action.type) {
    case 'history/undo':
      return state;
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

// =============================================================================
// (LAYOUT REDUCER SUPPRIMÉ CAR NON UTILISÉ)
// =============================================================================

export interface LayoutState {
  // ...existing properties
  [panelId: string]: any;
}
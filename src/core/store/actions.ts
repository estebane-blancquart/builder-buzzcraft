// =============================================================================
// STORE - ACTIONS V2 (CODE EXEMPLAIRE)
// =============================================================================

import type { 
  Page, 
  Module, 
  Component, 
  CreatePageData, 
  CreateModuleData, 
  CreateComponentData,
  Selection,
  ViewportSettings,
  EditingState,
  Notification,
  PanelState,
  DeviceType
} from '../types';

import { createPageId, createModuleId, createComponentId } from '../utils';

// =============================================================================
// ACTION TYPES (ENHANCED)
// =============================================================================

// Base action avec metadata
interface BaseAction {
  type: string;
  timestamp: number;
  batchId?: string;
  metadata?: {
    source?: 'user' | 'system' | 'undo' | 'redo';
    description?: string;
    undoable?: boolean;
    [key: string]: any; // Permet des propriétés custom
  };
}

// Page Actions
export interface PageActions {
  'page/add': {
    type: 'page/add';
    payload: Page;
  } & BaseAction;
  
  'page/remove': {
    type: 'page/remove';
    payload: { pageId: string };
  } & BaseAction;
  
  'page/update': {
    type: 'page/update';
    payload: { pageId: string; updates: Partial<Page> };
  } & BaseAction;
  
  'page/reorder': {
    type: 'page/reorder';
    payload: { pageIds: string[] };
  } & BaseAction;
  
  'page/duplicate': {
    type: 'page/duplicate';
    payload: { sourcePageId: string; newPage: Page };
  } & BaseAction;
  
  'page/setActive': {
    type: 'page/setActive';
    payload: { pageId: string | null };
  } & BaseAction;
}

// Module Actions
export interface ModuleActions {
  'module/add': {
    type: 'module/add';
    payload: { pageId: string; module: Module };
  } & BaseAction;
  
  'module/remove': {
    type: 'module/remove';
    payload: { moduleId: string; pageId: string };
  } & BaseAction;
  
  'module/update': {
    type: 'module/update';
    payload: { moduleId: string; updates: Partial<Module> };
  } & BaseAction;
  
  'module/move': {
    type: 'module/move';
    payload: { 
      moduleId: string; 
      fromPageId: string; 
      toPageId: string; 
      toIndex?: number;
    };
  } & BaseAction;
  
  'module/reorder': {
    type: 'module/reorder';
    payload: { pageId: string; moduleIds: string[] };
  } & BaseAction;
  
  'module/duplicate': {
    type: 'module/duplicate';
    payload: { sourceModuleId: string; pageId: string; newModule: Module };
  } & BaseAction;
}

// Component Actions  
export interface ComponentActions {
  'component/add': {
    type: 'component/add';
    payload: { moduleId: string; component: Component };
  } & BaseAction;
  
  'component/remove': {
    type: 'component/remove';
    payload: { componentId: string; moduleId: string };
  } & BaseAction;
  
  'component/update': {
    type: 'component/update';
    payload: { componentId: string; updates: Partial<Component> };
  } & BaseAction;
  
  'component/move': {
    type: 'component/move';
    payload: { 
      componentId: string; 
      fromModuleId: string; 
      toModuleId: string; 
      toIndex?: number;
    };
  } & BaseAction;
  
  'component/reorder': {
    type: 'component/reorder';
    payload: { moduleId: string; componentIds: string[] };
  } & BaseAction;
  
  'component/duplicate': {
    type: 'component/duplicate';
    payload: { sourceComponentId: string; moduleId: string; newComponent: Component };
  } & BaseAction;
}

// UI Actions
export interface UIActions {
  'ui/setSelection': {
    type: 'ui/setSelection';
    payload: Selection;
  } & BaseAction;
  
  'ui/clearSelection': {
    type: 'ui/clearSelection';
  } & BaseAction;
  
  'ui/setDevice': {
    type: 'ui/setDevice';
    payload: { device: DeviceType };
  } & BaseAction;
  
  'ui/setViewport': {
    type: 'ui/setViewport';
    payload: ViewportSettings;
  } & BaseAction;
  
  'ui/setEditing': {
    type: 'ui/setEditing';
    payload: EditingState;
  } & BaseAction;
  
  'ui/addNotification': {
    type: 'ui/addNotification';
    payload: Notification;
  } & BaseAction;
  
  'ui/removeNotification': {
    type: 'ui/removeNotification';
    payload: { notificationId: string };
  } & BaseAction;
  
  'ui/setLoading': {
    type: 'ui/setLoading';
    payload: { isLoading: boolean; operation?: string };
  } & BaseAction;
  
  'ui/setDirty': {
    type: 'ui/setDirty';
    payload: { isDirty: boolean };
  } & BaseAction;
  
  'ui/updatePanel': {
    type: 'ui/updatePanel';
    payload: { panelId: string; updates: Partial<PanelState> };
  } & BaseAction;
}

// History Actions
export interface HistoryActions {
  'history/undo': {
    type: 'history/undo';
  } & BaseAction;
  
  'history/redo': {
    type: 'history/redo';
  } & BaseAction;
  
  'history/clear': {
    type: 'history/clear';
  } & BaseAction;
  
  'history/checkpoint': {
    type: 'history/checkpoint';
    payload: { description: string };
  } & BaseAction;
}

// Meta Actions
export interface MetaActions {
  'meta/save': {
    type: 'meta/save';
  } & BaseAction;
  
  'meta/load': {
    type: 'meta/load';
    payload: { data: any };
  } & BaseAction;
  
  'meta/reset': {
    type: 'meta/reset';
  } & BaseAction;
}

// Batch Actions
export interface BatchActions {
  'batch/execute': {
    type: 'batch/execute';
    payload: { 
      actions: BuilderAction[];
      description: string;
    };
  } & BaseAction;
}

// Union de toutes les actions
export type PageAction = PageActions[keyof PageActions];
export type ModuleAction = ModuleActions[keyof ModuleActions];
export type ComponentAction = ComponentActions[keyof ComponentActions];
export type UIAction = UIActions[keyof UIActions];
export type HistoryAction = HistoryActions[keyof HistoryActions];
export type MetaAction = MetaActions[keyof MetaActions];
export type BatchAction = BatchActions[keyof BatchActions];

export type BuilderAction = 
  | PageAction 
  | ModuleAction 
  | ComponentAction 
  | UIAction 
  | HistoryAction 
  | MetaAction
  | BatchAction;

// =============================================================================
// ACTION CREATORS (TYPE-SAFE BUILDERS)
// =============================================================================

/**
 * Helper pour créer des actions avec metadata automatique
 */
function createAction<T extends BuilderAction>(
  type: T['type'],
  payload?: any,
  metadata?: BaseAction['metadata']
): T {
  return {
    type,
    payload,
    timestamp: Date.now(),
    metadata: {
      source: 'user',
      undoable: true,
      ...metadata
    }
  } as T;
}

/**
 * Helper pour générer un ID de batch
 */
function generateBatchId(): string {
  return `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// =============================================================================
// PAGE ACTION CREATORS
// =============================================================================

export const pageActions = {
  add: (page: Page, metadata?: BaseAction['metadata']) =>
    createAction<PageActions['page/add']>('page/add', page, metadata),
  
  remove: (pageId: string, metadata?: BaseAction['metadata']) =>
    createAction<PageActions['page/remove']>('page/remove', { pageId }, metadata),
  
  update: (pageId: string, updates: Partial<Page>, metadata?: BaseAction['metadata']) =>
    createAction<PageActions['page/update']>('page/update', { pageId, updates }, metadata),
  
  reorder: (pageIds: string[], metadata?: BaseAction['metadata']) =>
    createAction<PageActions['page/reorder']>('page/reorder', { pageIds }, metadata),
  
  duplicate: (sourcePageId: string, newPage: Page, metadata?: BaseAction['metadata']) =>
    createAction<PageActions['page/duplicate']>('page/duplicate', { sourcePageId, newPage }, metadata),
  
  setActive: (pageId: string | null, metadata?: BaseAction['metadata']) =>
    createAction<PageActions['page/setActive']>('page/setActive', { pageId }, metadata),
  
  // Batch operations
  removeWithCleanup: (pageId: string): BatchAction => ({
    type: 'batch/execute',
    payload: {
      actions: [
        pageActions.remove(pageId),
        uiActions.clearSelection(),
        uiActions.setDirty(true)
      ],
      description: `Supprimer la page et nettoyer l'état`
    },
    timestamp: Date.now(),
    metadata: { source: 'user', undoable: true }
  })
} as const;

// =============================================================================
// MODULE ACTION CREATORS
// =============================================================================

export const moduleActions = {
  add: (pageId: string, module: Module, metadata?: BaseAction['metadata']) =>
    createAction<ModuleActions['module/add']>('module/add', { pageId, module }, metadata),
  
  remove: (moduleId: string, pageId: string, metadata?: BaseAction['metadata']) =>
    createAction<ModuleActions['module/remove']>('module/remove', { moduleId, pageId }, metadata),
  
  update: (moduleId: string, updates: Partial<Module>, metadata?: BaseAction['metadata']) =>
    createAction<ModuleActions['module/update']>('module/update', { moduleId, updates }, metadata),
  
  move: (moduleId: string, fromPageId: string, toPageId: string, toIndex?: number, metadata?: BaseAction['metadata']) =>
    createAction<ModuleActions['module/move']>('module/move', { moduleId, fromPageId, toPageId, toIndex }, metadata),
  
  reorder: (pageId: string, moduleIds: string[], metadata?: BaseAction['metadata']) =>
    createAction<ModuleActions['module/reorder']>('module/reorder', { pageId, moduleIds }, metadata),
  
  duplicate: (sourceModuleId: string, pageId: string, newModule: Module, metadata?: BaseAction['metadata']) =>
    createAction<ModuleActions['module/duplicate']>('module/duplicate', { sourceModuleId, pageId, newModule }, metadata),
  
  // Batch operations
  addAndSelect: (pageId: string, module: Module): BatchAction => ({
    type: 'batch/execute',
    payload: {
      actions: [
        moduleActions.add(pageId, module),
        uiActions.setSelection({ pageId, moduleId: module.id, componentId: null }),
        uiActions.setDirty(true)
      ],
      description: `Ajouter module "${module.name}" et le sélectionner`
    },
    timestamp: Date.now(),
    metadata: { source: 'user', undoable: true }
  }),
  
  removeWithComponents: (moduleId: string, pageId: string, componentIds: string[]): BatchAction => ({
    type: 'batch/execute',
    payload: {
      actions: [
        ...componentIds.map(id => componentActions.remove(id, moduleId)),
        moduleActions.remove(moduleId, pageId),
        uiActions.clearSelection(),
        uiActions.setDirty(true)
      ],
      description: `Supprimer module et ses ${componentIds.length} composants`
    },
    timestamp: Date.now(),
    metadata: { source: 'user', undoable: true }
  })
} as const;

// =============================================================================
// COMPONENT ACTION CREATORS
// =============================================================================

export const componentActions = {
  add: (moduleId: string, component: Component, metadata?: BaseAction['metadata']) =>
    createAction<ComponentActions['component/add']>('component/add', { moduleId, component }, metadata),
  
  remove: (componentId: string, moduleId: string, metadata?: BaseAction['metadata']) =>
    createAction<ComponentActions['component/remove']>('component/remove', { componentId, moduleId }, metadata),
  
  update: (componentId: string, updates: Partial<Component>, metadata?: BaseAction['metadata']) =>
    createAction<ComponentActions['component/update']>('component/update', { componentId, updates }, metadata),
  
  move: (componentId: string, fromModuleId: string, toModuleId: string, toIndex?: number, metadata?: BaseAction['metadata']) =>
    createAction<ComponentActions['component/move']>('component/move', { componentId, fromModuleId, toModuleId, toIndex }, metadata),
  
  reorder: (moduleId: string, componentIds: string[], metadata?: BaseAction['metadata']) =>
    createAction<ComponentActions['component/reorder']>('component/reorder', { moduleId, componentIds }, metadata),
  
  duplicate: (sourceComponentId: string, moduleId: string, newComponent: Component, metadata?: BaseAction['metadata']) =>
    createAction<ComponentActions['component/duplicate']>('component/duplicate', { sourceComponentId, moduleId, newComponent }, metadata),
  
  // Batch operations
  addAndSelect: (moduleId: string, component: Component, pageId: string): BatchAction => ({
    type: 'batch/execute',
    payload: {
      actions: [
        componentActions.add(moduleId, component),
        uiActions.setSelection({ pageId, moduleId, componentId: component.id }),
        uiActions.setDirty(true)
      ],
      description: `Ajouter composant "${component.name}" et le sélectionner`
    },
    timestamp: Date.now(),
    metadata: { source: 'user', undoable: true }
  }),
  
  updateProps: (componentId: string, props: any): ComponentActions['component/update'] =>
    componentActions.update(componentId, { props }, { description: 'Mise à jour propriétés' }),
  
  updateStyles: (componentId: string, styles: any): ComponentActions['component/update'] =>
    componentActions.update(componentId, { styles }, { description: 'Mise à jour styles' }),
  
  updateName: (componentId: string, name: string): ComponentActions['component/update'] =>
    componentActions.update(componentId, { name }, { description: 'Renommer composant' })
} as const;

// =============================================================================
// UI ACTION CREATORS
// =============================================================================

export const uiActions = {
  setSelection: (selection: Selection, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/setSelection']>('ui/setSelection', selection, metadata),
  
  clearSelection: (metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/clearSelection']>('ui/clearSelection', undefined, metadata),
  
  setDevice: (device: DeviceType, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/setDevice']>('ui/setDevice', { device }, metadata),
  
  setViewport: (viewport: ViewportSettings, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/setViewport']>('ui/setViewport', viewport, metadata),
  
  setEditing: (editing: EditingState, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/setEditing']>('ui/setEditing', editing, metadata),
  
  addNotification: (notification: Notification, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/addNotification']>('ui/addNotification', notification, { ...metadata, undoable: false }),
  
  removeNotification: (notificationId: string, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/removeNotification']>('ui/removeNotification', { notificationId }, { ...metadata, undoable: false }),
  
  setLoading: (isLoading: boolean, operation?: string, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/setLoading']>('ui/setLoading', { isLoading, operation }, { ...metadata, undoable: false }),
  
  setDirty: (isDirty: boolean, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/setDirty']>('ui/setDirty', { isDirty }, { ...metadata, undoable: false }),
  
  updatePanel: (panelId: string, updates: Partial<PanelState>, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/updatePanel']>('ui/updatePanel', { panelId, updates }, { ...metadata, undoable: false }),
  
  // Helpers de navigation
  selectPage: (pageId: string) =>
    uiActions.setSelection({ pageId, moduleId: null, componentId: null }),
  
  selectModule: (pageId: string, moduleId: string) =>
    uiActions.setSelection({ pageId, moduleId, componentId: null }),
  
  selectComponent: (pageId: string, moduleId: string, componentId: string) =>
    uiActions.setSelection({ pageId, moduleId, componentId }),
  
  // Notifications helpers
  showSuccess: (message: string, title = 'Succès') =>
    uiActions.addNotification({
      id: `success-${Date.now()}`,
      type: 'success',
      title,
      message,
      duration: 3000
    }),
  
  showError: (message: string, title = 'Erreur') =>
    uiActions.addNotification({
      id: `error-${Date.now()}`,
      type: 'error',
      title,
      message,
      duration: 5000
    }),
  
  showWarning: (message: string, title = 'Attention') =>
    uiActions.addNotification({
      id: `warning-${Date.now()}`,
      type: 'warning',
      title,
      message,
      duration: 4000
    })
} as const;

// =============================================================================
// HISTORY ACTION CREATORS
// =============================================================================

export const historyActions = {
  undo: (metadata?: BaseAction['metadata']) =>
    createAction<HistoryActions['history/undo']>('history/undo', undefined, { ...metadata, undoable: false }),
  
  redo: (metadata?: BaseAction['metadata']) =>
    createAction<HistoryActions['history/redo']>('history/redo', undefined, { ...metadata, undoable: false }),
  
  clear: (metadata?: BaseAction['metadata']) =>
    createAction<HistoryActions['history/clear']>('history/clear', undefined, { ...metadata, undoable: false }),
  
  checkpoint: (description: string, metadata?: BaseAction['metadata']) =>
    createAction<HistoryActions['history/checkpoint']>('history/checkpoint', { description }, { ...metadata, undoable: false })
} as const;

// =============================================================================
// META ACTION CREATORS
// =============================================================================

export const metaActions = {
  save: (metadata?: BaseAction['metadata']) =>
    createAction<MetaActions['meta/save']>('meta/save', undefined, { ...metadata, undoable: false }),
  
  load: (data: any, metadata?: BaseAction['metadata']) =>
    createAction<MetaActions['meta/load']>('meta/load', { data }, { ...metadata, undoable: false }),
  
  reset: (metadata?: BaseAction['metadata']) =>
    createAction<MetaActions['meta/reset']>('meta/reset', undefined, { ...metadata, undoable: false })
} as const;

// =============================================================================
// BATCH ACTION CREATORS (ENHANCED)
// =============================================================================

export const batchActions = {
  execute: (actions: BuilderAction[], description: string): BatchAction => ({
    type: 'batch/execute',
    payload: { actions, description },
    timestamp: Date.now(),
    batchId: generateBatchId(),
    metadata: { source: 'user', undoable: true }
  }),
  
  // Operations complexes prêtes à l'emploi
  createFullPage: (pageData: CreatePageData, moduleData: CreateModuleData[], componentData: CreateComponentData[][]): BatchAction => {
    const pageId = createPageId();
    const page: Page = {
      id: pageId,
      name: pageData.name,
      slug: pageData.slug || pageData.name.toLowerCase().replace(/\s+/g, '-'),
      title: pageData.title || pageData.name,
      description: pageData.description || '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    const actions: BuilderAction[] = [
      pageActions.add(page),
      pageActions.setActive(page.id)
    ];
    
    // Ajouter modules et leurs composants
    moduleData.forEach((modData, modIndex) => {
      const moduleId = createModuleId();
      
      // Layout par défaut complet
      const defaultLayout = {
        type: 'section' as const,
        settings: {},
        desktop: 1 as const,
        tablet: 1 as const,
        mobile: 1 as const
      };
      
      const module: Module = {
        id: moduleId,
        name: modData.name,
        type: modData.type,
        layout: modData.layout ? { ...defaultLayout, ...modData.layout } : defaultLayout,
        styles: modData.styles || {},
        position: modIndex, // Position dans la page
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      actions.push(moduleActions.add(pageId, module));
      
      // Ajouter composants de ce module
      if (componentData[modIndex]) {
        componentData[modIndex].forEach(compData => {
          const componentId = createComponentId();
          
          // Layout par défaut pour composant
          const defaultComponentLayout = {
            span: 1 as const,
            position: 0,
            desktop: { span: 1 as const, offset: 0 },
            tablet: { span: 1 as const, offset: 0 },
            mobile: { span: 1 as const, offset: 0 }
          };
          
          const component: Component = {
            id: componentId,
            name: compData.name,
            type: compData.type,
            props: compData.props || {},
            styles: compData.styles || {},
            layout: defaultComponentLayout,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            span: undefined
          };
          
          actions.push(componentActions.add(moduleId, component));
        });
      }
    });
    
    actions.push(
      uiActions.selectPage(pageId),
      uiActions.setDirty(true),
      uiActions.showSuccess(`Page "${page.name}" créée avec succès`)
    );
    
    return batchActions.execute(actions, `Créer page complète "${page.name}"`);
  },
  
  duplicatePageFull: (sourcePageId: string, newPageData: CreatePageData): BatchAction => {
    // Cette action sera implémentée par le reducer en inspectant l'état
    return {
      type: 'batch/execute',
      payload: {
        actions: [], // Le reducer s'occupera de construire les actions
        description: `Dupliquer page complète vers "${newPageData.name}"`
      },
      timestamp: Date.now(),
      batchId: generateBatchId(),
      metadata: { 
        source: 'user', 
        undoable: true,
        duplicatePageData: { sourcePageId, newPageData } // Metadata spéciale
      }
    };
  }
} as const;

// =============================================================================
// HELPERS & UTILITIES
// =============================================================================

/**
 * Type guard pour les actions batch
 */
export function isBatchAction(action: BuilderAction): action is BatchAction {
  return action.type === 'batch/execute';
}

/**
 * Type guard pour les actions undoable
 */
export function isUndoableAction(action: BuilderAction): boolean {
  return action.metadata?.undoable !== false;
}

/**
 * Extraire les actions d'un batch
 */
export function extractActionsFromBatch(action: BatchAction): BuilderAction[] {
  return action.payload.actions;
}

/**
 * Créer une action système (non-undoable)
 */
export function createSystemAction<T extends BuilderAction>(
  type: T['type'],
  payload?: any
): T {
  return createAction(type, payload, { source: 'system', undoable: false });
}
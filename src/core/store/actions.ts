// =============================================================================
// STORE - ACTIONS TYPE-SAFE
// =============================================================================

import type { 
  Page, Module, Component, DeviceType, ViewportSettings, 
  Selection, EditingState, Notification, PanelState 
} from '../types';

// =============================================================================
// BASE ACTION INTERFACE
// =============================================================================

export interface BaseAction {
  type: string;
  payload?: any;
  timestamp: number;
  batchId?: string;
  metadata?: {
    source: 'user' | 'system' | 'import';
    undoable: boolean;
    description?: string;
  };
}

// Action interface pour créer des actions typées
export interface Action<TPayload = undefined> extends BaseAction {
  payload: TPayload;
}

// =============================================================================
// ACTION TYPES DEFINITIONS
// =============================================================================

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
  
  'page/setActive': {
    type: 'page/setActive';
    payload: { pageId: string };
  } & BaseAction;
  
  'page/reorder': {
    type: 'page/reorder';
    payload: { pageIds: string[] };
  } & BaseAction;
  
  'page/duplicate': {
    type: 'page/duplicate';
    payload: { sourcePageId: string; newPage: Page };
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

// Preview Actions (NOUVEAU)
export interface PreviewActions {
  'preview/setDevice': {
    type: 'preview/setDevice';
    payload: { device: DeviceType };
  } & BaseAction;
  
  'preview/setZoom': {
    type: 'preview/setZoom';
    payload: { zoom: number };
  } & BaseAction;
  
  'preview/zoomIn': {
    type: 'preview/zoomIn';
  } & BaseAction;
  
  'preview/zoomOut': {
    type: 'preview/zoomOut';
  } & BaseAction;
  
  'preview/resetZoom': {
    type: 'preview/resetZoom';
  } & BaseAction;
  
  'preview/toggleFullscreen': {
    type: 'preview/toggleFullscreen';
  } & BaseAction;
  
  'preview/toggleGrid': {
    type: 'preview/toggleGrid';
  } & BaseAction;
  
  'preview/setLoading': {
    type: 'preview/setLoading';
    payload: { isLoading: boolean };
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
export type PreviewAction = PreviewActions[keyof PreviewActions]; // NOUVEAU
export type HistoryAction = HistoryActions[keyof HistoryActions];
export type MetaAction = MetaActions[keyof MetaActions];
export type BatchAction = BatchActions[keyof BatchActions];

export type BuilderAction = 
  | PageAction 
  | ModuleAction 
  | ComponentAction 
  | UIAction 
  | PreviewAction  // NOUVEAU
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


// =============================================================================
// PREVIEW ACTION CREATORS (NOUVEAU)
// =============================================================================

export const previewActions = {
  setDevice: (device: DeviceType, metadata?: BaseAction['metadata']) =>
    createAction<PreviewActions['preview/setDevice']>('preview/setDevice', { device }, metadata),
  
  setZoom: (zoom: number, metadata?: BaseAction['metadata']) =>
    createAction<PreviewActions['preview/setZoom']>('preview/setZoom', { zoom }, metadata),
  
  zoomIn: (metadata?: BaseAction['metadata']) =>
    createAction<PreviewActions['preview/zoomIn']>('preview/zoomIn', undefined, metadata),
  
  zoomOut: (metadata?: BaseAction['metadata']) =>
    createAction<PreviewActions['preview/zoomOut']>('preview/zoomOut', undefined, metadata),
  
  resetZoom: (metadata?: BaseAction['metadata']) =>
    createAction<PreviewActions['preview/resetZoom']>('preview/resetZoom', undefined, metadata),
  
  toggleFullscreen: (metadata?: BaseAction['metadata']) =>
    createAction<PreviewActions['preview/toggleFullscreen']>('preview/toggleFullscreen', undefined, metadata),
  
  toggleGrid: (metadata?: BaseAction['metadata']) =>
    createAction<PreviewActions['preview/toggleGrid']>('preview/toggleGrid', undefined, metadata),
  
  setLoading: (isLoading: boolean, metadata?: BaseAction['metadata']) =>
    createAction<PreviewActions['preview/setLoading']>('preview/setLoading', { isLoading }, metadata)
} as const;

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
  
  setActive: (pageId: string, metadata?: BaseAction['metadata']) =>
    createAction<PageActions['page/setActive']>('page/setActive', { pageId }, metadata),
  
  reorder: (pageIds: string[], metadata?: BaseAction['metadata']) =>
    createAction<PageActions['page/reorder']>('page/reorder', { pageIds }, metadata),
  
  duplicate: (sourcePageId: string, newPage: Page, metadata?: BaseAction['metadata']) =>
    createAction<PageActions['page/duplicate']>('page/duplicate', { sourcePageId, newPage }, metadata)
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
    createAction<UIActions['ui/addNotification']>('ui/addNotification', notification, { source: 'user', undoable: false, ...metadata }),
  
  removeNotification: (notificationId: string, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/removeNotification']>('ui/removeNotification', { notificationId }, { source: 'user', undoable: false, ...metadata }),
  
  setLoading: (isLoading: boolean, operation?: string, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/setLoading']>('ui/setLoading', { isLoading, operation }, { source: 'user', undoable: false, ...metadata }),
  
  setDirty: (isDirty: boolean, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/setDirty']>('ui/setDirty', { isDirty }, { source: 'user', undoable: false, ...metadata }),
  
  updatePanel: (panelId: string, updates: Partial<PanelState>, metadata?: BaseAction['metadata']) =>
    createAction<UIActions['ui/updatePanel']>('ui/updatePanel', { panelId, updates }, { source: 'user', undoable: false, ...metadata })
} as const;

// =============================================================================
// MODULE ACTION CREATORS (MANQUANT)
// =============================================================================

export const moduleActions = {
  add: (pageId: string, module: Module, metadata?: BaseAction['metadata']) =>
    createAction<ModuleActions['module/add']>('module/add', { pageId, module }, metadata),
  
  remove: (moduleId: string, pageId: string, metadata?: BaseAction['metadata']) =>
    createAction<ModuleActions['module/remove']>('module/remove', { moduleId, pageId }, metadata),
  
  update: (moduleId: string, updates: Partial<Module>, metadata?: BaseAction['metadata']) =>
    createAction<ModuleActions['module/update']>('module/update', { moduleId, updates }, metadata),
  
  reorder: (pageId: string, moduleIds: string[], metadata?: BaseAction['metadata']) =>
    createAction<ModuleActions['module/reorder']>('module/reorder', { pageId, moduleIds }, metadata)
} as const;

// =============================================================================
// COMPONENT ACTION CREATORS (MANQUANT)
// =============================================================================

export const componentActions = {
  add: (moduleId: string, component: Component, metadata?: BaseAction['metadata']) =>
    createAction<ComponentActions['component/add']>('component/add', { moduleId, component }, metadata),
  
  remove: (componentId: string, moduleId: string, metadata?: BaseAction['metadata']) =>
    createAction<ComponentActions['component/remove']>('component/remove', { componentId, moduleId }, metadata),
  
  update: (componentId: string, updates: Partial<Component>, metadata?: BaseAction['metadata']) =>
    createAction<ComponentActions['component/update']>('component/update', { componentId, updates }, metadata),
  
  reorder: (moduleId: string, componentIds: string[], metadata?: BaseAction['metadata']) =>
    createAction<ComponentActions['component/reorder']>('component/reorder', { moduleId, componentIds }, metadata)
} as const;
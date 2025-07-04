// =============================================================================
// STORE - EXPORTS CENTRALISÉS
// =============================================================================
export type { NormalizedBuilderState } from './state';
export { initialState } from './state';
export type {
  BuilderAction,
  PageAction,
  ModuleAction,
  ComponentAction,
  UIAction,
  HistoryAction,
  MetaAction
} from './actions';
export {
  pageActions,
  moduleActions,
  componentActions,
  uiActions
} from './actions';
export { builderReducer } from './reducer';
export {
  // Entités
  selectAllPages,
  selectPageById,
  selectActivePage,
  selectAllModules,
  selectModuleById,
  selectModulesForPage,
  selectAllComponents,
  selectComponentById,
  selectComponentsForModule,
 
  // UI
  selectActiveDevice,
  selectViewport,
  selectSelection,
  selectEditingState,
  selectNotifications,
  selectIsLoading,
  selectIsDirty,
  selectLayout,
 
  // Composés
  selectCurrentSelection,
  selectPageTree,
  selectFullProjectTree,
  selectBreadcrumb,
 
  // Utilitaires
  selectPageExists,
  selectModuleExists,
  selectComponentExists,
  selectProjectStats,
  selectCanNavigateUp,
  selectCanNavigateDown,
} from './selectors';
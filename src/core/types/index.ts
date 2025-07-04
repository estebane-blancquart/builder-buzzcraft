// =============================================================================
// CORE TYPES - EXPORTS CENTRALISÉS
// =============================================================================

// Exports des entités
export type {
  DeviceType,
  ComponentType,
  ModuleType,
  Page,
  Module,
  Component,
  ComponentProps,
  TitleProps,
  TextProps,
  ImageProps,
  ButtonProps,
  IconProps,
  SpacerProps,
  ListProps,
  VideoProps,
  ComponentStyles,
  CreatePageData,
  CreateModuleData,
  CreateComponentData,
} from './entities';

// Exports de l'interface utilisateur
export type {
  Selection,
  SelectionUpdate,
  ViewportSettings,
  DeviceDimensions,
  EditingState,
  DragData,
  DropZoneData,
  HistoryState,
  NotificationType,
  Notification,
  NotificationAction,
  KeyboardShortcut,
  PanelState,
  LayoutState,
  UIState,
} from './ui';
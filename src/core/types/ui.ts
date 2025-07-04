// =============================================================================
// CORE TYPES - INTERFACE UTILISATEUR
// =============================================================================

import type { DeviceType, Component, Module, Page, ComponentType } from './entities';

// =============================================================================
// SYSTÈME DE SÉLECTION
// =============================================================================

export interface Selection {
  pageId: string | null;
  moduleId: string | null;
  componentId: string | null;
}

// Types pour les actions de sélection
export interface SelectionUpdate {
  pageId?: string | null;
  moduleId?: string | null;
  componentId?: string | null;
}

// =============================================================================
// CONFIG PANEL - TYPES SPÉCIFIQUES
// =============================================================================

export interface SelectionInfo {
  readonly type: 'none' | 'page' | 'module' | 'component';
  readonly label: string;
  readonly icon: string;
  readonly elementName: string;
  readonly availableTabs: readonly string[];
}

export interface ConfigPanelProps {
  readonly selectionInfo: SelectionInfo;
  readonly selectedEntity: Component<ComponentType> | Module | Page | null;
  readonly onUpdateComponent: (componentId: string, updates: any) => void;
  readonly onUpdateComponentStyle: (componentId: string, styleUpdates: any) => void;
  readonly onUpdateComponentProps: (componentId: string, propUpdates: any) => void;
  readonly onUpdateModuleLayout: (moduleId: string, layoutUpdates: any) => void;
  readonly onUpdateModuleStyle: (moduleId: string, styleUpdates: any) => void;
}

// =============================================================================
// VIEWPORT ET PREVIEW
// =============================================================================

export interface ViewportSettings {
  zoom: number;              // 0.5 à 2.0
  showGrid: boolean;         // Afficher la grille d'alignement
  showRulers: boolean;       // Afficher les règles (pour plus tard)
  isFullscreen: boolean;     // Mode plein écran
  snapToGrid: boolean;       // Alignement automatique sur la grille
}

// Dimensions des devices
export interface DeviceDimensions {
  width: number;
  height: number;
  name: string;
}

// =============================================================================
// ÉDITION INLINE
// =============================================================================

export interface EditingState {
  componentId: string | null;  // ID du composant en cours d'édition
  field: string | null;        // Champ en cours d'édition (text, title, etc.)
  value: string;               // Valeur en cours d'édition
  originalValue: string;       // Valeur originale (pour annuler)
}

// =============================================================================
// DRAG & DROP
// =============================================================================

export interface DragData {
  type: 'component' | 'module';
  componentType?: string;      // Type de composant si type='component'
  moduleType?: string;         // Type de module si type='module'
  sourceId?: string;          // ID source pour les réorganisations
}

export interface DropZoneData {
  moduleId: string;           // ID du module de destination
  position?: number;          // Position dans le module (optionnel)
}

// =============================================================================
// HISTORIQUE (UNDO/REDO)
// =============================================================================

export interface HistoryState {
  past: any[];               // États précédents
  present: any;              // État actuel
  future: any[];             // États futurs (après undo)
  maxHistory: number;        // Nombre max d'états gardés
}

// =============================================================================
// NOTIFICATIONS / FEEDBACK
// =============================================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;         // Durée d'affichage (ms)
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary';
}

// =============================================================================
// RACCOURCIS CLAVIER
// =============================================================================

export interface KeyboardShortcut {
  key: string;              // Touche principale
  ctrlKey?: boolean;        // Ctrl requis
  altKey?: boolean;         // Alt requis
  shiftKey?: boolean;       // Shift requis
  action: string;           // Action à déclencher
  description: string;      // Description pour l'aide
}

// =============================================================================
// PANELS ET LAYOUT
// =============================================================================

export interface PanelState {
  isCollapsed: boolean;     // Panel replié ou non
  width?: number;           // Largeur custom (pour resize)
  isVisible: boolean;       // Panel visible ou masqué
}

export interface LayoutState {
  explorerPanel: PanelState;
  configPanel: PanelState;
  previewArea: {
    device: DeviceType;
    viewport: ViewportSettings;
  };
}

// =============================================================================
// ÉTAT UI GLOBAL
// =============================================================================

export interface UIState {
  // Device et viewport
  activeDevice: DeviceType;
  viewport: ViewportSettings;
  
  // Sélection actuelle
  selection: Selection;
  
  // Édition
  editing: EditingState;
  
  // Layout des panels
  layout: LayoutState;
  
  // Notifications
  notifications: Notification[];
  
  // Historique
  history: HistoryState;
  
  // États temporaires
  isLoading: boolean;
  isDirty: boolean;         // Modifications non sauvées
  lastSaved?: number | undefined;       // Timestamp dernière sauvegarde
}
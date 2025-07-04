// =============================================================================
// PREVIEW TOOLBAR - COMPOSANT UI PUR
// =============================================================================
import React from 'react';

// =============================================================================
// TYPES
// =============================================================================
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  icon: string;
}

export interface PreviewToolbarProps {
  readonly currentDevice: DeviceConfig;
  readonly activeDevice: DeviceType;
  readonly zoomPercentage: number;
  readonly isFullscreen: boolean;
  readonly showGrid: boolean;
  readonly onDeviceChange: (device: DeviceType) => void;
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
  readonly onResetZoom: () => void;
  readonly onFitToScreen: () => void;
  readonly onFullscreenToggle: () => void;
  readonly onGridToggle: () => void;
  readonly onRefresh: () => void;
  readonly onExport: () => void;
}

// =============================================================================
// ICÔNES
// =============================================================================
const Icons = {
  ZoomIn: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 6H8M6 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 10L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  ZoomOut: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 6H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 10L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  Fullscreen: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 4.5V2.5C2 2.22386 2.22386 2 2.5 2H4.5M9.5 2H11.5C11.7761 2 12 2.22386 12 2.5V4.5M12 9.5V11.5C12 11.7761 11.7761 12 11.5 12H9.5M4.5 12H2.5C2.22386 12 2 11.7761 2 11.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  Grid: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 4H13M1 7H13M1 10H13M4 1V13M7 1V13M10 1V13" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C8.44503 2 9.7417 2.61337 10.6172 3.58579" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 1V4H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  Export: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1V9M7 1L4 4M7 1L10 4M2 9V11C2 11.5523 2.44772 12 3 12H11C11.5523 12 12 11.5523 12 11V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// =============================================================================
// COMPOSANT PREVIEW TOOLBAR
// =============================================================================
export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  currentDevice,
  activeDevice,
  zoomPercentage,
  isFullscreen,
  showGrid,
  onDeviceChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitToScreen,
  onFullscreenToggle,
  onGridToggle,
  onRefresh,
  onExport
}) => {
  // =============================================================================
  // DEVICE BUTTONS
  // =============================================================================
  const renderDeviceButtons = () => {
    const devices: { type: DeviceType; icon: string; label: string }[] = [
      { type: 'mobile', icon: '📱', label: 'Mobile' },
      { type: 'tablet', icon: '📱', label: 'Tablet' },
      { type: 'desktop', icon: '🖥️', label: 'Desktop' }
    ];

    return (
      <div className="device-group">
        {devices.map(device => (
          <button
            key={device.type}
            className={`device-btn ${activeDevice === device.type ? 'active' : ''}`}
            onClick={() => onDeviceChange(device.type)}
            title={device.label}
          >
            <span className="device-icon">{device.icon}</span>
            <span className="device-label">{device.label}</span>
          </button>
        ))}
      </div>
    );
  };

  // =============================================================================
  // ZOOM CONTROLS
  // =============================================================================
  const renderZoomControls = () => {
    return (
      <div className="zoom-group">
        <button 
          className="zoom-btn"
          onClick={onZoomOut}
          title="Zoom arrière"
        >
          <Icons.ZoomOut />
        </button>
        
        <button 
          className="zoom-value"
          onClick={onResetZoom}
          title="Réinitialiser le zoom"
        >
          {zoomPercentage}%
        </button>
        
        <button 
          className="zoom-btn"
          onClick={onZoomIn}
          title="Zoom avant"
        >
          <Icons.ZoomIn />
        </button>
        
        <button 
          className="fit-btn"
          onClick={onFitToScreen}
          title="Ajuster à l'écran"
        >
          Ajuster
        </button>
      </div>
    );
  };

  // =============================================================================
  // ACTION BUTTONS
  // =============================================================================
  const renderActionButtons = () => {
    return (
      <div className="action-group">
        <button
          className={`action-btn ${showGrid ? 'active' : ''}`}
          onClick={onGridToggle}
          title="Afficher/masquer la grille"
        >
          <Icons.Grid />
        </button>
        
        <button
          className={`action-btn ${isFullscreen ? 'active' : ''}`}
          onClick={onFullscreenToggle}
          title="Mode plein écran"
        >
          <Icons.Fullscreen />
        </button>
        
        <button
          className="action-btn"
          onClick={onRefresh}
          title="Actualiser l'aperçu"
        >
          <Icons.Refresh />
        </button>
        
        <button
          className="action-btn"
          onClick={onExport}
          title="Exporter l'aperçu"
        >
          <Icons.Export />
        </button>
      </div>
    );
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="preview-toolbar">
      {/* Device Selection */}
      {renderDeviceButtons()}
      
      {/* Device Info */}
      <div className="device-indicator">
        <span className="device-icon">{currentDevice.icon}</span>
        <span className="device-name">{currentDevice.name}</span>
        <span className="device-dimensions">
          {currentDevice.width} × {currentDevice.height}
        </span>
      </div>
      
      {/* Zoom Controls */}
      {renderZoomControls()}
      
      {/* Action Buttons */}
      {renderActionButtons()}
    </div>
  );
};
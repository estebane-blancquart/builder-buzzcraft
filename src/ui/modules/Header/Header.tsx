// =============================================================================
// HEADER - VERSION MODERNE AVEC ACTIONS PREVIEW
// =============================================================================
import React, { useCallback, useState, useEffect } from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { previewActions } from '../../../core/store/actions';
import type { DeviceType } from '../../../core/types';
import './Header.scss';

// =============================================================================
// INTERFACE
// =============================================================================
interface HeaderProps {
  readonly onPreview?: () => void;
  readonly onSave?: () => void;
  readonly onExport?: () => void;
}

// =============================================================================
// COMPOSANT HEADER MODERNE
// =============================================================================
export const Header: React.FC<HeaderProps> = ({
  onPreview,
  onSave,
  onExport
}) => {
  const { state, dispatch } = useBuilder();
  
  // State preview depuis le store global
  const { activeDevice, zoom, isFullscreen, showGrid } = state.ui.preview;
  const [isDark, setIsDark] = useState(false);

  // =============================================================================
  // THEME MANAGEMENT
  // =============================================================================
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDark(currentTheme === 'dark');
  }, []);

  // =============================================================================
  // HANDLERS PREVIEW (DISPATCH VERS STORE)
  // =============================================================================
  const handleDeviceChange = useCallback((device: DeviceType) => {
    dispatch(previewActions.setDevice(device));
  }, [dispatch]);

  const handleZoomIn = useCallback(() => {
    dispatch(previewActions.zoomIn());
  }, [dispatch]);

  const handleZoomOut = useCallback(() => {
    dispatch(previewActions.zoomOut());
  }, [dispatch]);

  const handleResetZoom = useCallback(() => {
    dispatch(previewActions.resetZoom());
  }, [dispatch]);

  const handleFullscreenToggle = useCallback(() => {
    dispatch(previewActions.toggleFullscreen());
  }, [dispatch]);

  const handleGridToggle = useCallback(() => {
    dispatch(previewActions.toggleGrid());
  }, [dispatch]);

  const handleThemeToggle = useCallback(() => {
    const html = document.documentElement;
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    setIsDark(!isDark);
  }, [isDark]);

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
            onClick={() => handleDeviceChange(device.type)}
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
    const zoomPercentage = Math.round(zoom * 100);
    
    return (
      <div className="zoom-group">
        <button 
          className="zoom-btn"
          onClick={handleZoomOut}
          title="Zoom arrière"
          disabled={zoom <= 0.1}
        >
          🔍-
        </button>
        
        <button 
          className="zoom-value"
          onClick={handleResetZoom}
          title="Réinitialiser le zoom (100%)"
        >
          {zoomPercentage}%
        </button>
        
        <button 
          className="zoom-btn"
          onClick={handleZoomIn}
          title="Zoom avant"
          disabled={zoom >= 3}
        >
          🔍+
        </button>
      </div>
    );
  };

  // =============================================================================
  // ACTION BUTTONS
  // =============================================================================
  const renderActionButtons = () => {
    return (
      <div className="header-actions">
        <button
          className={`btn btn-secondary ${showGrid ? 'active' : ''}`}
          onClick={handleGridToggle}
          title="Afficher/masquer la grille"
        >
          <span>⊞</span>
          <span>Grille</span>
        </button>
        
        <button
          className={`btn btn-secondary ${isFullscreen ? 'active' : ''}`}
          onClick={handleFullscreenToggle}
          title="Mode plein écran"
        >
          <span>⛶</span>
          <span>Plein écran</span>
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={onPreview}
          title="Aperçu dans un nouvel onglet"
        >
          <span>👁️</span>
          <span>Aperçu</span>
        </button>
        
        <button
          className="btn btn-primary"
          onClick={onSave}
          title="Sauvegarder le projet"
        >
          <span>💾</span>
          <span>Sauvegarder</span>
        </button>
        
        <button
          className="btn btn-primary"
          onClick={onExport}
          title="Exporter le site"
        >
          <span>📤</span>
          <span>Exporter</span>
        </button>
      </div>
    );
  };

  // =============================================================================
  // RENDER PRINCIPAL
  // =============================================================================
  return (
    <header className="modern-header">
      {/* Brand */}
      <div className="header-brand">
        <div className="brand-content">
          <div className="brand-logo">
            🚀
          </div>
          <div className="brand-info">
            <h1 className="brand-title">BuzzCraft</h1>
            <span className="brand-subtitle">BUILDER</span>
          </div>
        </div>
        
        <div className="project-name">
          Nouveau projet
        </div>
      </div>

      {/* Navigation centrale */}
      <nav className="header-nav">
        {/* Device Selection */}
        {renderDeviceButtons()}
        
        {/* Zoom Controls */}
        {renderZoomControls()}
      </nav>

      {/* Actions à droite */}
      <div className="header-right">
        {renderActionButtons()}
        
        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={handleThemeToggle}
          title={`Passer en mode ${isDark ? 'clair' : 'sombre'}`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};
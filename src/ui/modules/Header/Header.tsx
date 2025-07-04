// =============================================================================
// HEADER - COMPOSANT PRINCIPAL
// =============================================================================
import React from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { uiActions } from '../../../core/store/actions';
import type { DeviceType } from '../../../core/types';
import './Header.scss';

// =============================================================================
// TYPES
// =============================================================================
interface HeaderProps {
  onPreview?: () => void;
  onSave?: () => void;
  onExport?: () => void;
}

// =============================================================================
// COMPOSANT HEADER
// =============================================================================
export const Header: React.FC<HeaderProps> = ({ 
  onPreview, 
  onSave, 
  onExport 
}) => {
  const { state, dispatch } = useBuilder();
  const { activeDevice, viewport } = state.ui;

  // Détection du thème depuis le DOM
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDark(currentTheme === 'dark');
  }, []);

  // =============================================================================
  // HANDLERS
  // =============================================================================
  const handleDeviceChange = (device: DeviceType) => {
    dispatch(uiActions.setDevice(device));
  };

  const handleThemeToggle = () => {
    const html = document.documentElement;
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    setIsDark(!isDark);
  };

  const handleZoomChange = (zoom: number) => {
    dispatch(uiActions.setViewport({ ...viewport, zoom }));
  };

  const handleZoomReset = () => {
    handleZoomChange(1);
  };

  // =============================================================================
  // DEVICES CONFIG
  // =============================================================================
  const devices = [
    { type: 'mobile' as DeviceType, icon: '📱', label: 'Mobile', shortcut: 'M' },
    { type: 'tablet' as DeviceType, icon: '💻', label: 'Tablet', shortcut: 'T' },
    { type: 'desktop' as DeviceType, icon: '🖥️', label: 'Desktop', shortcut: 'D' },
  ];

  // États pour feedback utilisateur
  const hasPages = state.entities.pages && Object.keys(state.entities.pages).length > 0;
  const canSave = hasPages && onSave;
  const canPreview = hasPages && onPreview;

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <header className="builder-header">
      {/* Section gauche - Branding */}
      <div className="header-section header-left">
        <div className="brand">
          <div className="brand-icon">🔥</div>
          <div className="brand-text">
            <span className="brand-name">BuzzCraft</span>
            <span className="brand-suffix">Builder</span>
          </div>
        </div>
      </div>

      {/* Section centre - Device Selector + Zoom */}
      <div className="header-section header-center">
        <div className="device-selector">
          {devices.map(device => (
            <button
              key={device.type}
              className={`device-btn ${activeDevice === device.type ? 'active' : ''}`}
              onClick={() => handleDeviceChange(device.type)}
              title={`${device.label} (${device.shortcut})`}
            >
              <span className="device-icon">{device.icon}</span>
              <span className="device-label">{device.label}</span>
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="zoom-controls">
          <button
            className="zoom-btn"
            onClick={() => handleZoomChange(Math.max(viewport.zoom - 0.1, 0.5))}
            disabled={viewport.zoom <= 0.5}
            title="Zoom arrière"
          >
            ➖
          </button>
          
          <button
            className="zoom-display"
            onClick={handleZoomReset}
            title="Reset zoom (100%)"
          >
            {Math.round(viewport.zoom * 100)}%
          </button>
          
          <button
            className="zoom-btn"
            onClick={() => handleZoomChange(Math.min(viewport.zoom + 0.1, 2))}
            disabled={viewport.zoom >= 2}
            title="Zoom avant"
          >
            ➕
          </button>
        </div>
      </div>

      {/* Section droite - Actions */}
      <div className="header-section header-right">
        <div className="action-group">
          {/* Theme Toggle */}
          <button
            className="action-btn secondary"
            onClick={handleThemeToggle}
            title={`Mode ${isDark ? 'clair' : 'sombre'}`}
          >
            <span className="btn-icon">
              {isDark ? '☀️' : '🌙'}
            </span>
          </button>

          {/* Preview */}
          <button
            className={`action-btn secondary ${!canPreview ? 'disabled' : ''}`}
            onClick={onPreview}
            disabled={!canPreview}
            title={canPreview ? 'Aperçu du site' : 'Créez des pages pour prévisualiser'}
          >
            <span className="btn-icon">👁️</span>
            <span className="btn-text">Aperçu</span>
          </button>

          {/* Save */}
          <button
            className={`action-btn primary ${!canSave ? 'disabled' : ''}`}
            onClick={onSave}
            disabled={!canSave}
            title={canSave ? 'Sauvegarder le projet' : 'Créez des pages pour sauvegarder'}
          >
            <span className="btn-icon">💾</span>
            <span className="btn-text">Sauvegarder</span>
          </button>

          {/* Export (bonus) */}
          {onExport && (
            <button
              className={`action-btn success ${!hasPages ? 'disabled' : ''}`}
              onClick={onExport}
              disabled={!hasPages}
              title={hasPages ? 'Exporter le projet' : 'Créez des pages pour exporter'}
            >
              <span className="btn-icon">📦</span>
              <span className="btn-text">Exporter</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
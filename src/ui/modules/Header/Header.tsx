// =============================================================================
// HEADER - COMPOSANT TOUT-EN-UN
// =============================================================================
import React, { useCallback, useState, useEffect } from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { uiActions } from '../../../core/store/actions';
import type { DeviceType } from '../../../core/types';
import './Header.scss';

// =============================================================================
// INTERFACE PUBLIQUE
// =============================================================================
interface HeaderProps {
  readonly onPreview?: () => void;
  readonly onSave?: () => void;
  readonly onExport?: () => void;
}

// =============================================================================
// COMPOSANT HEADER COMPLET
// =============================================================================
export const Header: React.FC<HeaderProps> = ({
  onPreview,
  onSave,
  onExport
}) => {
  const { state, dispatch } = useBuilder();
  const { activeDevice, viewport } = state.ui;

  // =============================================================================
  // ÉTAT LOCAL
  // =============================================================================
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDark(currentTheme === 'dark');
  }, []);

  // =============================================================================
  // HANDLERS
  // =============================================================================
  const handleDeviceChange = useCallback((device: DeviceType) => {
    dispatch(uiActions.setDevice(device));
  }, [dispatch]);

  const handleZoomChange = useCallback((zoom: number) => {
    dispatch(uiActions.setViewport({
      ...viewport,
      zoom: Math.max(0.1, Math.min(3, zoom))
    }));
  }, [dispatch, viewport]);

  const handleThemeToggle = useCallback(() => {
    const html = document.documentElement;
    const newTheme = isDark ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
  }, [isDark]);

  const handleZoomIn = () => handleZoomChange(viewport.zoom + 0.1);
  const handleZoomOut = () => handleZoomChange(viewport.zoom - 0.1);
  const handleZoomReset = () => handleZoomChange(1);

  const handlePreview = onPreview || (() => console.log('Preview clicked'));
  const handleSave = onSave || (() => console.log('Save clicked'));
  const handleExport = onExport || (() => console.log('Export clicked'));

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <header className="builder-header">
      {/* Logo / Titre */}
      <div className="header-section header-brand">
        <div className="brand-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
          </svg>
        </div>
        <div className="brand-text">
          <h1 className="brand-title">BuzzCraft</h1>
          <span className="brand-subtitle">Builder</span>
        </div>
      </div>

      {/* Sélecteur de device */}
      <div className="header-section header-devices">
        <div className="device-selector">
          <button
            className={`device-btn ${activeDevice === 'mobile' ? 'active' : ''}`}
            onClick={() => handleDeviceChange('mobile')}
            title="Vue Mobile"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="18" r="1" fill="currentColor"/>
            </svg>
          </button>
          <button
            className={`device-btn ${activeDevice === 'tablet' ? 'active' : ''}`}
            onClick={() => handleDeviceChange('tablet')}
            title="Vue Tablet"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="17.5" r="0.5" fill="currentColor"/>
            </svg>
          </button>
          <button
            className={`device-btn ${activeDevice === 'desktop' ? 'active' : ''}`}
            onClick={() => handleDeviceChange('desktop')}
            title="Vue Desktop"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Contrôles de zoom */}
      <div className="header-section header-zoom">
        <div className="zoom-controls">
          <button
            className="zoom-btn"
            onClick={handleZoomOut}
            disabled={viewport.zoom <= 0.1}
            title="Zoom arrière"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35M8 11h6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          
          <span className="zoom-display" onClick={handleZoomReset} title="Reset zoom">
            {Math.round(viewport.zoom * 100)}%
          </span>
          
          <button
            className="zoom-btn"
            onClick={handleZoomIn}
            disabled={viewport.zoom >= 3}
            title="Zoom avant"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Actions principales */}
      <div className="header-section header-actions">
        <button
          className="action-btn preview-btn"
          onClick={handlePreview}
          title="Aperçu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Aperçu
        </button>
        
        <button
          className="action-btn save-btn"
          onClick={handleSave}
          title="Sauvegarder"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/>
            <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2"/>
            <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Sauvegarder
        </button>
        
        <button
          className="action-btn export-btn"
          onClick={handleExport}
          title="Exporter"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 15V5" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Exporter
        </button>
      </div>

      {/* Toggle thème */}
      <div className="header-section header-theme">
        <button
          className="theme-toggle"
          onClick={handleThemeToggle}
          title={`Basculer vers le thème ${isDark ? 'clair' : 'sombre'}`}
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
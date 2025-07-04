// =============================================================================
// HEADER - VERSION MODERNE AVEC NOUVEAU DESIGN SYSTEM
// =============================================================================
import React, { useCallback, useState, useEffect } from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { uiActions } from '../../../core/store/actions';
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
  const { activeDevice, viewport } = state.ui;
  const [isDark, setIsDark] = useState(false);

  // =============================================================================
  // THEME MANAGEMENT
  // =============================================================================
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

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <header className="modern-header">
      {/* Logo / Brand */}
      <div className="header-brand">
        <div className="brand-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor"/>
            <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor"/>
            <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor"/>
            <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor"/>
          </svg>
        </div>
        <div className="brand-content">
          <h1 className="brand-title">BuzzCraft</h1>
          <span className="brand-subtitle">Builder</span>
        </div>
        <div className="project-name">
          <span>Nouveau projet</span>
        </div>
      </div>

      {/* Navigation centrale */}
      <div className="header-nav">
        {/* Device Selector */}
        <div className="device-group">
          <button
            className={`device-btn ${activeDevice === 'mobile' ? 'active' : ''}`}
            onClick={() => handleDeviceChange('mobile')}
            title="Mobile"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="7" y="2" width="10" height="20" rx="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 18h0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Mobile</span>
          </button>
          
          <button
            className={`device-btn ${activeDevice === 'tablet' ? 'active' : ''}`}
            onClick={() => handleDeviceChange('tablet')}
            title="Tablet"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="17.5" r="0.5" fill="currentColor"/>
            </svg>
            <span>Tablet</span>
          </button>
          
          <button
            className={`device-btn ${activeDevice === 'desktop' ? 'active' : ''}`}
            onClick={() => handleDeviceChange('desktop')}
            title="Desktop"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 16h20" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 20v-4" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 20h8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Desktop</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="zoom-group">
          <button onClick={handleZoomOut} disabled={viewport.zoom <= 0.1} title="Zoom Out">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 11h6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          
          <button onClick={handleZoomReset} className="zoom-reset">
            {Math.round(viewport.zoom * 100)}%
          </button>
          
          <button onClick={handleZoomIn} disabled={viewport.zoom >= 3} title="Zoom In">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              <path d="M11 8v6" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 11h6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Actions droite */}
      <div className="header-actions">
        <button className="btn btn-ghost" onClick={onPreview}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>Aperçu</span>
        </button>
        
        <button className="btn btn-outline" onClick={onSave}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/>
            <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2"/>
            <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>Sauvegarder</span>
        </button>
        
        <button className="btn btn-primary" onClick={onExport}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
            <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>Exporter</span>
        </button>
        
        <button className="theme-toggle" onClick={handleThemeToggle} title="Changer le thème">
          {isDark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2"/>
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};
// =============================================================================
// PREVIEW AREA - COMPOSANT TOUT-EN-UN
// =============================================================================
import React, { useMemo } from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { PageRenderer } from './PageRenderer';
import './PreviewArea.scss';

// =============================================================================
// COMPOSANT PREVIEW AREA COMPLET
// =============================================================================
export const PreviewArea: React.FC = () => {
  const { state } = useBuilder();
  const { activeDevice, viewport } = state.ui;

  // =============================================================================
  // CALCULS DÉRIVÉS
  // =============================================================================
  const frameSize = useMemo(() => {
    switch (activeDevice) {
      case 'mobile':
        return { width: 375, height: 667 }; // iPhone SE
      case 'tablet':
        return { width: 768, height: 1024 }; // iPad
      case 'desktop':
        return { width: 1200, height: 800 }; // Desktop
      default:
        return { width: 1200, height: 800 };
    }
  }, [activeDevice]);

  const scaledDimensions = useMemo(() => ({
    scaledWidth: frameSize.width * viewport.zoom,
    scaledHeight: frameSize.height * viewport.zoom
  }), [frameSize, viewport.zoom]);

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <main className="preview-area">
      <div className="preview-container">
        {/* Info device en haut */}
        <div className="device-info">
          <div className="device-icon">
            {activeDevice === 'mobile' && '📱'}
            {activeDevice === 'tablet' && '📋'}  
            {activeDevice === 'desktop' && '🖥️'}
          </div>
          <div className="device-label">
            {activeDevice === 'mobile' && 'Mobile'}
            {activeDevice === 'tablet' && 'Tablet'}
            {activeDevice === 'desktop' && 'Desktop'}
          </div>
          <div className="device-size">
            {frameSize.width} × {frameSize.height}
          </div>
        </div>

        {/* Frame responsive */}
        <div 
          className={`preview-frame ${activeDevice}`}
          style={{
            width: `${frameSize.width}px`,
            height: `${frameSize.height}px`,
            transform: `scale(${viewport.zoom})`,
            transformOrigin: 'top center'
          }}
        >
          {/* Contenu de la frame */}
          <div className="frame-content">
            <PageRenderer />
          </div>
        </div>

        {/* Debug info en bas */}
        <div className="debug-info">
          <div className="debug-item">
            <span className="debug-label">ZOOM</span>
            <span className="debug-value">{Math.round(viewport.zoom * 100)}%</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">TAILLE</span>
            <span className="debug-value">{scaledDimensions.scaledWidth.toFixed(0)}×{scaledDimensions.scaledHeight.toFixed(0)}</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">DEVICE</span>
            <span className="debug-value">{activeDevice.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

PreviewArea.displayName = 'PreviewArea';
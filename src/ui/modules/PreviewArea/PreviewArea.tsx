// =============================================================================
// PREVIEW AREA - ZONE DE PRÉVISUALISATION
// =============================================================================
import React from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { PageRenderer } from './PageRenderer';
import './PreviewArea.scss';

// =============================================================================
// COMPOSANT PREVIEW AREA
// =============================================================================
export const PreviewArea: React.FC = () => {
  const { state } = useBuilder();
  
  // Données pour l'affichage
  const { activeDevice, viewport } = state.ui;
  
  // Dimensions selon le device
  const getFrameSize = () => {
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
  };
  
  const frameSize = getFrameSize();
  const scaledWidth = frameSize.width * viewport.zoom;
  const scaledHeight = frameSize.height * viewport.zoom;
  
  return (
    <main className="preview-area">
      <div className="preview-container">
        {/* Frame responsive */}
        <div 
          className={`preview-frame ${activeDevice}`}
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            transform: `scale(${viewport.zoom})`,
            transformOrigin: 'top center'
          }}
        >
          {/* Contenu de la frame */}
          <div className="frame-content">
            <PageRenderer />
          </div>
        </div>
      </div>
    </main>
  );
};
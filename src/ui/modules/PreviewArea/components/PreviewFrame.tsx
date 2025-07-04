// =============================================================================
// PREVIEW FRAME - COMPOSANT UI FRAME RESPONSIVE
// =============================================================================
import React from 'react';
import { PageRenderer } from './PageRenderer';
import type { DeviceType, DeviceConfig } from '@/core/hooks/usePreviewHooks';

// =============================================================================
// TYPES
// =============================================================================
interface PreviewFrameProps {
  readonly currentDevice: DeviceConfig;
  readonly activeDevice: DeviceType;
  readonly zoom: number;
  readonly showGrid: boolean;
  readonly pageId?: string | undefined;
}

// =============================================================================
// COMPOSANT PREVIEW FRAME
// =============================================================================
export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  currentDevice,
  activeDevice,
  zoom,
  showGrid,
  pageId
}) => {
  // =============================================================================
  // CALCUL DES CLASSES CSS
  // =============================================================================
  const frameClasses = [
    'preview-frame',
    `device-${activeDevice}`
  ].join(' ');

  // =============================================================================
  // STYLES INLINE (DIMENSIONS ET ZOOM)
  // =============================================================================
  const frameStyles: React.CSSProperties = {
    width: currentDevice.width,
    height: currentDevice.height,
    transform: `scale(${zoom})`
  };

  // =============================================================================
  // GRILLE OPTIONNELLE
  // =============================================================================
  const renderGrid = () => {
    if (!showGrid) return null;
    
    return <div className="preview-grid" />;
  };

  // =============================================================================
  // SIMULATION DEVICE
  // =============================================================================
  const renderDeviceChrome = () => {
    // Mobile : encoche
    if (activeDevice === 'mobile') {
      return <div className="device-notch" />;
    }
    
    // Desktop : barre de navigateur
    if (activeDevice === 'desktop') {
      return (
        <>
          <div className="browser-bar" />
          <div className="browser-dots" />
        </>
      );
    }
    
    return null;
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className={frameClasses} style={frameStyles}>
      {/* Chrome du device */}
      {renderDeviceChrome()}
      
      {/* Grille optionnelle */}
      {renderGrid()}
      
      {/* Contenu de la page */}
      <div className="preview-content">
        <PageRenderer pageId={pageId} />
      </div>
    </div>
  );
};
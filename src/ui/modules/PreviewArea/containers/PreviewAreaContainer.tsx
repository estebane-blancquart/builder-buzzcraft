// =============================================================================
// PREVIEW AREA CONTAINER - LOGIQUE DE CONNEXION AVEC DIMENSIONS CORRIGÉES
// =============================================================================
import React, { useCallback } from 'react';
import { useBuilder } from '../../../../core/context/BuilderContext';
import { previewActions } from '../../../../core/store/actions';
import { PreviewViewport } from './PreviewViewport';

// =============================================================================
// CONTAINER (LOGIQUE DE CONNEXION)
// =============================================================================
export const PreviewAreaContainer: React.FC = () => {
  // =============================================================================
  // HOOKS
  // =============================================================================
  const { state, dispatch } = useBuilder();

  // =============================================================================
  // SÉLECTEURS DE DONNÉES
  // =============================================================================
  const hasPages = Object.keys(state.entities.pages || {}).length > 0;
  const selectedPageId = state.ui.selection.pageId;
  const firstPageId = Object.keys(state.entities.pages || {})[0];
  const currentPageId = selectedPageId || firstPageId;
  const hasCurrentPage = Boolean(currentPageId);

  // State preview depuis le store global
  const { activeDevice, zoom, isFullscreen, showGrid, isLoading } = state.ui.preview;

  // =============================================================================
  // DEVICE CONFIG - DIMENSIONS LOGIQUES CORRIGÉES
  // =============================================================================
  const deviceConfigs = {
    mobile: { 
      name: 'Mobile', 
      width: 375, 
      height: 667, 
      icon: '📱' 
    },
    tablet: { 
      name: 'Tablet', 
      width: 768, 
      height: 600, // CORRIGÉ: Plus petit que desktop
      icon: '📱' 
    },
    desktop: { 
      name: 'Desktop', 
      width: 1200, 
      height: 800, 
      icon: '🖥️' 
    }
  };

  const currentDevice = deviceConfigs[activeDevice];

  // =============================================================================
  // HANDLERS PREVIEW (DISPATCH VERS STORE)
  // =============================================================================
  const handleDeviceChange = useCallback((device: 'mobile' | 'tablet' | 'desktop') => {
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

  const handleSetZoom = useCallback((zoom: number) => {
    dispatch(previewActions.setZoom(zoom));
  }, [dispatch]);

  const handleFullscreenToggle = useCallback(() => {
    dispatch(previewActions.toggleFullscreen());
  }, [dispatch]);

  const handleGridToggle = useCallback(() => {
    dispatch(previewActions.toggleGrid());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    console.log('Refresh preview');
    // TODO: Implémenter refresh
  }, []);

  const handleExport = useCallback(() => {
    console.log('Export preview');
    // TODO: Implémenter export
  }, []);

  // =============================================================================
  // VIEWPORT PROPS
  // =============================================================================
  const viewportProps = {
    hasPages,
    hasCurrentPage,
    currentPageId,
    currentDevice,
    activeDevice,
    zoom,
    isFullscreen,
    showGrid,
    isLoading,
    
    // Actions
    onDeviceChange: handleDeviceChange,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onResetZoom: handleResetZoom,
    onSetZoom: handleSetZoom,
    onFullscreenToggle: handleFullscreenToggle,
    onGridToggle: handleGridToggle,
    onRefresh: handleRefresh,
    onExport: handleExport
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="preview-area">
      {/* Viewport */}
      <PreviewViewport {...viewportProps} />
    </div>
  );
};
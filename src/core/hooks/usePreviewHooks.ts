// =============================================================================
// PREVIEW HOOKS - LOGIQUE MÉTIER POUR PREVIEW AREA
// =============================================================================
import { useState, useCallback, useMemo } from 'react';

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

export interface PreviewState {
  activeDevice: DeviceType;
  zoom: number;
  isFullscreen: boolean;
  showGrid: boolean;
  isLoading: boolean;
}

// =============================================================================
// CONFIGURATION DES DEVICES
// =============================================================================
const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    icon: '📱'
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: '📱'
  },
  desktop: {
    name: 'Desktop',
    width: 1200,
    height: 800,
    icon: '🖥️'
  }
};

// =============================================================================
// HOOK DEVICE STATE
// =============================================================================
export const useDeviceState = () => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');

  const currentDevice = useMemo(() => DEVICE_CONFIGS[activeDevice], [activeDevice]);
  
  const switchDevice = useCallback((device: DeviceType) => {
    setActiveDevice(device);
  }, []);

  const nextDevice = useCallback(() => {
    const devices: DeviceType[] = ['mobile', 'tablet', 'desktop'];
    const currentIndex = devices.indexOf(activeDevice);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];
    if (nextDevice) {
      setActiveDevice(nextDevice);
    }
  }, [activeDevice]);

  return {
    activeDevice,
    currentDevice,
    devices: DEVICE_CONFIGS,
    switchDevice,
    nextDevice
  };
};

// =============================================================================
// HOOK ZOOM STATE
// =============================================================================
export const useZoomState = () => {
  const [zoom, setZoom] = useState(1);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 2));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.25));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  const fitToScreen = useCallback(() => {
    // Logic pour calculer le zoom optimal
    const viewportWidth = window.innerWidth - 600; // Moins les panels
    const viewportHeight = window.innerHeight - 200; // Moins le header/toolbar
    const deviceWidth = 1200; // Desktop par défaut
    const deviceHeight = 800;
    
    const scaleX = viewportWidth / deviceWidth;
    const scaleY = viewportHeight / deviceHeight;
    const optimalZoom = Math.min(scaleX, scaleY, 1);
    
    setZoom(Math.max(optimalZoom, 0.25));
  }, []);

  const zoomPercentage = useMemo(() => Math.round(zoom * 100), [zoom]);

  return {
    zoom,
    zoomPercentage,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
    setZoom
  };
};

// =============================================================================
// HOOK PREVIEW UI STATE
// =============================================================================
export const usePreviewUI = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const toggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    isFullscreen,
    showGrid,
    isLoading,
    toggleFullscreen,
    toggleGrid,
    startLoading,
    stopLoading
  };
};

// =============================================================================
// HOOK PREVIEW STATE COMBINÉ
// =============================================================================
export const usePreviewState = () => {
  const deviceState = useDeviceState();
  const zoomState = useZoomState();
  const uiState = usePreviewUI();

  return {
    ...deviceState,
    ...zoomState,
    ...uiState
  };
};

// =============================================================================
// HOOK PREVIEW ACTIONS
// =============================================================================
export const usePreviewActions = () => {
  const refreshPreview = useCallback(() => {
    console.log('Refresh preview');
    // Logic pour rafraîchir l'aperçu
  }, []);

  const exportPreview = useCallback(() => {
    console.log('Export preview');
    // Logic pour exporter l'aperçu
  }, []);

  const openInNewTab = useCallback(() => {
    console.log('Open in new tab');
    // Logic pour ouvrir dans un nouvel onglet
  }, []);

  const copyPreviewUrl = useCallback(() => {
    console.log('Copy preview URL');
    // Logic pour copier l'URL de preview
  }, []);

  return {
    refreshPreview,
    exportPreview,
    openInNewTab,
    copyPreviewUrl
  };
};

// =============================================================================
// HOOK PRINCIPAL (FACADE)
// =============================================================================
export const usePreview = () => {
  const state = usePreviewState();
  const actions = usePreviewActions();

  return {
    ...state,
    ...actions
  };
};
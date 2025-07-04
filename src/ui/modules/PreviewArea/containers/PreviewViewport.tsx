// =============================================================================
// PREVIEW VIEWPORT - GESTION DU VIEWPORT ET FRAME
// =============================================================================
import React from 'react';
import { PreviewFrame } from '../components/PreviewFrame';
import { DeviceType } from '../../../../core/hooks/usePreviewHooks';
import { DeviceConfig } from '../../../../core/hooks/usePreviewHooks';

// =============================================================================
// TYPES
// =============================================================================
interface PreviewViewportProps {
    readonly hasPages: boolean;
    readonly hasCurrentPage: boolean;
    currentPageId?: string | undefined;
    readonly currentDevice: DeviceConfig;
    readonly activeDevice: DeviceType;
    readonly zoom: number;
    readonly isFullscreen: boolean;
    readonly showGrid: boolean;
    readonly isLoading: boolean;
}

// =============================================================================
// COMPOSANT PREVIEW VIEWPORT
// =============================================================================
export const PreviewViewport: React.FC<PreviewViewportProps> = ({
    hasPages,
    hasCurrentPage,
    currentPageId,
    currentDevice,
    activeDevice,
    zoom,
    isFullscreen,
    showGrid,
    isLoading
}) => {
    // =============================================================================
    // ÉTAT DE CHARGEMENT
    // =============================================================================
    const renderLoadingState = () => {
        return (
            <div className="preview-loading">
                <div className="loading-spinner"></div>
                <div className="loading-text">Génération de l'aperçu...</div>
            </div>
        );
    };

    // =============================================================================
    // CALCUL DES CLASSES CSS
    // =============================================================================
    const viewportClasses = [
        'preview-viewport',
        isFullscreen && 'fullscreen'
    ].filter(Boolean).join(' ');

    // =============================================================================
    // RENDU CONDITIONNEL DU CONTENU
    // =============================================================================
    const renderContent = () => {
        // État de chargement
        if (isLoading) {
            return renderLoadingState();
        }

        // Pas de pages - AFFICHER FRAME VIDE
        if (!hasPages) {
            return (
                <PreviewFrame
                    currentDevice={currentDevice}
                    activeDevice={activeDevice}
                    zoom={zoom}
                    showGrid={showGrid}
                    pageId={undefined}
                />
            );
        }

        // Pas de page sélectionnée - ZONE VIDE
        if (!hasCurrentPage) {
            return null;
        }

        // Rendu normal avec frame
        return (
            <PreviewFrame
                currentDevice={currentDevice}
                activeDevice={activeDevice}
                zoom={zoom}
                showGrid={showGrid}
                pageId={currentPageId}
            />
        );
    };

    // =============================================================================
    // RENDER
    // =============================================================================
    return (
        <div className={viewportClasses}>
            {renderContent()}
        </div>
    );
};
// =============================================================================
// APP LAYOUT - STRUCTURE PRINCIPALE 3 COLONNES
// =============================================================================
import React from 'react';
import { ExplorerPanel } from '../modules/ExplorerPanel/ExplorerPanel';
import { PreviewArea } from '../modules/PreviewArea/PreviewArea';
import { ConfigPanel } from '../modules/ConfigPanel/ConfigPanel';
import { Header } from '../modules/Header/Header';
import './AppLayout.scss';

// =============================================================================
// LAYOUT PRINCIPAL
// =============================================================================
export const AppLayout: React.FC = () => {
  // =============================================================================
  // HANDLERS
  // =============================================================================
  const handlePreview = () => {
    // TODO: Implémenter l'aperçu
  };

  const handleSave = () => {
    // TODO: Implémenter la sauvegarde
  };

  const handleExport = () => {
    // TODO: Implémenter l'export
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="builder-grid">
      {/* Header global */}
      <div className="builder-header">
        <Header
          onPreview={handlePreview}
          onSave={handleSave}
          onExport={handleExport}
        />
      </div>
     
      {/* Panel gauche - Explorer */}
      <div className="explorer-panel">
        <ExplorerPanel />
      </div>

      {/* Zone centrale - Preview */}
      <div className="preview-area">
        <PreviewArea />
      </div>

      {/* Panel droit - Config */}
      <div className="config-panel">
        <ConfigPanel />
      </div>
    </div>
  );
};
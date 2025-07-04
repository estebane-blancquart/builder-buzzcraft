// =============================================================================
// APP PRINCIPALE - BUZZCRAFT BUILDER
// =============================================================================

import React from 'react';
import { BuilderProvider } from './core';
import { AppLayout } from './ui/layout/AppLayout';

// Import des styles globaux
import './theme/index.scss';

// =============================================================================
// COMPOSANT APP PRINCIPAL
// =============================================================================

const App: React.FC = () => {
  return (
    <BuilderProvider>
      <div className="builder-app">
        <AppLayout />
      </div>
    </BuilderProvider>
  );
};

export default App;
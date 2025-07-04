// =============================================================================
// CONFIG PANEL - COMPOSANT PRINCIPAL (UTILISE LE CONTAINER)
// =============================================================================
import React from 'react';
import { ConfigPanelContainer } from './containers/ConfigPanelContainer';
import './ConfigPanel.scss';

// =============================================================================
// COMPOSANT PRINCIPAL (DÉLÉGATION AU CONTAINER)
// =============================================================================
export const ConfigPanel: React.FC = () => {
  return <ConfigPanelContainer />;
};
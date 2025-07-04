// =============================================================================
// CONFIG TABS - COMPOSANT PUR
// =============================================================================
import React from 'react';

// =============================================================================
// INTERFACES PROPS
// =============================================================================
export interface ConfigTabsProps {
  readonly availableTabs: readonly string[];
  readonly activeTab: string;
  readonly onTabChange: (tab: string) => void;
}

// =============================================================================
// COMPOSANT CONFIG TABS PUR
// =============================================================================
export const ConfigTabs: React.FC<ConfigTabsProps> = React.memo(({
  availableTabs,
  activeTab,
  onTabChange
}) => {
  if (availableTabs.length === 0) return null;

  return (
    <div className="config-tabs">
      {availableTabs.map(tab => (
        <button
          key={tab}
          className={`tab ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
});

ConfigTabs.displayName = 'ConfigTabs';
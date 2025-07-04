// =============================================================================
// CONFIG HEADER - COMPOSANT PUR DÉCOUPLÉ
// =============================================================================
import React from 'react';

// =============================================================================
// INTERFACES PROPS
// =============================================================================
export interface ConfigHeaderProps {
  readonly icon: string;
  readonly label: string;
  readonly elementName?: string;
}

// =============================================================================
// COMPOSANT CONFIG HEADER PUR
// =============================================================================
export const ConfigHeader: React.FC<ConfigHeaderProps> = React.memo(({
  icon,
  label,
  elementName
}) => {
  return (
    <div className="panel-header">
      <div className="header-title">
        <span className="header-icon">{icon}</span>
        <span>{label}</span>
      </div>
      {elementName && (
        <div className="element-name">{elementName}</div>
      )}
    </div>
  );
});

ConfigHeader.displayName = 'ConfigHeader';
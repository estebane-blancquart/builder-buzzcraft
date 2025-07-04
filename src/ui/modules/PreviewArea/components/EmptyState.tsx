// =============================================================================
// EMPTY STATE - COMPOSANT UI ÉTAT VIDE
// =============================================================================
import React from 'react';

// =============================================================================
// TYPES
// =============================================================================
interface EmptyAction {
  readonly label: string;
  readonly variant: 'primary' | 'secondary';
  readonly icon?: string;
  readonly onClick?: () => void;
}

interface EmptyStateProps {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly actions?: EmptyAction[];
}

// =============================================================================
// COMPOSANT EMPTY STATE
// =============================================================================
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actions = []
}) => {
  // =============================================================================
  // RENDER ACTION BUTTON
  // =============================================================================
  const renderAction = (action: EmptyAction, index: number) => {
    const buttonClasses = [
      'btn',
      `btn-${action.variant}`
    ].join(' ');

    return (
      <button
        key={index}
        className={buttonClasses}
        onClick={action.onClick}
      >
        {action.icon && <span>{action.icon}</span>}
        {action.label}
      </button>
    );
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="preview-empty">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      
      {actions.length > 0 && (
        <div className="empty-actions">
          {actions.map(renderAction)}
        </div>
      )}
    </div>
  );
};
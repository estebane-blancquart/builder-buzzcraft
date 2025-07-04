// =============================================================================
// COMPONENT SELECTOR MODAL - SÉLECTION TYPE DE COMPOSANT
// =============================================================================
import React from 'react';
import './Explorer.scss';

// =============================================================================
// INTERFACES
// =============================================================================
interface ComponentType {
  id: string;
  name: string;
  icon: string;
}

interface ComponentSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
  moduleId: string;
}

// =============================================================================
// TYPES DE COMPOSANTS ESSENTIELS
// =============================================================================
const COMPONENT_TYPES: ComponentType[] = [
  {
    id: 'heading',
    name: 'Titre',
    icon: '📝'
  },
  {
    id: 'paragraph',
    name: 'Paragraphe',
    icon: '📄'
  },
  {
    id: 'image',
    name: 'Image',
    icon: '🖼️'
  },
  {
    id: 'button',
    name: 'Bouton',
    icon: '🔘'
  },
  {
    id: 'list',
    name: 'Liste',
    icon: '📋'
  },
  {
    id: 'video',
    name: 'Vidéo',
    icon: '🎬'
  },
  {
    id: 'spacer',
    name: 'Espacement',
    icon: '⬜'
  },
  {
    id: 'quote',
    name: 'Citation',
    icon: '💬'
  }
];

// =============================================================================
// COMPOSANT MODAL
// =============================================================================
export const ComponentSelectorModal: React.FC<ComponentSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect}) => {
  if (!isOpen) return null;

  const handleSelect = (componentType: string) => {
    onSelect(componentType);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="component-selector-modal">
        {/* Header */}
        <div className="modal-header">
          <h3>Ajouter un composant</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          <div className="components-grid">
            {COMPONENT_TYPES.map(component => (
              <button
                key={component.id}
                className="component-item"
                onClick={() => handleSelect(component.id)}
              >
                <span className="component-icon">{component.icon}</span>
                <span className="component-name">{component.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
// =============================================================================
// CONFIG PANEL - COMPOSANT DE CONFIGURATION
// =============================================================================
import React, { useState } from 'react';
import './ConfigPanel.scss';

// =============================================================================
// TYPES
// =============================================================================
interface ConfigSection {
  id: string;
  name: string;
  icon: string;
}

interface ConfigProperty {
  id: string;
  label: string;
  type: 'text' | 'number' | 'color' | 'select' | 'toggle' | 'range';
  value: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
}

// =============================================================================
// DONNÉES TEMPORAIRES
// =============================================================================
const configSections: ConfigSection[] = [
  { id: 'content', name: 'Contenu', icon: '📝' },
  { id: 'style', name: 'Style', icon: '🎨' },
  { id: 'layout', name: 'Disposition', icon: '📐' },
  { id: 'animation', name: 'Animation', icon: '✨' }
];

const mockProperties: Record<string, ConfigProperty[]> = {
  content: [
    {
      id: 'text',
      label: 'Texte',
      type: 'text',
      value: 'Bienvenue sur BuzzCraft'
    },
    {
      id: 'level',
      label: 'Niveau de titre',
      type: 'select',
      value: 1,
      options: [
        { label: 'H1', value: 1 },
        { label: 'H2', value: 2 },
        { label: 'H3', value: 3 },
        { label: 'H4', value: 4 },
        { label: 'H5', value: 5 },
        { label: 'H6', value: 6 }
      ]
    }
  ],
  style: [
    {
      id: 'fontSize',
      label: 'Taille de police',
      type: 'range',
      value: 24,
      min: 12,
      max: 72,
      step: 1
    },
    {
      id: 'color',
      label: 'Couleur',
      type: 'color',
      value: '#2d3748'
    },
    {
      id: 'fontWeight',
      label: 'Graisse',
      type: 'select',
      value: 'normal',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Gras', value: 'bold' },
        { label: 'Extra gras', value: '800' },
        { label: 'Léger', value: '300' }
      ]
    },
    {
      id: 'textAlign',
      label: 'Alignement',
      type: 'select',
      value: 'left',
      options: [
        { label: 'Gauche', value: 'left' },
        { label: 'Centré', value: 'center' },
        { label: 'Droite', value: 'right' },
        { label: 'Justifié', value: 'justify' }
      ]
    }
  ],
  layout: [
    {
      id: 'margin',
      label: 'Marge extérieure',
      type: 'range',
      value: 16,
      min: 0,
      max: 100,
      step: 4
    },
    {
      id: 'padding',
      label: 'Marge intérieure',
      type: 'range',
      value: 12,
      min: 0,
      max: 100,
      step: 4
    },
    {
      id: 'width',
      label: 'Largeur',
      type: 'select',
      value: 'auto',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: '100%', value: '100%' },
        { label: '50%', value: '50%' },
        { label: 'Personnalisée', value: 'custom' }
      ]
    }
  ],
  animation: [
    {
      id: 'enabled',
      label: 'Activer les animations',
      type: 'toggle',
      value: false
    },
    {
      id: 'duration',
      label: 'Durée (ms)',
      type: 'range',
      value: 300,
      min: 100,
      max: 2000,
      step: 100
    },
    {
      id: 'easing',
      label: 'Courbe d\'animation',
      type: 'select',
      value: 'ease',
      options: [
        { label: 'Ease', value: 'ease' },
        { label: 'Linear', value: 'linear' },
        { label: 'Ease In', value: 'ease-in' },
        { label: 'Ease Out', value: 'ease-out' },
        { label: 'Ease In Out', value: 'ease-in-out' }
      ]
    }
  ]
};

// =============================================================================
// COMPOSANT CONFIG PANEL
// =============================================================================
export const ConfigPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('content');
  const [selectedElement] = useState('Titre principal'); // Mock selection
  const [properties, setProperties] = useState(mockProperties);

  // =============================================================================
  // HANDLERS
  // =============================================================================
  const handlePropertyChange = (sectionId: string, propertyId: string, value: any) => {
    setProperties(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] ?? []).map(prop =>
        prop.id === propertyId ? { ...prop, value } : prop
      )
    }));
    console.log(`Propriété ${propertyId} changée:`, value);
  };

  const renderPropertyInput = (section: string, property: ConfigProperty) => {
    const { id, type, value, options, min, max, step } = property;

    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handlePropertyChange(section, id, e.target.value)}
            className="form-input"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handlePropertyChange(section, id, Number(e.target.value))}
            className="form-input"
            min={min}
            max={max}
            step={step}
          />
        );

      case 'color':
        return (
          <div className="color-input-wrapper">
            <input
              type="color"
              value={value}
              onChange={(e) => handlePropertyChange(section, id, e.target.value)}
              className="color-input"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handlePropertyChange(section, id, e.target.value)}
              className="color-text-input"
              placeholder="#000000"
            />
          </div>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handlePropertyChange(section, id, e.target.value)}
            className="form-select"
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'toggle':
        return (
          <label className="toggle-wrapper">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handlePropertyChange(section, id, e.target.checked)}
              className="toggle-input"
            />
            <span className="toggle-slider"></span>
          </label>
        );

      case 'range':
        return (
          <div className="range-input-wrapper">
            <input
              type="range"
              value={value}
              onChange={(e) => handlePropertyChange(section, id, Number(e.target.value))}
              className="range-input"
              min={min}
              max={max}
              step={step}
            />
            <span className="range-value">{value}{id === 'fontSize' ? 'px' : id === 'duration' ? 'ms' : ''}</span>
          </div>
        );

      default:
        return null;
    }
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <div className="config-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="header-title">
          <span className="header-icon">⚙️</span>
          <span>Configuration</span>
        </div>
        {selectedElement && (
          <div className="element-name">{selectedElement}</div>
        )}
      </div>

      {/* Navigation des sections */}
      <div className="config-tabs">
        {configSections.map((section) => (
          <button
            key={section.id}
            className={`tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="tab-icon">{section.icon}</span>
            <span className="tab-name">{section.name}</span>
          </button>
        ))}
      </div>

      {/* Contenu de la section active */}
      <div className="panel-content">
        {selectedElement ? (
          <div className="config-section">
            <div className="section-title">
              {configSections.find(s => s.id === activeSection)?.name}
            </div>
            
            <div className="properties-list">
              {properties[activeSection]?.map((property) => (
                <div key={property.id} className="property-item">
                  <label className="property-label">
                    {property.label}
                  </label>
                  <div className="property-input">
                    {renderPropertyInput(activeSection, property)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <div className="empty-title">Aucune sélection</div>
            <div className="empty-description">
              Sélectionnez un élément dans l'explorer ou la zone de prévisualisation pour voir ses propriétés
            </div>
          </div>
        )}
      </div>

      {/* Actions rapides */}
      {selectedElement && (
        <div className="panel-footer">
          <div className="quick-actions">
            <button className="action-btn duplicate-btn">
              <span>📋</span>
              <span>Dupliquer</span>
            </button>
            <button className="action-btn delete-btn">
              <span>🗑️</span>
              <span>Supprimer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
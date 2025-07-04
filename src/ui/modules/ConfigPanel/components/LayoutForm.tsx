// =============================================================================
// LAYOUT FORM - COMPOSANT PUR
// =============================================================================
import React from 'react';
import type { Component, Module } from '../../../../core/types';

// =============================================================================
// INTERFACES PROPS
// =============================================================================
export interface LayoutFormProps {
  readonly entity: Component | Module | null;
  readonly entityType: 'component' | 'module';
  readonly onUpdateComponent?: (componentId: string, updates: any) => void;
  readonly onUpdateComponentStyle?: (componentId: string, styleUpdates: any) => void;
  readonly onUpdateModuleLayout?: (moduleId: string, layoutUpdates: any) => void;
  readonly onUpdateModuleStyle?: (moduleId: string, styleUpdates: any) => void;
}

// =============================================================================
// COMPOSANT LAYOUT FORM PUR
// =============================================================================
export const LayoutForm: React.FC<LayoutFormProps> = React.memo(({
  entity,
  entityType,
  onUpdateComponent,
  onUpdateComponentStyle,
  onUpdateModuleLayout,
  onUpdateModuleStyle
}) => {
  if (!entity) return null;

  // =============================================================================
  // RENDU FORMULAIRE COMPOSANT
  // =============================================================================
  if (entityType === 'component') {
    const component = entity as Component;
    
    return (
      <div className="config-section">
        <h5 className="section-title">🎯 Placement</h5>
        
        <div className="form-group">
          <label>Largeur (colonnes)</label>
          <select 
            value={component.layout.span} 
            onChange={(e) => onUpdateComponent?.(component.id, { 
              layout: { ...component.layout, span: parseInt(e.target.value) as any }
            })}
          >
            <option value="1">1 colonne</option>
            <option value="2">2 colonnes</option>
            <option value="3">3 colonnes</option>
            <option value="4">4 colonnes</option>
            <option value="5">5 colonnes</option>
            <option value="6">6 colonnes (pleine largeur)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Marges extérieures</label>
          <input 
            type="text" 
            value={component.styles.margin || ''} 
            onChange={(e) => onUpdateComponentStyle?.(component.id, { margin: e.target.value })}
            placeholder="ex: 10px, 1rem, 8px 16px"
          />
        </div>

        <div className="form-group">
          <label>Marges intérieures</label>
          <input 
            type="text" 
            value={component.styles.padding || ''} 
            onChange={(e) => onUpdateComponentStyle?.(component.id, { padding: e.target.value })}
            placeholder="ex: 10px, 1rem, 8px 16px"
          />
        </div>
      </div>
    );
  }

  // =============================================================================
  // RENDU FORMULAIRE MODULE
  // =============================================================================
  if (entityType === 'module') {
    const module = entity as Module;
    
    return (
      <div className="config-section">
        <h5 className="section-title">🎯 Placement</h5>
        
        <div className="form-group">
          <label>Colonnes Desktop</label>
          <select 
            value={module.layout.desktop} 
            onChange={(e) => onUpdateModuleLayout?.(module.id, { desktop: parseInt(e.target.value) as any })}
          >
            <option value="1">1 colonne</option>
            <option value="2">2 colonnes</option>
            <option value="3">3 colonnes</option>
          </select>
        </div>

        <div className="form-group">
          <label>Colonnes Tablet</label>
          <select 
            value={module.layout.tablet} 
            onChange={(e) => onUpdateModuleLayout?.(module.id, { tablet: parseInt(e.target.value) as any })}
          >
            <option value="1">1 colonne</option>
            <option value="2">2 colonnes</option>
          </select>
        </div>

        <div className="form-group">
          <label>Marges extérieures</label>
          <input 
            type="text" 
            value={module.styles.margin || ''} 
            onChange={(e) => onUpdateModuleStyle?.(module.id, { margin: e.target.value })}
            placeholder="ex: 10px, 1rem, 8px 16px"
          />
        </div>

        <div className="form-group">
          <label>Marges intérieures</label>
          <input 
            type="text" 
            value={module.styles.padding || ''} 
            onChange={(e) => onUpdateModuleStyle?.(module.id, { padding: e.target.value })}
            placeholder="ex: 10px, 1rem, 8px 16px"
          />
        </div>
      </div>
    );
  }

  return null;
});

LayoutForm.displayName = 'LayoutForm';
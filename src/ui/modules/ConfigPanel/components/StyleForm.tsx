// =============================================================================
// STYLE FORM - COMPOSANT PUR
// =============================================================================
import React from 'react';
import type { Component, Module } from '../../../../core/types';

// =============================================================================
// INTERFACES PROPS
// =============================================================================
export interface StyleFormProps {
  readonly entity: Component | Module | null;
  readonly entityType: 'component' | 'module';
  readonly onUpdateComponentStyle?: (componentId: string, styleUpdates: any) => void;
  readonly onUpdateModuleStyle?: (moduleId: string, styleUpdates: any) => void;
}

// =============================================================================
// COMPOSANT STYLE FORM PUR
// =============================================================================
export const StyleForm: React.FC<StyleFormProps> = React.memo(({
  entity,
  entityType,
  onUpdateComponentStyle,
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
        <h5 className="section-title">🎨 Style</h5>
        
        <div className="form-group">
          <label>Couleur de fond</label>
          <input 
            type="color" 
            value={component.styles.background || '#ffffff'} 
            onChange={(e) => onUpdateComponentStyle?.(component.id, { background: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Couleur du texte</label>
          <input 
            type="color" 
            value={component.styles.color || '#000000'} 
            onChange={(e) => onUpdateComponentStyle?.(component.id, { color: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Bordures arrondies</label>
          <input 
            type="text" 
            placeholder="ex: 8px, 50%, 4px 8px"
            value={component.styles.borderRadius || ''} 
            onChange={(e) => onUpdateComponentStyle?.(component.id, { borderRadius: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Bordure</label>
          <input 
            type="text" 
            placeholder="ex: 1px solid #ccc"
            value={component.styles.border || ''} 
            onChange={(e) => onUpdateComponentStyle?.(component.id, { border: e.target.value })}
          />
        </div>

        {/* Styles spécifiques au texte */}
        {(component.type === 'title' || component.type === 'text') && (
          <>
            <div className="form-group">
              <label>Taille de police</label>
              <input 
                type="text" 
                placeholder="ex: 16px, 1.2rem, large"
                value={component.styles.fontSize || ''} 
                onChange={(e) => onUpdateComponentStyle?.(component.id, { fontSize: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Poids de police</label>
              <select 
                value={component.styles.fontWeight || 'normal'} 
                onChange={(e) => onUpdateComponentStyle?.(component.id, { fontWeight: e.target.value })}
              >
                <option value="normal">Normal</option>
                <option value="bold">Gras</option>
                <option value="100">Fin (100)</option>
                <option value="300">Léger (300)</option>
                <option value="400">Normal (400)</option>
                <option value="500">Moyen (500)</option>
                <option value="600">Semi-gras (600)</option>
                <option value="700">Gras (700)</option>
                <option value="800">Extra-gras (800)</option>
                <option value="900">Noir (900)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Alignement du texte</label>
              <select 
                value={component.styles.textAlign || 'left'} 
                onChange={(e) => onUpdateComponentStyle?.(component.id, { textAlign: e.target.value })}
              >
                <option value="left">Gauche</option>
                <option value="center">Centré</option>
                <option value="right">Droite</option>
                <option value="justify">Justifié</option>
              </select>
            </div>
          </>
        )}

        {/* Styles spécifiques aux images */}
        {component.type === 'image' && (
          <>
            <div className="form-group">
              <label>Largeur</label>
              <input 
                type="text" 
                placeholder="ex: 100%, 300px, auto"
                value={component.styles.width || ''} 
                onChange={(e) => onUpdateComponentStyle?.(component.id, { width: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Hauteur</label>
              <input 
                type="text" 
                placeholder="ex: auto, 200px, 50vh"
                value={component.styles.height || ''} 
                onChange={(e) => onUpdateComponentStyle?.(component.id, { height: e.target.value })}
              />
            </div>
          </>
        )}
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
        <h5 className="section-title">🎨 Style</h5>
        
        <div className="form-group">
          <label>Couleur de fond</label>
          <input 
            type="color" 
            value={module.styles.background || '#ffffff'} 
            onChange={(e) => onUpdateModuleStyle?.(module.id, { background: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Couleur du texte</label>
          <input 
            type="color" 
            value={module.styles.color || '#000000'} 
            onChange={(e) => onUpdateModuleStyle?.(module.id, { color: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Bordures arrondies</label>
          <input 
            type="text" 
            placeholder="ex: 8px, 50%, 4px 8px"
            value={module.styles.borderRadius || ''} 
            onChange={(e) => onUpdateModuleStyle?.(module.id, { borderRadius: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Bordure</label>
          <input 
            type="text" 
            placeholder="ex: 1px solid #ccc"
            value={module.styles.border || ''} 
            onChange={(e) => onUpdateModuleStyle?.(module.id, { border: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Largeur maximale</label>
          <input 
            type="text" 
            placeholder="ex: 1200px, 100%, none"
            value={module.styles.maxWidth || ''} 
            onChange={(e) => onUpdateModuleStyle?.(module.id, { maxWidth: e.target.value })}
          />
        </div>
      </div>
    );
  }

  return null;
});

StyleForm.displayName = 'StyleForm';
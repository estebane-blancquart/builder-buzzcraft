// =============================================================================
// CONTENT FORM - COMPOSANT PUR
// =============================================================================
import React from 'react';
import type { Component } from '../../../../core/types';

// =============================================================================
// INTERFACES PROPS
// =============================================================================
export interface ContentFormProps {
  readonly component: Component | null;
  readonly onUpdateComponentProps: (componentId: string, propUpdates: any) => void;
  readonly onUpdateComponentStyle: (componentId: string, styleUpdates: any) => void;
}

// =============================================================================
// COMPOSANT CONTENT FORM PUR
// =============================================================================
export const ContentForm: React.FC<ContentFormProps> = React.memo(({
  component,
  onUpdateComponentProps,
  onUpdateComponentStyle
}) => {
  if (!component) return null;

  // =============================================================================
  // FORMULAIRES PAR TYPE DE COMPOSANT
  // =============================================================================
  const renderFormByType = () => {
    switch (component.type) {
      case 'title':
        return (
          <>
            <div className="form-group">
              <label>Texte</label>
              <input 
                type="text" 
                value={(component.props as any).text || ''} 
                onChange={(e) => onUpdateComponentProps(component.id, { text: e.target.value })}
                placeholder="Titre du composant"
              />
            </div>
            
            <div className="form-group">
              <label>Niveau de titre</label>
              <select 
                value={(component.props as any).level || 2} 
                onChange={(e) => onUpdateComponentProps(component.id, { level: parseInt(e.target.value) })}
              >
                <option value="1">H1 (Plus grand)</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
                <option value="4">H4</option>
                <option value="5">H5</option>
                <option value="6">H6 (Plus petit)</option>
              </select>
            </div>
          </>
        );

      case 'text':
        return (
          <div className="form-group">
            <label>Contenu</label>
            <textarea 
              rows={4}
              value={(component.props as any).text || ''} 
              onChange={(e) => onUpdateComponentProps(component.id, { text: e.target.value })}
              placeholder="Contenu du paragraphe..."
            />
          </div>
        );

      case 'image':
        return (
          <>
            <div className="form-group">
              <label>URL de l'image</label>
              <input 
                type="url" 
                value={(component.props as any).src || ''} 
                onChange={(e) => onUpdateComponentProps(component.id, { src: e.target.value })}
                placeholder="https://exemple.com/image.jpg"
              />
            </div>
            <div className="form-group">
              <label>Texte alternatif</label>
              <input 
                type="text" 
                value={(component.props as any).alt || ''} 
                onChange={(e) => onUpdateComponentProps(component.id, { alt: e.target.value })}
                placeholder="Description de l'image pour l'accessibilité"
              />
            </div>
            <div className="form-group">
              <label>Lien (optionnel)</label>
              <input 
                type="url" 
                value={(component.props as any).href || ''} 
                onChange={(e) => onUpdateComponentProps(component.id, { href: e.target.value })}
                placeholder="https://exemple.com (optionnel)"
              />
            </div>
          </>
        );

      case 'button':
        return (
          <>
            <div className="form-group">
              <label>Texte du bouton</label>
              <input 
                type="text" 
                value={(component.props as any).text || ''} 
                onChange={(e) => onUpdateComponentProps(component.id, { text: e.target.value })}
                placeholder="Cliquez ici"
              />
            </div>
            <div className="form-group">
              <label>Style</label>
              <select 
                value={(component.props as any).variant || 'primary'} 
                onChange={(e) => onUpdateComponentProps(component.id, { variant: e.target.value })}
              >
                <option value="primary">Principal</option>
                <option value="secondary">Secondaire</option>
                <option value="outline">Contour</option>
                <option value="ghost">Fantôme</option>
              </select>
            </div>
            <div className="form-group">
              <label>Taille</label>
              <select 
                value={(component.props as any).size || 'md'} 
                onChange={(e) => onUpdateComponentProps(component.id, { size: e.target.value })}
              >
                <option value="sm">Petit</option>
                <option value="md">Moyen</option>
                <option value="lg">Grand</option>
              </select>
            </div>
            <div className="form-group">
              <label>Lien</label>
              <input 
                type="url" 
                value={(component.props as any).href || ''} 
                onChange={(e) => onUpdateComponentProps(component.id, { href: e.target.value })}
                placeholder="https://exemple.com"
              />
            </div>
            <div className="form-group">
              <label>Action</label>
              <select 
                value={(component.props as any).action || 'none'} 
                onChange={(e) => onUpdateComponentProps(component.id, { action: e.target.value })}
              >
                <option value="none">Aucune</option>
                <option value="scroll">Défilement</option>
                <option value="modal">Ouvrir modal</option>
                <option value="external">Lien externe</option>
              </select>
            </div>
          </>
        );

      case 'list':
        return (
          <>
            <div className="form-group">
              <label>Éléments de liste</label>
              <textarea 
                rows={4}
                value={((component.props as any).items || []).join('\n')} 
                onChange={(e) => onUpdateComponentProps(component.id, { 
                  items: e.target.value.split('\n').filter(item => item.trim()) 
                })}
                placeholder="Un élément par ligne..."
              />
            </div>
            <div className="form-group">
              <label>Style de liste</label>
              <select 
                value={(component.props as any).listStyle || 'bulleted'} 
                onChange={(e) => onUpdateComponentProps(component.id, { listStyle: e.target.value })}
              >
                <option value="bulleted">Puces</option>
                <option value="numbered">Numérotée</option>
                <option value="none">Sans style</option>
              </select>
            </div>
          </>
        );

      case 'video':
        return (
          <>
            <div className="form-group">
              <label>URL de la vidéo</label>
              <input 
                type="url" 
                value={(component.props as any).src || ''} 
                onChange={(e) => onUpdateComponentProps(component.id, { src: e.target.value })}
                placeholder="https://exemple.com/video.mp4"
              />
            </div>
            <div className="form-group">
              <label>Image de prévisualisation</label>
              <input 
                type="url" 
                value={(component.props as any).poster || ''} 
                onChange={(e) => onUpdateComponentProps(component.id, { poster: e.target.value })}
                placeholder="https://exemple.com/preview.jpg"
              />
            </div>
            <div className="form-group">
              <label>Options</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={(component.props as any).controls || false} 
                    onChange={(e) => onUpdateComponentProps(component.id, { controls: e.target.checked })}
                  />
                  Afficher les contrôles
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={(component.props as any).autoplay || false} 
                    onChange={(e) => onUpdateComponentProps(component.id, { autoplay: e.target.checked })}
                  />
                  Lecture automatique
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={(component.props as any).loop || false} 
                    onChange={(e) => onUpdateComponentProps(component.id, { loop: e.target.checked })}
                  />
                  Lecture en boucle
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={(component.props as any).muted || false} 
                    onChange={(e) => onUpdateComponentProps(component.id, { muted: e.target.checked })}
                  />
                  Son coupé
                </label>
              </div>
            </div>
          </>
        );

      case 'spacer':
        return (
          <div className="form-group">
            <label>Hauteur de l'espacement</label>
            <input 
              type="text" 
              value={component.styles.height || '20px'} 
              onChange={(e) => onUpdateComponentStyle(component.id, { height: e.target.value })}
              placeholder="ex: 20px, 2rem, 50px"
            />
          </div>
        );

      case 'icon':
        return (
          <>
            <div className="form-group">
              <label>Nom de l'icône</label>
              <input 
                type="text" 
                value={(component.props as any).iconName || ''} 
                onChange={(e) => onUpdateComponentProps(component.id, { iconName: e.target.value })}
                placeholder="ex: star, heart, arrow-right"
              />
            </div>
            <div className="form-group">
              <label>Taille</label>
              <input 
                type="text" 
                value={component.styles.fontSize || '24px'} 
                onChange={(e) => onUpdateComponentStyle(component.id, { fontSize: e.target.value })}
                placeholder="ex: 24px, 2rem, large"
              />
            </div>
          </>
        );

      default:
        return (
          <div className="form-group">
            <p className="no-config">Configuration non disponible pour ce type de composant.</p>
          </div>
        );
    }
  };

  // =============================================================================
  // RENDER PRINCIPAL
  // =============================================================================
  return (
    <div className="config-section">
      <h5 className="section-title">📝 Contenu</h5>
      {renderFormByType()}
    </div>
  );
});

ContentForm.displayName = 'ContentForm';
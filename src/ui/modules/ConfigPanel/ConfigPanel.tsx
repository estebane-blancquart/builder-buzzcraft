// =============================================================================
// CONFIG PANEL - CONFIGURATION ÉLÉMENTS
// =============================================================================
import React from 'react';
import { useBuilder } from '../../../core/context/BuilderContext';
import { componentActions, moduleActions } from '../../../core/store/actions';
import './ConfigPanel.scss';

// =============================================================================
// TYPES POUR LA DÉTECTION DE SÉLECTION
// =============================================================================
type SelectionType = 'none' | 'page' | 'module' | 'component';

interface SelectionInfo {
  type: SelectionType;
  label: string;
  icon: string;
  elementName: string;
  availableTabs: string[];
}

// =============================================================================
// COMPOSANT CONFIG PANEL
// =============================================================================
export const ConfigPanel: React.FC = () => {
  const { state, dispatch } = useBuilder();
  
  // =============================================================================
  // DÉTECTION INTELLIGENTE DE SÉLECTION
  // =============================================================================
  const getSelectionInfo = (): SelectionInfo => {
    const { pageId, moduleId, componentId } = state.ui.selection;
    
    // Aucune sélection
    if (!pageId) {
      return {
        type: 'none',
        label: 'Aucune sélection',
        icon: '🎯',
        elementName: '',
        availableTabs: []
      };
    }
    
    // Composant sélectionné
    if (componentId) {
      const component = state.entities.components[componentId];
      if (component) {
        return {
          type: 'component',
          label: 'Composant',
          icon: '📝',
          elementName: component.name,
          availableTabs: ['Layout', 'Style', 'Contenu']
        };
      }
    }
    
    // Module sélectionné
    if (moduleId) {
      const module = state.entities.modules[moduleId];
      if (module) {
        return {
          type: 'module',
          label: 'Module',
          icon: '📋',
          elementName: module.name,
          availableTabs: ['Layout', 'Style']
        };
      }
    }
    
    // Page sélectionnée
    const page = state.entities.pages[pageId];
    if (page) {
      return {
        type: 'page',
        label: 'Page',
        icon: '📄',
        elementName: page.name,
        availableTabs: ['Layout']
      };
    }
    
    // Fallback
    return {
      type: 'none',
      label: 'Élément introuvable',
      icon: '❌',
      elementName: '',
      availableTabs: []
    };
  };

  // =============================================================================
  // ÉTAT LOCAL POUR LES ONGLETS
  // =============================================================================
  const [activeTab, setActiveTab] = React.useState<string>('Layout');
  const selectionInfo = getSelectionInfo();
  
  // Reset de l'onglet actif quand la sélection change
  React.useEffect(() => {
    if (selectionInfo.availableTabs.length > 0) {
      setActiveTab(selectionInfo.availableTabs[0]!);
    }
  }, [selectionInfo.type, selectionInfo.elementName]);

  // =============================================================================
  // RENDU DES DÉTAILS DE SÉLECTION
  // =============================================================================

  // =============================================================================
  // RENDU DES ONGLETS DYNAMIQUES
  // =============================================================================
  const renderTabs = () => {
    if (selectionInfo.availableTabs.length === 0) return null;
    
    return (
      <div className="config-tabs">
        {selectionInfo.availableTabs.map(tab => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
    );
  };

  // =============================================================================
  // RENDU DU CONTENU SELON L'ONGLET
  // =============================================================================
  const renderTabContent = () => {
    if (selectionInfo.type === 'none') return null;
    
    const { pageId, moduleId, componentId } = state.ui.selection;
    
    switch (activeTab) {
      case 'Layout':
        return renderLayoutForm(selectionInfo.type, { pageId, moduleId, componentId });
        
      case 'Style':
        return renderStyleForm(selectionInfo.type, { pageId, moduleId, componentId });
        
      case 'Contenu':
        return renderContentForm(componentId);
        
      default:
        return null;
    }
  };

  // =============================================================================
  // FORMULAIRES LAYOUT
  // =============================================================================
  const renderLayoutForm = (type: SelectionType, selection: any) => {
    if (type === 'component') {
      const component = selection.componentId ? state.entities.components[selection.componentId] : null;
      if (!component) return null;

      return (
        <div className="config-section">
          <h5>🎯 Placement</h5>
          
          <div className="form-group">
            <label>Largeur (colonnes)</label>
            <select 
              value={component.span} 
              onChange={(e) => updateComponent(component.id, { span: parseInt(e.target.value) })}
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
              onChange={(e) => updateComponentStyle(component.id, { margin: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Marges intérieures</label>
            <input 
              type="text" 
              value={component.styles.padding || ''} 
              onChange={(e) => updateComponentStyle(component.id, { padding: e.target.value })}
            />
          </div>
        </div>
      );
    }

    if (type === 'module') {
      const module = selection.moduleId ? state.entities.modules[selection.moduleId] : null;
      if (!module) return null;

      return (
        <div className="config-section">
          <h5>🎯 Placement</h5>
          
          <div className="form-group">
            <label>Colonnes Desktop</label>
            <select 
              value={module.layout.desktop} 
              onChange={(e) => updateModuleLayout(module.id, { desktop: parseInt(e.target.value) })}
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
              onChange={(e) => updateModuleLayout(module.id, { tablet: parseInt(e.target.value) })}
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
              onChange={(e) => updateModuleStyle(module.id, { margin: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Marges intérieures</label>
            <input 
              type="text" 
              value={module.styles.padding || ''} 
              onChange={(e) => updateModuleStyle(module.id, { padding: e.target.value })}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="config-section">
        <h5>🎯 Placement</h5>
        
        <div className="form-group">
          <label>Colonnes Desktop</label>
          <select>
            <option value="1">1 colonne</option>
            <option value="2">2 colonnes</option>
            <option value="3">3 colonnes</option>
          </select>
        </div>

        <div className="form-group">
          <label>Colonnes Tablet</label>
          <select>
            <option value="1">1 colonne</option>
            <option value="2">2 colonnes</option>
          </select>
        </div>

        <div className="form-group">
          <label>Colonnes Mobile</label>
          <select>
            <option value="1">1 colonne</option>
          </select>
        </div>
      </div>
    );
  };

  // =============================================================================
  // FORMULAIRES STYLE
  // =============================================================================
  const renderStyleForm = (type: SelectionType, selection: any) => {
    if (type === 'component') {
      const component = selection.componentId ? state.entities.components[selection.componentId] : null;
      if (!component) return null;

      return (
        <div className="config-section">
          <h5>🎨 Style</h5>
          
          <div className="form-group">
            <label>Couleur de fond</label>
            <input 
              type="color" 
              value={component.styles.background || '#ffffff'} 
              onChange={(e) => updateComponentStyle(component.id, { background: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Couleur du texte</label>
            <input 
              type="color" 
              value={component.styles.color || '#000000'} 
              onChange={(e) => updateComponentStyle(component.id, { color: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Bordures arrondies</label>
            <input 
              type="text" 
              placeholder="ex: 8px, 50%, 4px 8px"
              value={component.styles.borderRadius || ''} 
              onChange={(e) => updateComponentStyle(component.id, { borderRadius: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Bordure</label>
            <input 
              type="text" 
              placeholder="ex: 1px solid #ccc"
              value={component.styles.border || ''} 
              onChange={(e) => updateComponentStyle(component.id, { border: e.target.value })}
            />
          </div>

          {(component.type === 'title' || component.type === 'text') && (
            <>
              <div className="form-group">
                <label>Taille de police</label>
                <input 
                  type="text" 
                  value={component.styles.fontSize || ''} 
                  onChange={(e) => updateComponentStyle(component.id, { fontSize: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Alignement du texte</label>
                <select 
                  value={component.styles.textAlign || 'left'} 
                  onChange={(e) => updateComponentStyle(component.id, { textAlign: e.target.value as any })}
                >
                  <option value="left">Gauche</option>
                  <option value="center">Centré</option>
                  <option value="right">Droite</option>
                  <option value="justify">Justifié</option>
                </select>
              </div>
            </>
          )}
        </div>
      );
    }

    if (type === 'module') {
      const module = selection.moduleId ? state.entities.modules[selection.moduleId] : null;
      if (!module) return null;

      return (
        <div className="config-section">
          <h5>🎨 Style</h5>
          
          <div className="form-group">
            <label>Couleur de fond</label>
            <input 
              type="color" 
              value={module.styles.background || '#ffffff'} 
              onChange={(e) => updateModuleStyle(module.id, { background: e.target.value })}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="config-section">
        <h5>🎨 Style</h5>
      </div>
    );
  };

  // =============================================================================
  // FORMULAIRES CONTENU
  // =============================================================================
  const renderContentForm = (componentId: string | null) => {
    if (!componentId) return null;
    
    const component = state.entities.components[componentId];
    if (!component) return null;

    return (
      <div className="config-section">
        <h5>📝 Contenu</h5>
        {renderComponentPropsForm(component)}
      </div>
    );
  };

  const renderComponentPropsForm = (component: any) => {
    switch (component.type) {
      case 'title':
        return (
          <>
            <div className="form-group">
              <label>Texte</label>
              <input 
                type="text" 
                value={component.props.text || ''} 
                onChange={(e) => updateComponentProps(component.id, { text: e.target.value })}
              />
            </div>
          </>
        );

      case 'text':
        return (
          <div className="form-group">
            <label>Contenu</label>
            <textarea 
              rows={4}
              value={component.props.text || ''} 
              onChange={(e) => updateComponentProps(component.id, { text: e.target.value })}
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
                value={component.props.src || ''} 
                onChange={(e) => updateComponentProps(component.id, { src: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Texte alternatif</label>
              <input 
                type="text" 
                value={component.props.alt || ''} 
                onChange={(e) => updateComponentProps(component.id, { alt: e.target.value })}
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
                value={component.props.text || ''} 
                onChange={(e) => updateComponentProps(component.id, { text: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Style</label>
              <select 
                value={component.props.variant || 'primary'} 
                onChange={(e) => updateComponentProps(component.id, { variant: e.target.value })}
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
                value={component.props.size || 'md'} 
                onChange={(e) => updateComponentProps(component.id, { size: e.target.value })}
              >
                <option value="sm">Petit</option>
                <option value="md">Moyen</option>
                <option value="lg">Grand</option>
              </select>
            </div>
            <div className="form-group">
              <label>Lien (optionnel)</label>
              <input 
                type="url" 
                value={component.props.href || ''} 
                onChange={(e) => updateComponentProps(component.id, { href: e.target.value })}
              />
            </div>
          </>
        );

      case 'spacer':
        return (
          <div className="form-group">
            <label>Hauteur</label>
            <input 
              type="text" 
              value={component.props.height || ''} 
              onChange={(e) => updateComponentProps(component.id, { height: e.target.value })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // =============================================================================
  // FONCTIONS DE MISE À JOUR
  // =============================================================================
  const updateComponent = (id: string, updates: any) => {
    dispatch(componentActions.update(id, updates));
  };

  const updateComponentStyle = (id: string, styleUpdates: any) => {
    const component = state.entities.components[id];
    if (!component) return;

    dispatch(componentActions.update(id, {
      styles: {
        ...component.styles,
        ...styleUpdates
      }
    }));
  };

  const updateComponentProps = (id: string, propUpdates: any) => {
    const component = state.entities.components[id];
    if (!component) return;

    dispatch(componentActions.update(id, {
      props: {
        ...component.props,
        ...propUpdates
      }
    }));
  };

  const updateModuleLayout = (id: string, layoutUpdates: any) => {
    const module = state.entities.modules[id];
    if (!module) return;

    dispatch(moduleActions.update(id, {
      layout: {
        ...module.layout,
        ...layoutUpdates
      }
    }));
  };

  const updateModuleStyle = (id: string, styleUpdates: any) => {
    const module = state.entities.modules[id];
    if (!module) return;

    dispatch(moduleActions.update(id, {
      styles: {
        ...module.styles,
        ...styleUpdates
      }
    }));
  };

  // =============================================================================
  // RENDU PRINCIPAL
  // =============================================================================
  return (
    <aside className="config-panel">
      <div className="panel-content">
        <h3>
          <span className="panel-icon">⚙️</span>
          Configuration
        </h3>

        {/* État sans sélection */}
        {selectionInfo.type === 'none' && (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h4>Aucune sélection</h4>
            <p>Sélectionnez un élément pour le configurer</p>
          </div>
        )}

        {/* Avec sélection - Interface dynamique */}
        {selectionInfo.type !== 'none' && (
          <div className="config-content">
            {renderTabs()}
            
            <div className="config-form">
              {renderTabContent()}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
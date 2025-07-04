// =============================================================================
// PREVIEW AREA - COMPOSANT DE PRÉVISUALISATION
// =============================================================================
import React, { useState } from 'react';
import './PreviewArea.scss';

// =============================================================================
// TYPES
// =============================================================================
type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  icon: string;
}

// =============================================================================
// CONFIGURATION DES DEVICES
// =============================================================================
const deviceConfigs: Record<DeviceType, DeviceConfig> = {
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    icon: '📱'
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: '📱'
  },
  desktop: {
    name: 'Desktop',
    width: 1200,
    height: 800,
    icon: '🖥️'
  }
};

// =============================================================================
// COMPOSANT PREVIEW AREA
// =============================================================================
export const PreviewArea: React.FC = () => {
  const [activeDevice] = useState<DeviceType>('desktop');
  const [zoom] = useState(1);

  const getZoomClass = () => {
    const zoomPercentage = Math.round(zoom * 100);
    return `zoom-${zoomPercentage}`;
  };

  const currentDevice = deviceConfigs[activeDevice];

  // =============================================================================
  // CONTENU TEMPORAIRE DE PREVIEW
  // =============================================================================
  const renderPreviewContent = () => {
    return (
      <div className="preview-page">
        {/* Hero Section */}
        <section className="hero-section" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '80px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            Bienvenue sur BuzzCraft
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
            Créez des sites web magnifiques sans code
          </p>
          <button style={{
            background: 'white',
            color: '#667eea',
            padding: '12px 30px',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            Commencer maintenant
          </button>
        </section>

        {/* Features Section */}
        <section className="features-section" style={{ 
          padding: '60px 20px',
          background: '#f8fafc'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ 
              textAlign: 'center', 
              fontSize: '2.5rem', 
              marginBottom: '3rem',
              color: '#2d3748'
            }}>
              Fonctionnalités
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: activeDevice === 'mobile' ? '1fr' : 
                                  activeDevice === 'tablet' ? 'repeat(2, 1fr)' : 
                                  'repeat(3, 1fr)',
              gap: '2rem'
            }}>
              {[
                { icon: '🎨', title: 'Design Intuitif', desc: 'Interface drag & drop simple' },
                { icon: '📱', title: 'Responsive', desc: 'Adapté à tous les écrans' },
                { icon: '⚡', title: 'Performance', desc: 'Sites ultra-rapides' },
                { icon: '🛠️', title: 'Personnalisable', desc: 'Contrôle total du design' },
                { icon: '🚀', title: 'Export Facile', desc: 'Code propre généré' },
                { icon: '💡', title: 'Templates', desc: 'Bibliothèque de modèles' }
              ].map((feature, index) => (
                <div key={index} style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    marginBottom: '0.5rem',
                    color: '#2d3748'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#718096', lineHeight: '1.6' }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section" style={{ 
          padding: '80px 20px',
          background: '#2d3748',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Prêt à commencer ?
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.8 }}>
            Rejoignez des milliers d'utilisateurs qui créent avec BuzzCraft
          </p>
          <button style={{
            background: '#667eea',
            color: 'white',
            padding: '15px 40px',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            Essayer gratuitement
          </button>
        </section>
      </div>
    );
  };

  // =============================================================================
  // RENDER PRINCIPAL
  // =============================================================================
  return (
    <div className="preview-area">
      {/* Toolbar */}
      <div className="preview-toolbar">
        <div className="device-indicator">
          <span className="device-icon">{currentDevice.icon}</span>
          <span className="device-name">{currentDevice.name}</span>
          <span className="device-dimensions">
            {currentDevice.width} × {currentDevice.height}
          </span>
        </div>
        
        <div className="zoom-info">
          <span>Zoom: </span>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Viewport */}
      <div className={`preview-viewport`}>
        <div 
          className={`preview-frame device-${activeDevice} ${getZoomClass()}`}
          style={{
            width: currentDevice.width,
            height: currentDevice.height,
            transform: `scale(${zoom})`
          }}
        >
          <div className="preview-content">
            {renderPreviewContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
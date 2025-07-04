// =============================================================================
// COMPONENT FACTORY - VERSION FINALE AVEC OVERRIDE CSS
// =============================================================================
import React, { JSX } from 'react';
import { Component, TitleProps, TextProps, ImageProps, ButtonProps, ListProps, VideoProps } from '../../../../core/types';

// =============================================================================
// INTERFACE
// =============================================================================
interface ComponentFactoryProps {
  component: Component;
}

// =============================================================================
// COMPONENT FACTORY
// =============================================================================
export const ComponentFactory: React.FC<ComponentFactoryProps> = ({ component }) => {
  
  // Construire les styles inline depuis les propriétés du composant
  const dynamicStyles: React.CSSProperties = {
    margin: component.styles.margin || undefined,
    padding: component.styles.padding || undefined,
    backgroundColor: component.styles.background || undefined,
    color: component.styles.color || undefined,
    border: component.styles.border || undefined,
    borderRadius: component.styles.borderRadius || undefined,
    fontSize: component.styles.fontSize || undefined,
    fontWeight: component.styles.fontWeight || undefined,
    textAlign: component.styles.textAlign as any || undefined,
    width: component.styles.width || undefined,
    height: component.styles.height || undefined,
    maxWidth: component.styles.maxWidth || undefined,
  };
  
  // Rendu selon le type de composant
  switch (component.type) {
    case 'title': {
      const props = component.props as TitleProps;
      const HeadingTag = `h${props.level || 2}` as keyof JSX.IntrinsicElements;
      
      return (
        <HeadingTag 
          className={`title-component level-${props.level || 2} dynamic-styles`}
          style={dynamicStyles}
        >
          {props.text || 'Titre'}
        </HeadingTag>
      );
    }
    
    case 'text': {
      const props = component.props as TextProps;
      
      return (
        <p 
          className="text-component dynamic-styles"
          style={dynamicStyles}
        >
          {props.text || 'Texte'}
        </p>
      );
    }
    
    case 'image': {
      const props = component.props as ImageProps;
      
      return (
        <div 
          className="image-component dynamic-styles"
          style={dynamicStyles}
        >
          {props.src ? (
            <img 
              src={props.src} 
              alt={props.alt || 'Image'}
            />
          ) : (
            <div className="image-placeholder">
              🖼️ {props.alt || 'Image'}
            </div>
          )}
        </div>
      );
    }
    
    case 'button': {
      const props = component.props as ButtonProps;
      
      return (
        <button 
          className={`button-component ${props.variant || 'primary'} ${props.size || 'md'} dynamic-styles`}
          style={dynamicStyles}
          onClick={() => {
            if (props.href) {
              window.open(props.href, '_blank');
            }
          }}
        >
          {props.text || 'Bouton'}
        </button>
      );
    }
    
    case 'list': {
      const props = component.props as ListProps;
      
      return (
        <div 
          className="list-component dynamic-styles"
          style={dynamicStyles}
        >
          {props.listStyle === 'numbered' ? (
            <ol>
              {(props.items || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          ) : props.listStyle === 'none' ? (
            <div>
              {(props.items || []).map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          ) : (
            <ul>
              {(props.items || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    
    case 'video': {
      const props = component.props as VideoProps;
      
      return (
        <div 
          className="video-component dynamic-styles"
          style={dynamicStyles}
        >
          {props.src ? (
            <video 
              controls={props.controls} 
              autoPlay={props.autoplay}
              loop={props.loop}
              muted={props.muted}
              poster={props.poster}
            >
              <source src={props.src} />
              Votre navigateur ne supporte pas la vidéo.
            </video>
          ) : (
            <div className="video-placeholder">
              🎬 Vidéo
            </div>
          )}
        </div>
      );
    }
    
    case 'spacer': {
      return (
        <div 
          className="spacer-component dynamic-styles" 
          style={{ 
            height: component.styles.height || '40px',
            ...dynamicStyles
          }}
        />
      );
    }
    
    default:
      return (
        <div 
          className="component-unknown dynamic-styles"
          style={dynamicStyles}
        >
          ⚠️ Composant inconnu: {component.type}
        </div>
      );
  }
};
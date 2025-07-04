// =============================================================================
// CORE TYPES - ENTITÉS DU BUILDER (ENHANCED)
// =============================================================================

// Types de devices supportés
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Types de composants disponibles dans la library
export type ComponentType = 
  | 'title' 
  | 'text' 
  | 'image' 
  | 'button' 
  | 'icon' 
  | 'spacer' 
  | 'list' 
  | 'video';

// Types de modules prédéfinis
export type ModuleType = 
  | 'section'   // Section générique
  | 'hero'      // Hero banner
  | 'features'  // Section features
  | 'gallery'   // Galerie images
  | 'contact'   // Section contact
  | 'footer';   // Footer

// =============================================================================
// ENTITÉ PAGE
// =============================================================================

export interface Page {
  readonly id: string;
  name: string;
  slug: string;
  title?: string;
  description?: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}

// =============================================================================
// ENTITÉ MODULE
// =============================================================================

export interface Module {
  readonly id: string;
  name: string;
  type: ModuleType;
  
  // Layout responsive (simplifié et cohérent)
  layout: ModuleLayout;
  
  // Styles du module (centralisé dans ComponentStyles)
  styles: ComponentStyles;
  
  // Position dans la page
  position: number;
  
  // Métadonnées
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface ModuleLayout {
  desktop: 1 | 2 | 3;    // Typage strict pour éviter les erreurs
  tablet: 1 | 2;        // Maximum 2 colonnes sur tablet
  mobile: 1;             // Toujours 1 colonne sur mobile
}

// =============================================================================
// ENTITÉ COMPONENT
// =============================================================================

export interface Component<T extends ComponentType = ComponentType> {
  span: string | number | readonly string[] | undefined;
  readonly id: string;
  name: string;
  type: T;
  
  // Props spécifiques au type (discriminated union)
  props: ComponentPropsMap[T];
  
  // Styles centralisés (plus de doublons)
  styles: ComponentStyles;
  
  // Layout/Position (déplacé dans styles pour cohérence)
  layout: ComponentLayout;
  
  // Métadonnées
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface ComponentLayout {
  span: 1 | 2 | 3 | 4 | 5 | 6;  // Nombre de colonnes occupées
  position: number;              // Position dans le module
}

// =============================================================================
// PROPS DES COMPOSANTS (DISCRIMINATED UNION)
// =============================================================================

// Map pour typage strict par type de composant
export interface ComponentPropsMap {
  title: TitleProps;
  text: TextProps;
  image: ImageProps;
  button: ButtonProps;
  icon: IconProps;
  spacer: SpacerProps;
  list: ListProps;
  video: VideoProps;
}

// Union type discriminée (meilleur IntelliSense)
export type ComponentProps = ComponentPropsMap[ComponentType];

// Props spécifiques pour chaque type (SANS doublons avec styles)
export interface TitleProps {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;    // h1, h2, h3...
  // fontSize, color, align déplacés dans ComponentStyles
}

export interface TextProps {
  text: string;
  // fontSize, color, align, lineHeight déplacés dans ComponentStyles
}

export interface ImageProps {
  src: string;
  alt: string;
  // width, height, objectFit, borderRadius déplacés dans ComponentStyles
}

export interface ButtonProps {
  text: string;
  variant: ButtonVariant;
  size: ButtonSize;
  href?: string;           // Lien externe
  action?: ButtonAction;   // Action custom (mieux typé que string)
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonAction = 'none' | 'scroll' | 'modal' | 'external';

export interface IconProps {
  iconName: string;
  // size, color déplacés dans ComponentStyles
}

export interface SpacerProps {
  // height déplacé dans ComponentStyles (height property)
}

export interface ListProps {
  items: readonly string[];  // readonly pour immutabilité
  listStyle: ListStyle;
  // spacing déplacé dans ComponentStyles
}

export type ListStyle = 'bulleted' | 'numbered' | 'none';

export interface VideoProps {
  src: string;
  poster?: string;
  controls: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

// =============================================================================
// STYLES CENTRALISÉS (PLUS DE DOUBLONS)
// =============================================================================

export interface ComponentStyles {
  // Espacement
  margin?: CSSValue;
  padding?: CSSValue;
  
  // Layout (centralisé)
  width?: CSSValue;
  height?: CSSValue;
  maxWidth?: CSSValue;
  maxHeight?: CSSValue;
  
  // Couleurs
  background?: CSSColor;
  color?: CSSColor;
  
  // Bordures
  border?: CSSValue;
  borderRadius?: CSSValue;
  borderWidth?: CSSValue;
  borderColor?: CSSColor;
  
  // Typographie
  fontFamily?: string;
  fontSize?: CSSValue;
  fontWeight?: CSSFontWeight;
  lineHeight?: CSSValue;
  textAlign?: TextAlign;
  
  // Responsive (styles par device) - optionnel pour simplicité
  responsive?: ResponsiveStyles;
}

// Types stricts pour CSS
export type CSSValue = string;  // '10px' | '1rem' | '100%' | 'auto' etc.
export type CSSColor = string; // '#fff' | 'red' | 'rgb(255,0,0)' etc.
export type CSSFontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface ResponsiveStyles {
  mobile?: Partial<ComponentStyles>;
  tablet?: Partial<ComponentStyles>;
  desktop?: Partial<ComponentStyles>;
}

// =============================================================================
// INTERFACES DE CRÉATION (SIMPLIFIÉES)
// =============================================================================

export interface CreatePageData {
  name: string;
  slug?: string;        // Auto-généré si non fourni
  title?: string;
  description?: string;
}

export interface CreateModuleData {
  name: string;
  type: ModuleType;
  layout?: Partial<ModuleLayout>;  // Valeurs par défaut si non fourni
  styles?: Partial<ComponentStyles>;
}

export interface CreateComponentData<T extends ComponentType = ComponentType> {
  name: string;
  type: T;
  props?: Partial<ComponentPropsMap[T]>;  // Props par défaut selon type
  styles?: Partial<ComponentStyles>;
  layout?: Partial<ComponentLayout>;
}

// =============================================================================
// FACTORY HELPERS (ENHANCED AVEC VALIDATION)
// =============================================================================

// Configuration des defaults par type
const DEFAULT_PROPS: ComponentPropsMap = {
  title: { text: 'Nouveau titre', level: 2 },
  text: { text: 'Nouveau texte' },
  image: { src: 'https://picsum.photos/400/300', alt: 'Image' },
  button: { text: 'Bouton', variant: 'primary', size: 'md' },
  icon: { iconName: 'star' },
  spacer: {},
  list: { items: ['Item 1', 'Item 2'], listStyle: 'bulleted' },
  video: { src: '', controls: true }
} as const;

const DEFAULT_STYLES: ComponentStyles = {
  margin: '0',
  padding: '0',
  fontSize: '16px',
  color: 'inherit',
} as const;

const DEFAULT_LAYOUT: ComponentLayout = {
  span: 1,
  position: 0,
} as const;

// =============================================================================
// FACTORY FUNCTIONS (TYPE-SAFE & VALIDATED)
// =============================================================================

// Helper pour créer un composant avec des valeurs par défaut (ENHANCED)
export function createComponent<T extends ComponentType>(
  type: T,
  data: Omit<CreateComponentData<T>, 'type'>
): Omit<Component<T>, 'id' | 'createdAt' | 'updatedAt'> {
  
  // Validation du type
  if (!isValidComponentType(type)) {
    throw new Error(`Type de composant invalide: ${type}`);
  }
  
  // Validation du nom
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('Le nom du composant est requis');
  }
  
  if (data.name.length > 100) {
    throw new Error('Le nom du composant ne peut pas dépasser 100 caractères');
  }
  
  return {
    name: data.name.trim(),
    type,
    props: createDefaultProps(type, data.props) as ComponentPropsMap[T],
    styles: {
      ...DEFAULT_STYLES,
      ...data.styles,
    },
    layout: {
      ...DEFAULT_LAYOUT,
      ...data.layout,
    },
    span: undefined,
  };
}

// Helper pour créer un module avec validation
export function createModule(data: CreateModuleData): Omit<Module, 'id' | 'createdAt' | 'updatedAt'> {
  // Validation du type
  if (!isValidModuleType(data.type)) {
    throw new Error(`Type de module invalide: ${data.type}`);
  }
  
  // Validation du nom
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('Le nom du module est requis');
  }
  
  return {
    name: data.name.trim(),
    type: data.type,
    layout: createDefaultModuleLayout(data.layout),
    styles: {
      ...DEFAULT_STYLES,
      ...data.styles,
    },
    position: 0,
  };
}

// Helper pour créer une page avec validation
export function createPage(data: CreatePageData): Omit<Page, 'id' | 'createdAt' | 'updatedAt'> {
  // Validation du nom
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('Le nom de la page est requis');
  }
  
  // Génération du slug si non fourni
  const slug = data.slug || createSlugFromName(data.name);
  
  // Validation du slug
  if (!isValidSlug(slug)) {
    throw new Error(`Slug invalide: ${slug}`);
  }
  
  return {
    name: data.name.trim(),
    slug,
    ...(data.title?.trim() && { title: data.title.trim() }),
    ...(data.description?.trim() && { description: data.description.trim() }),
  };
}

// =============================================================================
// HELPERS PRIVÉS (ENHANCED)
// =============================================================================

function createDefaultProps<T extends ComponentType>(
  type: T,
  customProps?: Partial<ComponentPropsMap[T]>
): ComponentPropsMap[T] {
  const defaults = DEFAULT_PROPS[type];
  
  if (!customProps) {
    return defaults;
  }
  
  // Merge intelligent avec validation
  return {
    ...defaults,
    ...customProps,
  } as ComponentPropsMap[T];
}

function createDefaultModuleLayout(customLayout?: Partial<ModuleLayout>): ModuleLayout {
  const defaults: ModuleLayout = {
    desktop: 3,
    tablet: 2,
    mobile: 1,
  };
  
  if (!customLayout) {
    return defaults;
  }
  
  // Validation des contraintes
  const layout = { ...defaults, ...customLayout };
  
  if (layout.desktop < 1 || layout.desktop > 3) {
    throw new Error('Layout desktop doit être entre 1 et 3 colonnes');
  }
  
  if (layout.tablet < 1 || layout.tablet > 2) {
    throw new Error('Layout tablet doit être entre 1 et 2 colonnes');
  }
  
  if (layout.mobile !== 1) {
    throw new Error('Layout mobile doit être 1 colonne');
  }
  
  return layout;
}

function createSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer accents
    .replace(/[^a-z0-9\s-]/g, '') // Garder que lettres, chiffres, espaces, tirets
    .replace(/\s+/g, '-') // Espaces → tirets
    .replace(/-+/g, '-') // Tirets multiples → simple
    .replace(/^-|-$/g, ''); // Supprimer tirets début/fin
}

// =============================================================================
// VALIDATORS (TYPE GUARDS)
// =============================================================================

export function isValidComponentType(type: string): type is ComponentType {
  const validTypes: ComponentType[] = ['title', 'text', 'image', 'button', 'icon', 'spacer', 'list', 'video'];
  return validTypes.includes(type as ComponentType);
}

export function isValidModuleType(type: string): type is ModuleType {
  const validTypes: ModuleType[] = ['section', 'hero', 'features', 'gallery', 'contact', 'footer'];
  return validTypes.includes(type as ModuleType);
}

export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  
  // Regex pour slug valide: commence/finit par lettre/chiffre, peut contenir tirets
  const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  return slugRegex.test(slug) && slug.length <= 50;
}

export function isValidLayoutSpan(span: number): span is ComponentLayout['span'] {
  return Number.isInteger(span) && span >= 1 && span <= 6;
}

// =============================================================================
// COMPONENT FACTORIES PAR TYPE (CONVENIENCE)
// =============================================================================

export const componentFactories = {
  createTitle: (name: string, text?: string, level?: TitleProps['level']) => 
    createComponent('title', {
      name,
      props: { text: text || 'Nouveau titre', level: level || 2 }
    }),
  
  createText: (name: string, text?: string) =>
    createComponent('text', {
      name,
      props: { text: text || 'Nouveau texte' }
    }),
  
  createImage: (name: string, src?: string, alt?: string) =>
    createComponent('image', {
      name,
      props: { 
        src: src || 'https://picsum.photos/400/300', 
        alt: alt || 'Image' 
      }
    }),
  
  createButton: (name: string, text?: string, variant?: ButtonVariant) =>
    createComponent('button', {
      name,
      props: { 
        text: text || 'Bouton', 
        variant: variant || 'primary',
        size: 'md'
      }
    }),
  
  createSpacer: (name: string, height?: string) =>
    createComponent('spacer', {
      name,
      styles: { height: height || '20px' }
    }),
} as const;

// =============================================================================
// CLONING HELPERS (POUR DUPLICATION)
// =============================================================================

export function cloneComponent<T extends ComponentType>(
  component: Component<T>,
  overrides?: Partial<Omit<Component<T>, 'id' | 'createdAt' | 'updatedAt'>>
): Omit<Component<T>, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: `${component.name} (copie)`,
    type: component.type,
    props: { ...component.props },
    styles: { ...component.styles },
    layout: { ...component.layout },
    span: component.span,
    ...overrides,
  };
}

export function cloneModule(
  module: Module,
  overrides?: Partial<Omit<Module, 'id' | 'createdAt' | 'updatedAt'>>
): Omit<Module, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: `${module.name} (copie)`,
    type: module.type,
    layout: { ...module.layout },
    styles: { ...module.styles },
    position: module.position,
    ...overrides,
  };
}
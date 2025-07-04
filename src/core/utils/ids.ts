// =============================================================================
// UTILS - GÉNÉRATION D'IDS PURE ET TESTABLE
// =============================================================================

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface IdGenerator {
  generateTimestamp(): number;
  generateRandom(): string;
}

export interface IdConfig {
  timestampBase?: number;    // Base pour timestamp (36 par défaut)
  randomLength?: number;     // Longueur partie random (6 par défaut)
  separator?: string;        // Séparateur (underscore par défaut)
}

export type EntityPrefix = 'page' | 'module' | 'component' | 'notif';

// =============================================================================
// ID GENERATOR (INJECTABLE POUR TESTS)
// =============================================================================

export class DefaultIdGenerator implements IdGenerator {
  generateTimestamp(): number {
    return Date.now();
  }
  
  generateRandom(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}

// =============================================================================
// GÉNÉRATEUR D'ID PRINCIPAL (PUR)
// =============================================================================

const defaultConfig: Required<IdConfig> = {
  timestampBase: 36,
  randomLength: 6,
  separator: '_',
};

export function createId(
  prefix: string,
  generator: IdGenerator = new DefaultIdGenerator(),
  config: IdConfig = {}
): string {
  const cfg = { ...defaultConfig, ...config };
  
  const timestamp = generator.generateTimestamp().toString(cfg.timestampBase);
  const random = generator.generateRandom().substring(0, cfg.randomLength);
  
  return [prefix, timestamp, random].join(cfg.separator);
}

// =============================================================================
// GÉNÉRATEURS SPÉCIALISÉS (TYPE-SAFE)
// =============================================================================

export const createPageId = (generator?: IdGenerator): string => 
  createId('page', generator);

export const createModuleId = (generator?: IdGenerator): string => 
  createId('module', generator);

export const createComponentId = (generator?: IdGenerator): string => 
  createId('component', generator);

export const createNotificationId = (generator?: IdGenerator): string => 
  createId('notif', generator);

// Factory pour tous les types
export const createEntityId = (type: EntityPrefix, generator?: IdGenerator): string => {
  const creators = {
    page: createPageId,
    module: createModuleId,
    component: createComponentId,
    notif: createNotificationId,
  } as const;
  
  return creators[type](generator);
};

// =============================================================================
// PARSEURS D'ID (PURS ET SAFE)
// =============================================================================

export interface ParsedId {
  readonly prefix: string;
  readonly timestamp: number;
  readonly random: string;
  readonly raw: string;
}

export function parseId(id: string, config: IdConfig = {}): ParsedId | null {
  const cfg = { ...defaultConfig, ...config };
  const parts = id.split(cfg.separator);
  
  if (parts.length !== 3) return null;
  
  const [prefix, timestampStr, random] = parts;
  
  if (!prefix || !timestampStr || !random) return null;
  
  try {
    const timestamp = parseInt(timestampStr, cfg.timestampBase);
    if (isNaN(timestamp)) return null;
    
    return {
      prefix,
      timestamp,
      random,
      raw: id,
    };
  } catch {
    return null;
  }
}

// =============================================================================
// VALIDATEURS (PURS)
// =============================================================================

export function isValidId(id: string, config?: IdConfig): boolean {
  return parseId(id, config) !== null;
}

export function isEntityId(id: string, entityType: EntityPrefix): boolean {
  const parsed = parseId(id);
  return parsed?.prefix === entityType;
}

export function validateIdFormat(id: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!id) {
    errors.push('ID cannot be empty');
    return { isValid: false, errors };
  }
  
  if (typeof id !== 'string') {
    errors.push('ID must be a string');
    return { isValid: false, errors };
  }
  
  const parsed = parseId(id);
  if (!parsed) {
    errors.push('Invalid ID format. Expected: prefix_timestamp_random');
    return { isValid: false, errors };
  }
  
  if (parsed.prefix.length === 0) {
    errors.push('Prefix cannot be empty');
  }
  
  if (parsed.random.length < 4) {
    errors.push('Random part too short (minimum 4 characters)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// =============================================================================
// EXTRACTEURS (PURS ET SAFE)
// =============================================================================

export function extractPrefix(id: string): string | null {
  return parseId(id)?.prefix || null;
}

export function extractTimestamp(id: string): number | null {
  return parseId(id)?.timestamp || null;
}

export function extractCreationDate(id: string): Date | null {
  const timestamp = extractTimestamp(id);
  return timestamp ? new Date(timestamp) : null;
}

export function extractRandom(id: string): string | null {
  return parseId(id)?.random || null;
}

// =============================================================================
// SLUG GENERATOR (PUR ET ROBUSTE)
// =============================================================================

export interface SlugConfig {
  maxLength?: number;
  allowNumbers?: boolean;
  customReplacements?: Record<string, string>;
}

const defaultSlugConfig: Required<SlugConfig> = {
  maxLength: 50,
  allowNumbers: true,
  customReplacements: {},
};

export function createSlug(input: string, config: SlugConfig = {}): string {
  const cfg = { ...defaultSlugConfig, ...config };
  
  if (!input || typeof input !== 'string') return '';
  
  let slug = input.toLowerCase().trim();
  
  // Appliquer les remplacements personnalisés
  Object.entries(cfg.customReplacements).forEach(([from, to]) => {
    slug = slug.replace(new RegExp(from, 'g'), to);
  });
  
  // Normaliser les caractères accentués
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Construire la regex selon la config
  const allowedChars = cfg.allowNumbers ? 'a-z0-9' : 'a-z';
  const regex = new RegExp(`[^${allowedChars}\\s-]`, 'g');
  
  slug = slug
    .replace(regex, '') // Supprimer caractères non autorisés
    .replace(/\s+/g, '-') // Espaces → tirets
    .replace(/-+/g, '-') // Tirets multiples → tiret simple
    .replace(/^-|-$/g, ''); // Supprimer tirets début/fin
  
  // Appliquer la limite de longueur
  if (slug.length > cfg.maxLength) {
    slug = slug.substring(0, cfg.maxLength).replace(/-[^-]*$/, '');
  }
  
  return slug || 'unnamed'; // Fallback si slug vide
}

export function createUniqueSlug(
  input: string, 
  existingSlugs: readonly string[], 
  config?: SlugConfig
): string {
  const baseSlug = createSlug(input, config);
  
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  // Générer variants avec suffix numérique
  let counter = 1;
  let candidateSlug: string;
  
  do {
    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  } while (existingSlugs.includes(candidateSlug) && counter < 1000);
  
  return candidateSlug;
}

// =============================================================================
// VALIDATEURS DE SLUG (PURS)
// =============================================================================

export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  
  // Regex stricte pour slugs valides
  const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  
  return slugRegex.test(slug) && 
         !slug.includes('--') && 
         slug.length <= 50 &&
         slug.length >= 1;
}

export function validateSlug(slug: string): {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
} {
  const errors: string[] = [];
  const suggestions: string[] = [];
  
  if (!slug) {
    errors.push('Slug cannot be empty');
    suggestions.push('Use createSlug() to generate from a name');
    return { isValid: false, errors, suggestions };
  }
  
  if (slug !== slug.toLowerCase()) {
    errors.push('Slug must be lowercase');
    suggestions.push(`Try: "${slug.toLowerCase()}"`);
  }
  
  if (slug.includes(' ')) {
    errors.push('Slug cannot contain spaces');
    suggestions.push(`Try: "${slug.replace(/\s+/g, '-')}"`);
  }
  
  if (slug.includes('--')) {
    errors.push('Slug cannot contain consecutive dashes');
    suggestions.push(`Try: "${slug.replace(/-+/g, '-')}"`);
  }
  
  if (slug.startsWith('-') || slug.endsWith('-')) {
    errors.push('Slug cannot start or end with dash');
    suggestions.push(`Try: "${slug.replace(/^-|-$/g, '')}"`);
  }
  
  if (slug.length > 50) {
    errors.push('Slug too long (max 50 characters)');
    suggestions.push(`Try: "${slug.substring(0, 47)}..."`);
  }
  
  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('Slug contains invalid characters');
    suggestions.push('Use only lowercase letters, numbers, and dashes');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    suggestions,
  };
}

// =============================================================================
// NAME GENERATORS (PURS ET CONFIGURABLES)
// =============================================================================

export interface NameGeneratorConfig {
  templates?: Record<string, string>;
  maxAttempts?: number;
}

const defaultNameConfig: Required<NameGeneratorConfig> = {
  templates: {
    page: 'Nouvelle page',
    module: 'Nouveau module',
    component: 'Nouveau composant',
  },
  maxAttempts: 1000,
};

export function createUniqueName(
  template: string,
  existingNames: readonly string[],
  config: NameGeneratorConfig = {}
): string {
  const cfg = { ...defaultNameConfig, ...config };
  
  if (!existingNames.includes(template)) {
    return template;
  }
  
  for (let i = 1; i <= cfg.maxAttempts; i++) {
    const candidate = `${template} ${i}`;
    if (!existingNames.includes(candidate)) {
      return candidate;
    }
  }
  
  // Fallback si toutes les tentatives échouent
  return `${template} ${Date.now()}`;
}

// Factory pour noms par type d'entité
export function createEntityName(
  entityType: EntityPrefix,
  existingNames: readonly string[],
  config?: NameGeneratorConfig
): string {
  const cfg = { ...defaultNameConfig, ...config };
  const template = cfg.templates[entityType] || `Nouveau ${entityType}`;
  
  return createUniqueName(template, existingNames, config);
}

// =============================================================================
// UTILS DE COMPARAISON ET TRI
// =============================================================================

export function compareIds(a: string, b: string): number {
  const timestampA = extractTimestamp(a) || 0;
  const timestampB = extractTimestamp(b) || 0;
  
  return timestampA - timestampB;
}

export function sortIdsByCreation(ids: readonly string[]): string[] {
  return [...ids].sort(compareIds);
}

export function groupIdsByPrefix(ids: readonly string[]): Record<string, string[]> {
  return ids.reduce((acc, id) => {
    const prefix = extractPrefix(id);
    if (prefix) {
      if (!acc[prefix]) acc[prefix] = [];
      acc[prefix].push(id);
    }
    return acc;
  }, {} as Record<string, string[]>);
}
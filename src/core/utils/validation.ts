// =============================================================================
// UTILS - VALIDATION COMPOSABLE ET EXTENSIBLE
// =============================================================================

import type { 
  Page, 
  Module, 
  Component, 
  ComponentType, 
  CreatePageData,
  CreateModuleData
} from '../types';

// =============================================================================
// TYPES DE BASE (AMÉLIORÉS)
// =============================================================================

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly context?: Record<string, unknown> | undefined;
}

export interface ValidationRule<T> {
  readonly name: string;
  readonly validator: (value: T, context?: unknown) => ValidationResult;
  readonly required?: boolean;
  readonly async?: boolean;
}

export type Validator<T> = (value: T, context?: unknown) => ValidationResult;

export interface ValidationSchema<T> {
  readonly rules: readonly ValidationRule<T>[];
  readonly stopOnFirstError?: boolean;
}

// =============================================================================
// VALIDATION RESULT BUILDERS (IMMUTABLES)
// =============================================================================

export const ValidationResult = {
  success: (context?: Record<string, unknown> | undefined): ValidationResult => ({
    isValid: true,
    errors: [],
    warnings: [],
    ...(context && { context }),
  }),
  
  error: (error: string, context?: Record<string, unknown> | undefined): ValidationResult => ({
    isValid: false,
    errors: [error],
    warnings: [],
    ...(context && { context }),
  }),
  
  warning: (warning: string, context?: Record<string, unknown> | undefined): ValidationResult => ({
    isValid: true,
    errors: [],
    warnings: [warning],
    ...(context && { context }),
  }),
  
  errors: (errors: readonly string[], context?: Record<string, unknown> | undefined): ValidationResult => ({
    isValid: false,
    errors: [...errors],
    warnings: [],
    ...(context && { context }),
  }),
  
  combine: (...results: readonly ValidationResult[]): ValidationResult => {
    const allErrors = results.flatMap(r => r.errors);
    const allWarnings = results.flatMap(r => r.warnings);
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      context: results.reduce((acc, r) => ({ ...acc, ...r.context }), {}),
    };
  },
} as const;

// =============================================================================
// VALIDATEURS PRIMITIFS (PURS ET COMPOSABLES)
// =============================================================================

export const Validators = {
  // String validators
  required: (message = 'Field is required'): Validator<string | undefined | null> => 
    (value) => value?.trim() 
      ? ValidationResult.success()
      : ValidationResult.error(message),
  
  minLength: (min: number, message?: string): Validator<string> =>
    (value) => value.length >= min
      ? ValidationResult.success()
      : ValidationResult.error(message || `Minimum ${min} characters required`),
  
  maxLength: (max: number, message?: string): Validator<string> =>
    (value) => value.length <= max
      ? ValidationResult.success()
      : ValidationResult.error(message || `Maximum ${max} characters allowed`),
  
  pattern: (regex: RegExp, message?: string): Validator<string> =>
    (value) => regex.test(value)
      ? ValidationResult.success()
      : ValidationResult.error(message || 'Invalid format'),
  
  // Number validators
  min: (minimum: number, message?: string): Validator<number> =>
    (value) => value >= minimum
      ? ValidationResult.success()
      : ValidationResult.error(message || `Minimum value is ${minimum}`),
  
  max: (maximum: number, message?: string): Validator<number> =>
    (value) => value <= maximum
      ? ValidationResult.success()
      : ValidationResult.error(message || `Maximum value is ${maximum}`),
  
  range: (min: number, max: number, message?: string): Validator<number> =>
    (value) => value >= min && value <= max
      ? ValidationResult.success()
      : ValidationResult.error(message || `Value must be between ${min} and ${max}`),
  
  // Array validators
  notEmpty: <T>(message?: string): Validator<readonly T[]> =>
    (value) => value.length > 0
      ? ValidationResult.success()
      : ValidationResult.error(message || 'Array cannot be empty'),
  
  maxItems: <T>(max: number, message?: string): Validator<readonly T[]> =>
    (value) => value.length <= max
      ? ValidationResult.success()
      : ValidationResult.error(message || `Maximum ${max} items allowed`),
  
  // URL validators
  url: (message?: string): Validator<string> =>
    (value) => {
      try {
        new URL(value);
        return ValidationResult.success();
      } catch {
        return ValidationResult.error(message || 'Invalid URL format');
      }
    },
  
  // Custom validators
  oneOf: <T>(validValues: readonly T[], message?: string): Validator<T> =>
    (value) => validValues.includes(value)
      ? ValidationResult.success()
      : ValidationResult.error(message || `Value must be one of: ${validValues.join(', ')}`),
  
  // Conditional validators
  when: <T>(
    condition: (value: T) => boolean,
    validator: Validator<T>
  ): Validator<T> =>
    (value, context) => condition(value) 
      ? validator(value, context)
      : ValidationResult.success(),
} as const;

// =============================================================================
// COMPOSITION UTILITIES
// =============================================================================

export function composeValidators<T>(...validators: readonly Validator<T>[]): Validator<T> {
  return (value, context) => {
    const results = validators.map(validator => validator(value, context));
    return ValidationResult.combine(...results);
  };
}

export function createValidator<T>(schema: ValidationSchema<T>): Validator<T> {
  return (value, context) => {
    const results: ValidationResult[] = [];
    
    for (const rule of schema.rules) {
      const result = rule.validator(value, context);
      results.push(result);
      
      if (schema.stopOnFirstError && !result.isValid) {
        break;
      }
    }
    
    return ValidationResult.combine(...results);
  };
}

// =============================================================================
// BUSINESS VALIDATORS (SPÉCIALISÉS)
// =============================================================================

// Slug validator (robuste)
export const validateSlug = composeValidators(
  Validators.required('Slug is required'),
  Validators.pattern(
    /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
    'Slug must contain only lowercase letters, numbers, and dashes'
  ),
  Validators.maxLength(50, 'Slug must be 50 characters or less'),
  (value: string) => value.includes('--')
    ? ValidationResult.error('Slug cannot contain consecutive dashes')
    : ValidationResult.success()
);

// Entity name validator
export const validateEntityName = composeValidators(
  Validators.required('Name is required'),
  Validators.minLength(1, 'Name cannot be empty'),
  Validators.maxLength(100, 'Name must be 100 characters or less')
);

// Layout validators
export const validateModuleLayout = createValidator<{ desktop: number; tablet: number; mobile: number }>({
  rules: [
    {
      name: 'desktop-columns',
      validator: (layout) => Validators.range(1, 3, 'Desktop layout must be 1-3 columns')(layout.desktop),
    },
    {
      name: 'tablet-columns', 
      validator: (layout) => Validators.range(1, 2, 'Tablet layout must be 1-2 columns')(layout.tablet),
    },
    {
      name: 'mobile-columns',
      validator: (layout) => layout.mobile === 1
        ? ValidationResult.success()
        : ValidationResult.error('Mobile layout must be 1 column'),
    },
  ],
});

// Media URL validators
export const validateImageUrl = composeValidators(
  Validators.required('Image URL is required'),
  Validators.url('Invalid image URL'),
  (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const knownDomains = ['picsum.photos', 'unsplash.com', 'images.unsplash.com'];
    
    const hasValidExtension = imageExtensions.some(ext => url.toLowerCase().includes(ext));
    const hasKnownDomain = knownDomains.some(domain => url.includes(domain));
    
    if (hasValidExtension || hasKnownDomain) {
      return ValidationResult.success();
    }
    
    return ValidationResult.warning('URL might not be a valid image');
  }
);

export const validateVideoUrl = composeValidators(
  Validators.required('Video URL is required'),
  Validators.url('Invalid video URL'),
  (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    const videoPlatforms = ['youtube.com', 'youtu.be', 'vimeo.com'];
    
    const hasValidExtension = videoExtensions.some(ext => url.toLowerCase().includes(ext));
    const hasKnownPlatform = videoPlatforms.some(platform => url.includes(platform));
    
    if (hasValidExtension || hasKnownPlatform) {
      return ValidationResult.success();
    }
    
    return ValidationResult.warning('URL might not be a valid video');
  }
);

// =============================================================================
// ENTITY VALIDATORS (COMPOSÉS)
// =============================================================================

// Page validation
export const validatePage = createValidator<Partial<Page>>({
  rules: [
    {
      name: 'name',
      validator: (page) => page.name ? validateEntityName(page.name) : ValidationResult.success(),
    },
    {
      name: 'slug',
      validator: (page) => page.slug ? validateSlug(page.slug) : ValidationResult.success(),
    },
    {
      name: 'title-seo',
      validator: (page) => page.title && page.title.length > 60
        ? ValidationResult.warning('Title exceeds 60 characters (not SEO optimal)')
        : ValidationResult.success(),
    },
    {
      name: 'description-seo',
      validator: (page) => page.description && page.description.length > 160
        ? ValidationResult.warning('Description exceeds 160 characters (not SEO optimal)')
        : ValidationResult.success(),
    },
  ],
});

export const validateCreatePageData = createValidator<CreatePageData>({
  rules: [
    {
      name: 'name',
      validator: (data) => validateEntityName(data.name),
      required: true,
    },
    {
      name: 'slug',
      validator: (data) => data.slug ? validateSlug(data.slug) : ValidationResult.success(),
    },
  ],
});

// Module validation
export const validateModule = createValidator<Partial<Module>>({
  rules: [
    {
      name: 'name',
      validator: (module) => module.name ? validateEntityName(module.name) : ValidationResult.success(),
    },
    {
      name: 'type',
      validator: (module) => module.type
        ? Validators.oneOf(['section', 'hero', 'features', 'gallery', 'contact', 'footer'] as const)(module.type)
        : ValidationResult.success(),
    },
    {
      name: 'layout',
      validator: (module) => module.layout ? validateModuleLayout(module.layout) : ValidationResult.success(),
    },
    {
      name: 'position',
      validator: (module) => module.position !== undefined
        ? Validators.min(0, 'Position must be positive')(module.position)
        : ValidationResult.success(),
    },
  ],
});

export const validateCreateModuleData = createValidator<CreateModuleData>({
  rules: [
    {
      name: 'name',
      validator: (data) => validateEntityName(data.name),
      required: true,
    },
    {
      name: 'type',
      validator: (data) => Validators.oneOf(['section', 'hero', 'features', 'gallery', 'contact', 'footer'] as const)(data.type),
      required: true,
    },
  ],
});

// Component validation
export const validateComponent = createValidator<Partial<Component>>({
  rules: [
    {
      name: 'name',
      validator: (component) => component.name ? validateEntityName(component.name) : ValidationResult.success(),
    },
    {
      name: 'type',
      validator: (component) => component.type
        ? Validators.oneOf(['title', 'text', 'image', 'button', 'icon', 'spacer', 'list', 'video'] as const)(component.type)
        : ValidationResult.success(),
    },
    {
      name: 'layout-span',
      validator: (component) => component.layout?.span
        ? Validators.range(1, 6, 'Span must be between 1 and 6')(component.layout.span)
        : ValidationResult.success(),
    },
    {
      name: 'props',
      validator: (component) => component.type && component.props
        ? validateComponentProps(component.type, component.props)
        : ValidationResult.success(),
    },
  ],
});

// Component props validation (type-specific)
export function validateComponentProps(type: ComponentType, props: unknown): ValidationResult {
  const propValidators: Record<ComponentType, Validator<unknown>> = {
    title: (props: any) => composeValidators(
      Validators.required('Title text is required'),
      Validators.maxLength(200, 'Title should be under 200 characters for readability')
    )(props?.text),
    
    text: (props: any) => composeValidators(
      Validators.required('Text content is required'),
      (text: string) => text.length > 5000
        ? ValidationResult.warning('Very long text, consider splitting')
        : ValidationResult.success()
    )(props?.text),
    
    image: (props: any) => ValidationResult.combine(
      validateImageUrl(props?.src || ''),
      props?.alt ? ValidationResult.success() : ValidationResult.warning('Alt text improves accessibility')
    ),
    
    button: (props: any) => ValidationResult.combine(
      Validators.required('Button text is required')(props?.text),
      Validators.maxLength(50, 'Button text should be concise')(props?.text || ''),
      props?.variant ? ValidationResult.success() : ValidationResult.warning('No button style defined')
    ),
    
    spacer: () => ValidationResult.success(), // Spacer n'a pas de props requises
    
    list: (props: any) => composeValidators(
      Validators.notEmpty('List must contain at least one item'),
      Validators.maxItems(20, 'Very long list, consider splitting')
    )(props?.items || []),
    
    video: (props: any) => validateVideoUrl(props?.src || ''),
    
    icon: (props: any) => Validators.required('Icon name is required')(props?.iconName),
  };
  
  return propValidators[type]?.(props) || ValidationResult.success();
}

// =============================================================================
// PROJECT CONSISTENCY VALIDATION
// =============================================================================

export interface ProjectData {
  readonly pages: readonly Page[];
  readonly modules: readonly Module[];
  readonly components: readonly Component[];
  readonly relations: {
    readonly pageModules: Record<string, readonly string[]>;
    readonly moduleComponents: Record<string, readonly string[]>;
  };
}

export function validateProjectConsistency(project: ProjectData): ValidationResult {
  const results: ValidationResult[] = [];
  
  // Create sets for O(1) lookups
  const pageIds = new Set(project.pages.map(p => p.id));
  const moduleIds = new Set(project.modules.map(m => m.id));
  const componentIds = new Set(project.components.map(c => c.id));
  
  // Validate page-module relations
  Object.entries(project.relations.pageModules).forEach(([pageId, moduleIdList]) => {
    if (!pageIds.has(pageId)) {
      results.push(ValidationResult.error(`Orphaned relation: page ${pageId} not found`));
    }
    
    moduleIdList.forEach(moduleId => {
      if (!moduleIds.has(moduleId)) {
        results.push(ValidationResult.error(`Orphaned relation: module ${moduleId} not found`));
      }
    });
  });
  
  // Validate module-component relations
  Object.entries(project.relations.moduleComponents).forEach(([moduleId, componentIdList]) => {
    if (!moduleIds.has(moduleId)) {
      results.push(ValidationResult.error(`Orphaned relation: module ${moduleId} not found`));
    }
    
    componentIdList.forEach(componentId => {
      if (!componentIds.has(componentId)) {
        results.push(ValidationResult.error(`Orphaned relation: component ${componentId} not found`));
      }
    });
  });
  
  // Validate unique slugs
  const slugs = project.pages.map(p => p.slug);
  const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  if (duplicateSlugs.length > 0) {
    results.push(ValidationResult.error(`Duplicate slugs found: ${duplicateSlugs.join(', ')}`));
  }
  
  // Project health warnings
  if (project.pages.length === 0) {
    results.push(ValidationResult.warning('No pages created'));
  } else if (project.modules.length === 0) {
    results.push(ValidationResult.warning('No modules created'));
  } else if (project.components.length === 0) {
    results.push(ValidationResult.warning('No components created'));
  }
  
  return ValidationResult.combine(...results);
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

export function isValidationError(result: ValidationResult): boolean {
  return !result.isValid;
}

export function hasWarnings(result: ValidationResult): boolean {
  return result.warnings.length > 0;
}

export function getFirstError(result: ValidationResult): string | null {
  return result.errors[0] || null;
}

export function getAllIssues(result: ValidationResult): readonly string[] {
  return [...result.errors, ...result.warnings];
}

// =============================================================================
// VALIDATION PRESETS (POUR USAGE COMMUN)
// =============================================================================

export const ValidationPresets = {
  strictPage: validateCreatePageData,
  strictModule: validateCreateModuleData,
  strictComponent: validateComponent,
  projectHealth: validateProjectConsistency,
} as const;
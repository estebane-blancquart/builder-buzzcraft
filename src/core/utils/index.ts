// =============================================================================
// UTILS - EXPORTS CENTRALISÉS (FIXED)
// =============================================================================
// Exports des utilitaires d'IDs (noms corrigés selon ids.ts)
export {
  // Générateurs d'ID principaux
  createId,
  createPageId,
  createModuleId,
  createComponentId,
  createNotificationId,
  createEntityId,
 
  // Parseurs et validateurs d'ID
  parseId,
  isValidId,
  isEntityId,
  validateIdFormat,
 
  // Extracteurs
  extractPrefix,
  extractTimestamp,
  extractCreationDate,
  extractRandom,
 
  // Générateurs de slug
  createSlug,
  createUniqueSlug,
  isValidSlug,
  validateSlug as validateSlugFormat,
 
  // Générateurs de noms
  createUniqueName,
  createEntityName,
 
  // Utilitaires de comparaison
  compareIds,
  sortIdsByCreation,
  groupIdsByPrefix,
 
  // Types et interfaces
  type IdGenerator,
  type IdConfig,
  type EntityPrefix,
  type ParsedId,
  type SlugConfig,
  type NameGeneratorConfig,
  DefaultIdGenerator,
} from './ids';

// =============================================================================
// ALIAS POUR COMPATIBILITÉ (ANCIENS NOMS)
// =============================================================================
export { createComponentId as generateComponentId } from './ids';
export { createPageId as generatePageId } from './ids';
export { createModuleId as generateModuleId } from './ids';

// =============================================================================
// FONCTION MANQUANTE - GÉNÉRATION NOMS COMPOSANTS
// =============================================================================
export function generateDefaultComponentName(type: string, existingNames: string[]): string {
  const baseName = `Nouveau ${type}`;
  if (!existingNames.includes(baseName)) {
    return baseName;
  }
  
  let counter = 1;
  let newName = `${baseName} ${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName} ${counter}`;
  }
  return newName;
}

// =============================================================================
// AUTRES FONCTIONS MANQUANTES
// =============================================================================
export function generateDefaultModuleName(existingNames: string[]): string {
  return generateDefaultComponentName('module', existingNames);
}

export function generateDefaultPageName(existingNames: string[]): string {
  return generateDefaultComponentName('page', existingNames);
}

// Exports des utilitaires de validation
export type {
  ValidationResult,
  ValidationRule,
  Validator,
  ValidationSchema,
} from './validation';
export {
  // Builders de résultats
  ValidationResult as ValidationResultBuilders,
 
  // Validateurs primitifs
  Validators,
 
  // Composition
  composeValidators,
  createValidator,
 
  // Validateurs business
  validateSlug as validateSlugComposed,
  validateEntityName,
  validateModuleLayout,
  validateImageUrl,
  validateVideoUrl,
 
  // Validateurs d'entités
  validatePage,
  validateCreatePageData,
  validateModule,
  validateCreateModuleData,
  validateComponent,
  validateComponentProps,
  validateProjectConsistency,
 
  // Utilitaires
  isValidationError,
  hasWarnings,
  getFirstError,
  getAllIssues,
  ValidationPresets,
} from './validation';
// =============================================================================
// HOOK - ÉDITION INLINE RÉUTILISABLE (ENHANCED)
// =============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';

// =============================================================================
// TYPES (ENHANCED)
// =============================================================================

export interface UseInlineEditProps {
  initialValue: string;
  onSave: (newValue: string) => void;
  onCancel?: () => void;
  validator?: (value: string) => string | null; // Retourne erreur ou null
  placeholder?: string;
  maxLength?: number;
  trim?: boolean;
  selectAllOnFocus?: boolean;
  saveOnBlur?: boolean;
  disabled?: boolean;
}

export interface UseInlineEditReturn {
  // État
  isEditing: boolean;
  editValue: string;
  error: string | null;
  hasChanges: boolean;
  
  // Props pour input
  inputProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder: string | undefined;
    maxLength: number | undefined;
    autoFocus: boolean;
    disabled: boolean;
    ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  };
  
  // Actions
  actions: {
    startEdit: () => void;
    stopEdit: () => void;
    save: () => boolean; // Retourne true si sauvegarde réussie
    cancel: () => void;
    reset: () => void;
  };
  
  // Helpers
  helpers: {
    canSave: boolean;
    isEmpty: boolean;
    isValid: boolean;
  };
}

// =============================================================================
// HOOK OPTIMISÉ (ENHANCED)
// =============================================================================

export const useInlineEdit = ({
  initialValue,
  onSave,
  onCancel,
  validator,
  placeholder,
  maxLength,
  trim = true,
  selectAllOnFocus = true,
  saveOnBlur = true,
  disabled = false,
}: UseInlineEditProps): UseInlineEditReturn => {
  
  // =============================================================================
  // STATE
  // =============================================================================
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  // =============================================================================
  // COMPUTED VALUES (MEMOIZED)
  // =============================================================================
  
  const processedValue = trim ? editValue.trim() : editValue;
  const hasChanges = processedValue !== initialValue;
  const isEmpty = processedValue.length === 0;
  const validationError = validator ? validator(processedValue) : null;
  const isValid = validationError === null;
  const canSave = hasChanges && isValid && !isEmpty;
  
  // =============================================================================
  // SYNC INITIAL VALUE (QUAND PROP CHANGE)
  // =============================================================================
  
  useEffect(() => {
    if (!isEditing) {
      setEditValue(initialValue);
      setError(null);
    }
  }, [initialValue, isEditing]);
  
  // =============================================================================
  // ACTIONS (OPTIMISÉES AVEC useCallback)
  // =============================================================================
  
  const startEdit = useCallback(() => {
    if (disabled) return;
    
    setEditValue(initialValue);
    setError(null);
    setIsEditing(true);
  }, [initialValue, disabled]);
  
  const stopEdit = useCallback(() => {
    setIsEditing(false);
    setError(null);
  }, []);
  
  const save = useCallback((): boolean => {
    if (!canSave) {
      setError(validationError || 'Aucune modification à sauvegarder');
      return false;
    }
    
    try {
      onSave(processedValue);
      stopEdit();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(errorMessage);
      return false;
    }
  }, [canSave, processedValue, validationError, onSave, stopEdit]);
  
  const cancel = useCallback(() => {
    setEditValue(initialValue);
    setError(null);
    stopEdit();
    onCancel?.();
  }, [initialValue, stopEdit, onCancel]);
  
  const reset = useCallback(() => {
    setEditValue(initialValue);
    setError(null);
  }, [initialValue]);
  
  // =============================================================================
  // EVENT HANDLERS (OPTIMISÉS)
  // =============================================================================
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Respecter maxLength si défini
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    
    setEditValue(newValue);
    
    // Validation en temps réel
    if (validator) {
      const validationError = validator(trim ? newValue.trim() : newValue);
      setError(validationError);
    } else {
      setError(null);
    }
  }, [maxLength, trim, validator]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  }, [save, cancel]);
  
  const handleBlur = useCallback(() => {
    if (saveOnBlur && hasChanges && isValid) {
      save();
    } else if (saveOnBlur) {
      cancel();
    }
  }, [saveOnBlur, hasChanges, isValid, save, cancel]);
  
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (selectAllOnFocus) {
      // Sélectionner tout le texte au focus
      setTimeout(() => {
        e.target.select();
      }, 0);
    }
  }, [selectAllOnFocus]);
  
  // =============================================================================
  // RETURN HOOK
  // =============================================================================
  
  return {
    // État
    isEditing,
    editValue,
    error,
    hasChanges,
    
    // Props pour input
    inputProps: {
      value: editValue,
      onChange: handleChange,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onFocus: handleFocus,
      placeholder,
      maxLength,
      autoFocus: true,
      disabled,
      ref: inputRef,
    },
    
    // Actions
    actions: {
      startEdit,
      stopEdit,
      save,
      cancel,
      reset,
    },
    
    // Helpers
    helpers: {
      canSave,
      isEmpty,
      isValid,
    },
  };
};

// =============================================================================
// HOOKS SPÉCIALISÉS (VARIANTS)
// =============================================================================

// Hook pour édition de nom (validations communes)
export const useNameEdit = (
  initialValue: string,
  onSave: (value: string) => void,
  existingNames: readonly string[] = []
) => {
  return useInlineEdit({
    initialValue,
    onSave,
    validator: (value) => {
      if (value.length === 0) return 'Le nom ne peut pas être vide';
      if (value.length > 100) return 'Le nom est trop long (max 100 caractères)';
      if (existingNames.includes(value) && value !== initialValue) {
        return 'Ce nom existe déjà';
      }
      return null;
    },
    placeholder: 'Entrez un nom...',
    maxLength: 100,
    trim: true,
    selectAllOnFocus: true,
  });
};

// Hook pour édition de texte long (textarea)
export const useTextEdit = (
  initialValue: string,
  onSave: (value: string) => void,
  maxLength = 1000
) => {
  return useInlineEdit({
    initialValue,
    onSave,
    validator: (value) => {
      if (value.length > maxLength) {
        return `Texte trop long (max ${maxLength} caractères)`;
      }
      return null;
    },
    placeholder: 'Entrez votre texte...',
    maxLength,
    trim: true,
    selectAllOnFocus: false, // Pour textarea, pas de select all
    saveOnBlur: false, // Pour textarea, pas de save sur blur
  });
};

// Hook pour édition d'URL
export const useUrlEdit = (
  initialValue: string,
  onSave: (value: string) => void
) => {
  return useInlineEdit({
    initialValue,
    onSave,
    validator: (value) => {
      if (value.length === 0) return null; // URL optionnelle
      
      try {
        new URL(value);
        return null;
      } catch {
        return 'URL invalide';
      }
    },
    placeholder: 'https://exemple.com',
    trim: true,
    selectAllOnFocus: true,
  });
};

// =============================================================================
// UTILITIES POUR VALIDATION
// =============================================================================

export const validators = {
  required: (message = 'Ce champ est requis') => (value: string): string | null => {
    return value.length === 0 ? message : null;
  },
  
  minLength: (min: number, message?: string) => (value: string): string | null => {
    return value.length < min 
      ? message || `Minimum ${min} caractères requis`
      : null;
  },
  
  maxLength: (max: number, message?: string) => (value: string): string | null => {
    return value.length > max 
      ? message || `Maximum ${max} caractères autorisés`
      : null;
  },
  
  pattern: (regex: RegExp, message: string) => (value: string): string | null => {
    return regex.test(value) ? null : message;
  },
  
  unique: (existing: readonly string[], current: string, message = 'Cette valeur existe déjà') => 
    (value: string): string | null => {
      return existing.includes(value) && value !== current ? message : null;
    },
  
  compose: (...validators: Array<(value: string) => string | null>) => 
    (value: string): string | null => {
      for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
      }
      return null;
    },
} as const;
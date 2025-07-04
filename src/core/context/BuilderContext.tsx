// =============================================================================
// CONTEXT - BUILDER CONTEXT AVEC ÉTAT NORMALISÉ
// =============================================================================

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  NormalizedBuilderState, 
  initialState, 
  builderReducer, 
  BuilderAction 
} from '../store';

// =============================================================================
// TYPES DU CONTEXT
// =============================================================================

interface BuilderContextType {
  state: NormalizedBuilderState;
  dispatch: React.Dispatch<BuilderAction>;
}

// =============================================================================
// CRÉATION DU CONTEXT
// =============================================================================

export const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface BuilderProviderProps {
  children: ReactNode;
}

export const BuilderProvider: React.FC<BuilderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  const value: BuilderContextType = {
    state,
    dispatch,
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};

// =============================================================================
// HOOK PRINCIPAL D'ACCÈS AU BUILDER
// =============================================================================

export const useBuilder = (): BuilderContextType => {
  const context = useContext(BuilderContext);
  
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  
  return context;
};

// =============================================================================
// HOOK DISPATCH SEUL (POUR LES ACTIONS)
// =============================================================================

export const useBuilderDispatch = (): React.Dispatch<BuilderAction> => {
  const { dispatch } = useBuilder();
  return dispatch;
};

// =============================================================================
// HOOK STATE SEUL (POUR LA LECTURE)
// =============================================================================

export const useBuilderState = (): NormalizedBuilderState => {
  const { state } = useBuilder();
  return state;
};
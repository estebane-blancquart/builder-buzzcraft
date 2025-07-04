// =============================================================================
// STORE - SELECTORS OPTIMISÉS V2 (CODE EXEMPLAIRE)
// =============================================================================

import type { NormalizedBuilderState } from './state';
import type { Page, Module, Component } from '../types';

// =============================================================================
// MEMOIZATION SYSTEM V2 (ENHANCED PERFORMANCE)
// =============================================================================

interface MemoCache<T> {
  result: T;
  timestamp: number;
  deps: string;
  hitCount: number;
  size: number; // Estimation taille mémoire
}

class EnhancedSelectorCache {
  private cache = new Map<string, MemoCache<any>>();
  private readonly maxSize = 150;
  private readonly maxMemory = 10 * 1024 * 1024; // 10MB
  private readonly ttl = 2000; // 2 secondes
  private readonly cleanupInterval = 3000;
  private currentMemoryUsage = 0;
  private cleanupTimer?: number;
  private hitRate = { hits: 0, misses: 0 };

  constructor() {
    this.startCleanup();
  }

  get<T>(key: string, deps: string): T | null {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.ttl && cached.deps === deps) {
      cached.hitCount++;
      this.hitRate.hits++;
      return cached.result;
    }

    this.hitRate.misses++;
    return null;
  }

  set<T>(key: string, deps: string, result: T): void {
    const size = this.estimateSize(result);
    
    // Cleanup si nécessaire
    while ((this.cache.size >= this.maxSize || this.currentMemoryUsage + size > this.maxMemory) && this.cache.size > 0) {
      this.evictLeastUsed();
    }

    const oldEntry = this.cache.get(key);
    if (oldEntry) {
      this.currentMemoryUsage -= oldEntry.size;
    }

    this.cache.set(key, {
      result,
      timestamp: Date.now(),
      deps,
      hitCount: 1,
      size,
    });

    this.currentMemoryUsage += size;
  }

  private estimateSize(obj: any): number {
    if (obj === null || obj === undefined) return 4;
    if (typeof obj === 'string') return obj.length * 2;
    if (typeof obj === 'number') return 8;
    if (typeof obj === 'boolean') return 4;
    if (Array.isArray(obj)) return obj.reduce((acc, item) => acc + this.estimateSize(item), 24);
    if (typeof obj === 'object') return Object.entries(obj).reduce((acc, [key, value]) => acc + key.length * 2 + this.estimateSize(value), 24);
    return 24; // Default object overhead
  }

  private evictLeastUsed(): void {
    let leastUsed: string | null = null;
    let minScore = Infinity;

    for (const [key, cached] of this.cache.entries()) {
      // Score basé sur hitCount et age
      const age = Date.now() - cached.timestamp;
      const score = cached.hitCount / (age / 1000 + 1);
      
      if (score < minScore) {
        minScore = score;
        leastUsed = key;
      }
    }

    if (leastUsed) {
      const evicted = this.cache.get(leastUsed)!;
      this.currentMemoryUsage -= evicted.size;
      this.cache.delete(leastUsed);
    }
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, cached] of this.cache.entries()) {
        if (now - cached.timestamp > this.ttl * 2) { // Double TTL pour cleanup
          this.currentMemoryUsage -= cached.size;
          this.cache.delete(key);
        }
      }
    }, this.cleanupInterval);
  }

  getMetrics() {
    const totalRequests = this.hitRate.hits + this.hitRate.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      memoryUsage: this.currentMemoryUsage,
      maxMemory: this.maxMemory,
      hitRate: totalRequests > 0 ? (this.hitRate.hits / totalRequests * 100).toFixed(2) + '%' : '0%',
      entries: Array.from(this.cache.keys()),
    };
  }

  clear(): void {
    this.cache.clear();
    this.currentMemoryUsage = 0;
    this.hitRate = { hits: 0, misses: 0 };
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

const selectorCache = new EnhancedSelectorCache();

// =============================================================================
// MEMOIZATION HELPERS V2 (PLUS INTELLIGENTS)
// =============================================================================

/**
 * Créer un selector avec memoization automatique
 */
function createMemoSelector<TResult>(
  key: string,
  depsGetter: (state: NormalizedBuilderState) => string,
  selector: (state: NormalizedBuilderState) => TResult
) {
  return (state: NormalizedBuilderState): TResult => {
    const deps = depsGetter(state);
    const cacheKey = `${key}`;
    
    const cached = selectorCache.get<TResult>(cacheKey, deps);
    if (cached !== null) {
      return cached;
    }

    const result = selector(state);
    selectorCache.set(cacheKey, deps, result);
    return result;
  };
}

/**
 * Créer un selector paramétré avec memoization
 */
function createParameterizedSelector<TParam, TResult>(
  key: string,
  depsGetter: (state: NormalizedBuilderState, param: TParam) => string,
  selector: (state: NormalizedBuilderState, param: TParam) => TResult
) {
  return (state: NormalizedBuilderState) => (param: TParam): TResult => {
    const deps = depsGetter(state, param);
    const cacheKey = `${key}-${JSON.stringify(param)}`;
    
    const cached = selectorCache.get<TResult>(cacheKey, deps);
    if (cached !== null) {
      return cached;
    }

    const result = selector(state, param);
    selectorCache.set(cacheKey, deps, result);
    return result;
  };
}

/**
 * Créer un selector simple sans memoization (pour données volatiles)
 */
function createSimpleSelector<TResult>(
  selector: (state: NormalizedBuilderState) => TResult
) {
  return selector;
}

// =============================================================================
// SELECTORS ENTITÉS (API COHÉRENTE)
// =============================================================================

// === PAGES ===

export const selectAllPages = createMemoSelector(
  'allPages',
  (state) => state.meta.pageOrder.join(','),
  (state): Page[] => {
    return state.meta.pageOrder
      .map(id => state.entities.pages[id])
      .filter((page): page is Page => !!page);
  }
);

export const selectPageById = createParameterizedSelector(
  'pageById',
  (state, pageId: string) => `${!!state.entities.pages[pageId]}-${state.entities.pages[pageId]?.updatedAt ?? 0}`,
  (state, pageId: string): Page | null => {
    return state.entities.pages[pageId] ?? null;
  }
);

export const selectActivePage = createMemoSelector(
  'activePage',
  (state) => `${state.meta.activePageId}-${state.entities.pages[state.meta.activePageId || '']?.updatedAt ?? 0}`,
  (state): Page | null => {
    const activeId = state.meta.activePageId;
    return activeId ? state.entities.pages[activeId] ?? null : null;
  }
);

export const selectPageExists = createParameterizedSelector(
  'pageExists',
  (state, pageId: string) => `${pageId in state.entities.pages}`,
  (state, pageId: string): boolean => {
    return pageId in state.entities.pages;
  }
);

// === MODULES ===

export const selectAllModules = createMemoSelector(
  'allModules',
  (state) => Object.keys(state.entities.modules).join(','),
  (state): Module[] => Object.values(state.entities.modules)
);

export const selectModuleById = createParameterizedSelector(
  'moduleById',
  (state, moduleId: string) => `${!!state.entities.modules[moduleId]}-${state.entities.modules[moduleId]?.updatedAt ?? 0}`,
  (state, moduleId: string): Module | null => {
    return state.entities.modules[moduleId] ?? null;
  }
);

export const selectModulesForPage = createParameterizedSelector(
  'modulesForPage',
  (state, pageId: string) => `${(state.relations.pageModules[pageId] || []).join(',')}-${Date.now()}`,
  (state, pageId: string): Module[] => {
    const moduleIds = state.relations.pageModules[pageId] || [];
    return moduleIds
      .map(id => state.entities.modules[id])
      .filter((module): module is Module => !!module);
  }
);

export const selectModuleExists = createParameterizedSelector(
  'moduleExists',
  (state, moduleId: string) => `${moduleId in state.entities.modules}`,
  (state, moduleId: string): boolean => {
    return moduleId in state.entities.modules;
  }
);

// === COMPONENTS ===

export const selectAllComponents = createMemoSelector(
  'allComponents',
  (state) => Object.keys(state.entities.components).join(','),
  (state): Component[] => Object.values(state.entities.components)
);

export const selectComponentById = createParameterizedSelector(
  'componentById',
  (state, componentId: string) => `${!!state.entities.components[componentId]}-${state.entities.components[componentId]?.updatedAt ?? 0}`,
  (state, componentId: string): Component | null => {
    return state.entities.components[componentId] ?? null;
  }
);

export const selectComponentsForModule = createParameterizedSelector(
  'componentsForModule',
  (state, moduleId: string) => `${(state.relations.moduleComponents[moduleId] || []).join(',')}-${Date.now()}`,
  (state, moduleId: string): Component[] => {
    const componentIds = state.relations.moduleComponents[moduleId] || [];
    return componentIds
      .map(id => state.entities.components[id])
      .filter((component): component is Component => !!component);
  }
);

export const selectComponentExists = createParameterizedSelector(
  'componentExists',
  (state, componentId: string) => `${componentId in state.entities.components}`,
  (state, componentId: string): boolean => {
    return componentId in state.entities.components;
  }
);

export const selectComponentsByType = createMemoSelector(
  'componentsByType',
  (state) => Object.keys(state.entities.components).join(','),
  (state) => {
    const components = Object.values(state.entities.components);
    return components.reduce((acc, component) => {
      const type = component.type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(component);
      return acc;
    }, {} as Record<string, Component[]>);
  }
);

// =============================================================================
// SELECTORS UI (SIMPLES - DONNÉES VOLATILES)
// =============================================================================

export const selectActiveDevice = createSimpleSelector(
  (state) => state.ui.activeDevice
);

export const selectViewport = createSimpleSelector(
  (state) => state.ui.viewport
);

export const selectSelection = createSimpleSelector(
  (state) => state.ui.selection
);

export const selectEditingState = createSimpleSelector(
  (state) => state.ui.editing
);

export const selectNotifications = createSimpleSelector(
  (state) => state.ui.notifications
);

export const selectIsLoading = createSimpleSelector(
  (state) => state.ui.isLoading
);

export const selectIsDirty = createSimpleSelector(
  (state) => state.ui.isDirty
);

export const selectLayout = createSimpleSelector(
  (state) => state.ui.layout
);

// =============================================================================
// SELECTORS COMPOSÉS (MEMOIZATION AVANCÉE)
// =============================================================================

export const selectCurrentSelection = createMemoSelector(
  'currentSelection',
  (state) => `${state.ui.selection.pageId}-${state.ui.selection.moduleId}-${state.ui.selection.componentId}`,
  (state) => {
    const { pageId, moduleId, componentId } = state.ui.selection;
    
    return {
      page: pageId ? selectPageById(state)(pageId) : null,
      module: moduleId ? selectModuleById(state)(moduleId) : null,
      component: componentId ? selectComponentById(state)(componentId) : null,
    };
  }
);

export const selectPageTree = createParameterizedSelector(
  'pageTree',
  (state, pageId: string) => `${pageId}-${JSON.stringify(state.relations)}-${Object.keys(state.entities.modules).length}-${Object.keys(state.entities.components).length}`,
  (state, pageId: string) => {
    const page = selectPageById(state)(pageId);
    if (!page) return null;

    const modules = selectModulesForPage(state)(pageId).map(module => ({
      ...module,
      components: selectComponentsForModule(state)(module.id),
    }));

    return {
      ...page,
      modules,
    };
  }
);

export const selectFullProjectTree = createMemoSelector(
  'fullProjectTree',
  (state) => `${state.meta.pageOrder.join(',')}-${JSON.stringify(state.relations)}-${Object.keys(state.entities.components).length}`,
  (state) => {
    return selectAllPages(state)
      .map(page => selectPageTree(state)(page.id))
      .filter((tree): tree is NonNullable<typeof tree> => !!tree);
  }
);

export const selectBreadcrumb = createMemoSelector(
  'breadcrumb',
  (state) => `${state.ui.selection.pageId}-${state.ui.selection.moduleId}-${state.ui.selection.componentId}`,
  (state) => {
    const { pageId, moduleId, componentId } = state.ui.selection;
    const breadcrumb = [];
    
    if (pageId) {
      const page = selectPageById(state)(pageId);
      if (page) {
        breadcrumb.push({ type: 'page' as const, id: pageId, name: page.name });
      }
    }
    
    if (moduleId) {
      const module = selectModuleById(state)(moduleId);
      if (module) {
        breadcrumb.push({ type: 'module' as const, id: moduleId, name: module.name });
      }
    }
    
    if (componentId) {
      const component = selectComponentById(state)(componentId);
      if (component) {
        breadcrumb.push({ type: 'component' as const, id: componentId, name: component.name });
      }
    }
    
    return breadcrumb;
  }
);

export const selectSelectedEntity = createMemoSelector(
  'selectedEntity',
  (state) => `${state.ui.selection.pageId}-${state.ui.selection.moduleId}-${state.ui.selection.componentId}`,
  (state) => {
    const { pageId, moduleId, componentId } = state.ui.selection;
    
    if (componentId && moduleId && pageId) {
      return {
        type: 'component' as const,
        entity: selectComponentById(state)(componentId),
        parentId: moduleId,
        rootId: pageId,
      };
    }
    
    if (moduleId && pageId) {
      return {
        type: 'module' as const,
        entity: selectModuleById(state)(moduleId),
        parentId: pageId,
        rootId: pageId,
      };
    }
    
    if (pageId) {
      return {
        type: 'page' as const,
        entity: selectPageById(state)(pageId),
        parentId: null,
        rootId: pageId,
      };
    }
    
    return null;
  }
);

// =============================================================================
// SELECTORS UTILITAIRES
// =============================================================================

export const selectProjectStats = createMemoSelector(
  'projectStats',
  (state) => `${Object.keys(state.entities.pages).length}-${Object.keys(state.entities.modules).length}-${Object.keys(state.entities.components).length}`,
  (state) => {
    const pages = Object.values(state.entities.pages);
    const modules = Object.values(state.entities.modules);
    const components = Object.values(state.entities.components);
    
    const lastModified = Math.max(
      ...pages.map(p => p.updatedAt),
      ...modules.map(m => m.updatedAt),
      ...components.map(c => c.updatedAt),
      0
    );
    
    return {
      pagesCount: pages.length,
      modulesCount: modules.length,
      componentsCount: components.length,
      lastModified,
      totalElements: pages.length + modules.length + components.length,
    };
  }
);

export const selectCanNavigateUp = createSimpleSelector(
  (state): boolean => {
    const { componentId, moduleId } = state.ui.selection;
    return !!(componentId || moduleId);
  }
);

export const selectCanNavigateDown = createMemoSelector(
  'canNavigateDown',
  (state) => `${state.ui.selection.pageId}-${state.ui.selection.moduleId}-${state.ui.selection.componentId}-${JSON.stringify(state.relations)}`,
  (state): boolean => {
    const { pageId, moduleId, componentId } = state.ui.selection;
    
    if (componentId) return false; // Déjà au niveau le plus bas
    
    if (moduleId) {
      const componentIds = state.relations.moduleComponents[moduleId];
      return !!(componentIds && componentIds.length > 0);
    }
    
    if (pageId) {
      const moduleIds = state.relations.pageModules[pageId];
      return !!(moduleIds && moduleIds.length > 0);
    }
    
    return false;
  }
);

export const selectSearchResults = createParameterizedSelector(
  'searchResults',
  (state, query: string) => `${Object.keys(state.entities.pages).length}-${Object.keys(state.entities.modules).length}-${Object.keys(state.entities.components).length}-${query}`,
  (state, query: string) => {
    if (!query.trim()) return { pages: [], modules: [], components: [] };
    
    const lowerQuery = query.toLowerCase();
    
    return {
      pages: Object.values(state.entities.pages).filter(page => 
        page.name.toLowerCase().includes(lowerQuery) ||
        page.slug.toLowerCase().includes(lowerQuery)
      ),
      modules: Object.values(state.entities.modules).filter(module =>
        module.name.toLowerCase().includes(lowerQuery)
      ),
      components: Object.values(state.entities.components).filter(component =>
        component.name.toLowerCase().includes(lowerQuery)
      ),
    };
  }
);

// =============================================================================
// CACHE MANAGEMENT & DEV TOOLS
// =============================================================================

export function clearSelectorCache(): void {
  selectorCache.clear();
}

export function getSelectorCacheMetrics() {
  return selectorCache.getMetrics();
}

export function destroySelectorCache(): void {
  selectorCache.destroy();
}

// Dev tools (browser only)
if (typeof window !== 'undefined' && typeof window.location !== 'undefined' && window.location.hostname === 'localhost') {
  (window as any).__BUZZCRAFT_CACHE_METRICS = getSelectorCacheMetrics;
  (window as any).__BUZZCRAFT_CLEAR_CACHE = clearSelectorCache;
  
  // Log metrics périodiquement en dev
  setInterval(() => {
    const metrics = getSelectorCacheMetrics();
    if (parseInt(metrics.hitRate) < 70) {
      console.warn('🔥 BuzzCraft Cache: Low hit rate', metrics);
    }
  }, 10000);
}
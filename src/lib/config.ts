// Environment configuration with TypeScript types
export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'MRCS Question Extractor',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },

  // Development Configuration
  dev: {
    mode: import.meta.env.VITE_DEV_MODE === 'true',
    enableLogging: import.meta.env.VITE_ENABLE_LOGGING === 'true',
  },

  // Feature Flags
  features: {
    realTimeUpdates: import.meta.env.VITE_ENABLE_REAL_TIME_UPDATES !== 'false',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },

  // Pagination Defaults
  pagination: {
    defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '20'),
    maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || '100'),
  },

  // Cache Configuration
  cache: {
    queryCacheTime: parseInt(import.meta.env.VITE_QUERY_CACHE_TIME || '300000'), // 5 minutes
    queryStaleTime: parseInt(import.meta.env.VITE_QUERY_STALE_TIME || '120000'), // 2 minutes
  },
} as const;

// Type for the config object
export type Config = typeof config;

// Helper function to validate environment variables
export const validateConfig = (): void => {
  const requiredVars = ['VITE_API_BASE_URL'];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(
        ', '
      )}. Using defaults.`
    );
  }
};

// Validate config on import
validateConfig();

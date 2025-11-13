// Configuración de la aplicación

export const config = {
  // API
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
  
  API_USER_URL: import.meta.env.VITE_API_USER_URL || 'https://grupo5-usuarios.vercel.app/',
  // Modo de desarrollo (mock vs API)
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true', //borro el or porque si la condicion de la izquierda da false va a entrar por el true de la derecha

  USE_AUTH_MOCK: import.meta.env.VITE_USE_AUTH_MOCK === 'true', // Nuevo: Modo de autenticación mock
  
  // Timeout de las peticiones
  REQUEST_TIMEOUT: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT) || 10000,
  
  // Configuración de la aplicación
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Búsqueda de Vuelos',
  
  // Configuración de paginación
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 10,
  
  // Configuración de moneda
  DEFAULT_CURRENCY: import.meta.env.VITE_DEFAULT_CURRENCY || 'USD',
  
  // Configuración de idioma
  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || 'es-AR',
  
  // Configuración del theme
  THEME: {
    PRIMARY_COLOR: import.meta.env.VITE_PRIMARY_COLOR || '#1976d2',
    SECONDARY_COLOR: import.meta.env.VITE_SECONDARY_COLOR || '#dc004e',
    BACKGROUND_COLOR: import.meta.env.VITE_BACKGROUND_COLOR || '#f5f5f5',
    SURFACE_COLOR: import.meta.env.VITE_SURFACE_COLOR || '#ffffff',
    ERROR_COLOR: import.meta.env.VITE_ERROR_COLOR || '#d32f2f',
    WARNING_COLOR: import.meta.env.VITE_WARNING_COLOR || '#ed6c02',
    INFO_COLOR: import.meta.env.VITE_INFO_COLOR || '#0288d1',
    SUCCESS_COLOR: import.meta.env.VITE_SUCCESS_COLOR || '#2e7d32',
    DISABLED_COLOR: import.meta.env.VITE_DISABLED_COLOR || '#9e9e9e',

  }
};

// Endpoints de la API
export const endpoints = {
  FLIGHTS: {
    SEARCH: '/search',
    BY_ID: '/flights/:id',
    ALL: '/flights'
  },
  AIRPORTS: {
    ALL: '/airport',
    SEARCH: '/airports/search'
  },
  BOOKINGS: {
    CREATE: '/search/intent',
  }, 
  AUTH: {
    LOGIN: config.USE_AUTH_MOCK ? '/auth/login/mock' : '/auth/login',
    ME: '/auth/user',
    REGISTER: '/auth/register'
  }
};

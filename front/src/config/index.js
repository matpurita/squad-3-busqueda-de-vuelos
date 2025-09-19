// Configuración de la aplicación
export const config = {
  // API
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
  
  // Modo de desarrollo (mock vs API)
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true', //borro el or porque si la condicion de la izquierda da false va a entrar por el true de la derecha
  
  // Timeout de las peticiones
  REQUEST_TIMEOUT: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT) || 10000,
  
  // Configuración de la aplicación
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Búsqueda de Vuelos',
  
  // Configuración de paginación
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 10,
  
  // Configuración de moneda
  DEFAULT_CURRENCY: import.meta.env.VITE_DEFAULT_CURRENCY || 'USD',
  
  // Configuración de idioma
  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || 'es-AR'
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
    CREATE: '/bookings',
    BY_ID: '/bookings/:id'
  }
};

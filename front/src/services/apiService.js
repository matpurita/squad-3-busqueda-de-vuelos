import axios from "axios";
import { config, endpoints } from "../config";
import { utilidades } from '../services';

/**
 * ========================================
 * EJEMPLOS DE USO DEL NUEVO MAPEO:
 * ========================================
 * 
 * // Buscar vuelos
 * const resultado = await apiService.buscarVuelos({
 *   origin: 'EZE',
 *   destination: 'MIA',
 *   departureDate: '2025-10-18'
 * });
 * 
 * // Iterar sobre resultados (cada resultado puede tener ida + vuelta)
 * resultado.results.forEach(vuelo => {
 *   console.log('=== RESULTADO DE VUELO ===');
 *   console.log('Precio total:', vuelo.totalPrice, vuelo.currency);
 *   console.log('Tipo:', vuelo.tipo); // 'oneway' o 'roundtrip'
 *   
 *   // Vuelo de ida (siempre existe)
 *   console.log('IDA:', {
 *     airline: vuelo.departure.airline,
 *     from: vuelo.departure.from,
 *     to: vuelo.departure.to,
 *     departTime: vuelo.departure.departTime,
 *     price: vuelo.departure.price
 *   });
 *   
 *   // Vuelo de regreso (solo si existe)
 *   if (vuelo.return) {
 *     console.log('REGRESO:', {
 *       airline: vuelo.return.airline,
 *       from: vuelo.return.from,
 *       to: vuelo.return.to,
 *       departTime: vuelo.return.departTime,
 *       price: vuelo.return.price
 *     });
 *   }
 * });
 * 
 * // Estructura de cada resultado:
 * // {
 * //   id: "uuid-frontend",
 * //   totalPrice: 58.37,
 * //   currency: "USD",
 * //   tipo: "roundtrip",
 * //   departure: { 
 * //     id: "cmfge87jjdgasxxnwc8d11txb",
 * //     airline: "Air France",
 * //     from: "Buenos Aires",
 * //     to: "Miami",
 * //     departTime: "21:30",
 * //     price: 28.91,
 * //     // ... más campos mapeados
 * //   },
 * //   return: { // Solo si es roundtrip
 * //     id: "cmfgemp8cfcy4xxnwx0mx09sp",
 * //     airline: "Lufthansa",
 * //     from: "Miami", 
 * //     to: "Buenos Aires",
 * //     departTime: "01:45",
 * //     price: 29.46,
 * //     // ... más campos mapeados
 * //   }
 * // }
 * 
 * ========================================
 */

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: config.API_URL,
  timeout: config.REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token de autorización automáticamente
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del sessionStorage
    const token = sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en petición API:", error);
    
    // Si es error 401 (Unauthorized), limpiar sesión
    if (error.response?.status === 401) {
      // Emitir evento personalizado para que el AuthContext maneje el logout
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    
    return Promise.reject(error);
  }
);

// === FUNCIONES DE MAPEO ===

// Función para formatear hora desde ISO string
const formatearHora = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires' // Ajustar según tu zona horaria
  });
};

// Función para formatear fecha desde ISO string
const formatearFecha = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES');
};

// Función para calcular duración entre dos fechas
const calcularDuracion = (salida, llegada) => {
  if (!salida || !llegada) return '';
  const inicio = new Date(salida);
  const fin = new Date(llegada);
  const diffMs = fin - inicio;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffHrs}h ${diffMins}m`;
};

// Mapear un vuelo individual (departure o return)
const mapearVueloIndividual = (vueloData) => {
  if (!vueloData) return null;
  
  return {
    uuid: crypto.randomUUID(),
    id: vueloData.id,
    airline: vueloData.airline?.name || '',
    airlineCode: vueloData.airline?.code || '',
    from: vueloData.origin?.city || vueloData.origin?.name || '',
    fromCode: vueloData.origin?.code || '',
    fromAirport: vueloData.origin?.name || '',
    to: vueloData.destination?.city || vueloData.destination?.name || '',
    toCode: vueloData.destination?.code || '',
    toAirport: vueloData.destination?.name || '',
    departTime: formatearHora(vueloData.departure),
    arriveTime: formatearHora(vueloData.arrival),
    departDateTime: vueloData.departure,
    arriveDateTime: vueloData.arrival,
    price: vueloData.price || 0,
    currency: vueloData.currency || 'USD',
    direct: true, // Asumir que es directo por defecto
    numeroVuelo: vueloData.flightNumber || '',
    duracion: calcularDuracion(vueloData.departure, vueloData.arrival),
    fechaSalida: vueloData.departure,
    fechaLlegada: vueloData.arrival,
    fechaSalidaFormateada: formatearFecha(vueloData.departure),
    fechaLlegadaFormateada: formatearFecha(vueloData.arrival),
    status: vueloData.status || 'ON_TIME',
    // Datos originales por si se necesitan
    raw: vueloData
  };
};

// Mapear el resultado completo de búsqueda (con departure y return) - Simplificado
const mapearResultadoBusqueda = (resultado) => {
  if (!resultado) return null;
  
  const resultadoMapeado = {
    id: crypto.randomUUID(),
    totalPrice: resultado.totalPrice || 0,
    currency: resultado.departure?.currency || 'USD'
  };

  if (resultado.departure) {
    resultadoMapeado.departure = mapearVueloIndividual(resultado.departure);
  }

  if (resultado.return) {
    resultadoMapeado.return = mapearVueloIndividual(resultado.return);
    resultadoMapeado.tipo = 'roundtrip';
  } else {
    resultadoMapeado.tipo = 'oneway';
  }

  return resultadoMapeado;
};

// Servicio de API para vuelos
export const apiService = {
  // Buscar vuelos
  buscarVuelos: async (filtros = {}) => {
    try {
      const response = await apiClient.get(endpoints.FLIGHTS.SEARCH, {
        params: filtros,
      });

      // Mapear cada resultado manteniendo la estructura original
      const resultados = response.data.results.map(resultado => {
        const resultadoMapeado = {
          id: crypto.randomUUID(), // ID único para el frontend
          totalPrice: resultado.totalPrice || 0,
          currency: resultado.departure?.currency || 'USD'
        };

        // Mapear vuelo de ida (siempre existe)
        if (resultado.departure) {
          resultadoMapeado.departure = mapearVueloIndividual(resultado.departure);
        }

        // Mapear vuelo de regreso (solo si existe)
        if (resultado.return) {
          resultadoMapeado.return = mapearVueloIndividual(resultado.return);
          resultadoMapeado.tipo = 'roundtrip';
        } else {
          resultadoMapeado.tipo = 'oneway';
        }

        return resultadoMapeado;
      }).filter(Boolean); // Filtrar resultados nulos

      return {
        results: resultados,
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      throw new Error(`Error buscando vuelos: ${error.message}`);
    }
  },

  // Obtener vuelo por ID
  obtenerVuelo: async (id) => {
    try {
      const url = endpoints.FLIGHTS.BY_ID.replace(":id", id);
      const response = await apiClient.get(url);
      
      // Asumir que un vuelo individual puede tener la misma estructura
      return mapearVueloIndividual(response.data);
    } catch (error) {
      throw new Error(`Error obteniendo vuelo: ${error.message}`);
    }
  },

  // Obtener todos los vuelos
  obtenerTodosLosVuelos: async () => {
    try {
      const response = await apiClient.get(endpoints.FLIGHTS.ALL);
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo vuelos: ${error.message}`);
    }
  },

  // Obtener aeropuertos
  obtenerAeropuertos: async () => {
    try {
      const response = await apiClient.get(endpoints.AIRPORTS.ALL);

      const airports = response.data?.map((airport) => {
        return {
          codigo: airport.code,
          nombre: airport.name,
          ciudad: airport.city,
        };
      });

      return airports;
    } catch (error) {
      throw new Error(`Error obteniendo aeropuertos: ${error.message}`);
    }
  },

  // Buscar aeropuertos
  buscarAeropuertos: async (ciudad) => {
    try {
      const response = await apiClient.get(endpoints.AIRPORTS.SEARCH, {
        params: { ciudad },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error buscando aeropuertos: ${error.message}`);
    }
  },

  // Crear reserva
  crearReserva: async (datosReserva) => {
    try {
      const response = await apiClient.post(
        endpoints.BOOKINGS.CREATE,
        datosReserva
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error creando reserva: ${error.message}`);
    }
  },

  // Obtener reserva por ID
  obtenerReserva: async (id) => {
    try {
      const url = endpoints.BOOKINGS.BY_ID.replace(":id", id);
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo reserva: ${error.message}`);
    }
  },

  // === MÉTODOS DE AUTENTICACIÓN ===
  
  // Login con email y password
  login: async (email, password) => {
    try {
      // Usamos una instancia sin interceptor para login (no necesita token)
      const loginClient = axios.create({
        baseURL: config.API_URL,
        timeout: config.REQUEST_TIMEOUT,
        headers: { "Content-Type": "application/json" }
      });

      const response = await loginClient.post(endpoints.AUTH.LOGIN, {
        email,
        password
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  

  // Obtener datos del usuario autenticado
  getUserData: async () => {
    try {
      const response = await apiClient.get(endpoints.AUTH.ME);
      return response.data;
    } catch (error) {
      throw new Error(`Error obteniendo datos del usuario: ${error.message}`);
    }
  },

  // Verificar si el token es válido
  validateToken: async () => {
    try {
      const response = await apiClient.get(endpoints.AUTH.ME);
      return { valid: true, user: response.data };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
};

// === FUNCIONES UTILITY PARA MAPEO ===
export const flightMappers = {
  // Mapear un vuelo individual
  mapVueloIndividual: mapearVueloIndividual,
  
  // Mapear resultado completo de búsqueda
  mapResultadoBusqueda: mapearResultadoBusqueda,
  
  // Formatear hora
  formatHora: formatearHora,
  
  // Formatear fecha
  formatFecha: formatearFecha,
  
  // Calcular duración
  calcDuracion: calcularDuracion
};

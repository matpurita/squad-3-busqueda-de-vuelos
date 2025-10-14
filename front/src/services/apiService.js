import axios from "axios";
import { config, endpoints } from "../config";
import { utilidades } from '../services';

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

const mapearVuelo = (vuelo) => {
  return {
    uuid: crypto.randomUUID(),
    id: vuelo.id || null,
    airline: vuelo.airline?.name || null,
    from: vuelo.origin?.name || null,
    to: vuelo.destination?.name || null,
    departTime: vuelo.departure || null,
    arriveTime: vuelo.arrival || null,
    price: vuelo.TotalPrice || null,
    direct: true,
    numeroVuelo: vuelo.flightNumber || null,
    duracion: vuelo.duration || null,
    fechaSalida: vuelo.departure || null,
    fechaLlegada: vuelo.arrival || null,
    clase: vuelo.selectedSeat?.class?.name || null,
    asiento: vuelo.selectedSeat?.seatNumber || null
  };
};

// Servicio de API para vuelos
export const apiService = {
  // Buscar vuelos
  buscarVuelos: async (filtros = {}) => {
    try {
      const response = await apiClient.get(endpoints.FLIGHTS.SEARCH, {
        params: filtros,
      });

      const vuelosIda = [];
      const vuelosRegreso = [];

      response.data.results.forEach((vuelo) => {
        vuelosIda.push(mapearVuelo(vuelo.departure));
        if (vuelo.return != undefined) {
          vuelosRegreso.push(mapearVuelo(vuelo.return));
        }
      });

      return {
        vuelosIda,
        vuelosRegreso,
        pagination: response.data.pagination
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
      return response.data;
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
      throw new Error(`Error en login: ${error.message}`);
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

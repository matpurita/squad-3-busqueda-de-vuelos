import axios from "axios";
import { config, endpoints } from "../config";

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: config.API_URL,
  timeout: config.REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en petición API:", error);
    return Promise.reject(error);
  }
);

/*
        id: vuelo.id,
        airline: vuelo.aerolinea,
        from: vuelo.origen,
        
        */

// Servicio de API para vuelos
export const apiService = {
  // Buscar vuelos
  buscarVuelos: async (filtros = {}) => {
    try {
      const response = await apiClient.get(endpoints.FLIGHTS.SEARCH, {
        params: filtros,
      });

      const vuelos = response.data.results.map((vuelo) => {
        return {
          id: vuelo.departure.id,
          airline: vuelo.departure.airline.name,
          from: vuelo.departure.origin.name,
          to: vuelo.departure.destination.name,
          departTime: vuelo.departure.departure,
          arriveTime: vuelo.departure.arrival,
          price: vuelo.totalPrice,
          direct: true,
          numeroVuelo: vuelo.departure.flightNumber,
          duracion: vuelo.departure.duration,
          fechaSalida: vuelo.departure.departure,
          fechaLlegada: vuelo.departure.arrival,
        };
      });

      return vuelos;
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
};

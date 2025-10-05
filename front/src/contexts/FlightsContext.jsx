import { createContext, useContext, useEffect, useState } from 'react';
import { vuelosService, utilidades } from '../services';

// Crear el contexto
const FlightsContext = createContext();

// Provider del contexto
export const FlightsProvider = ({ children }) => {
  // Estado de vuelos
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Función para buscar vuelos
  const searchFlights = async (criteria) => {
    try {
      setLoading(true);
      setError(null);

      // Buscar vuelos usando el servicio con filtros completos
      const vuelosData = await vuelosService.buscarConFiltros(criteria);
      setVuelos(vuelosData);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Error buscando vuelos:', error);
      setError('Error al buscar vuelos. Por favor, intenta nuevamente.');
      setVuelos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para seleccionar un vuelo
  const selectFlight = (idaFlight, vueltaFlight) => {
    const selected = {
      ida: idaFlight || selectedFlight?.ida || null,
      vuelta: vueltaFlight || selectedFlight?.vuelta || null
    };
    setSelectedFlight(selected);
  };

  // Función para obtener todos los vuelos
  const loadAllFlights = async () => {
    try {
      setLoading(true);
      const vuelosData = await vuelosService.obtenerTodos();
      setVuelos(vuelosData);
    } catch (error) {
      console.error('Error cargando vuelos:', error);
      setError('Error al cargar vuelos.');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener vuelo por ID
  const getFlightById = async (id) => {
    try {
      setLoading(true);
      const vuelo = await vuelosService.obtenerPorId(id);
      return vuelo;
    } catch (error) {
      console.error('Error obteniendo vuelo:', error);
      setError('Error al obtener el vuelo.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar resultados
  const clearResults = () => {
    setVuelos([]);
    setSelectedFlight(null);
    setSearchPerformed(false);
    setError(null);
  };

  // Función para agregar vuelo
  const addVuelo = (vuelo) => {
    setVuelos(prev => [...prev, vuelo]);
  };

  // Función para remover vuelo
  const removeVuelo = (vueloId) => {
    setVuelos(prev => prev.filter(vuelo => vuelo.id !== vueloId));
  };

  const value = {
    // Estado
    vuelos, loading, error, selectedFlight, searchPerformed,
    
    // Setters
    setVuelos, setLoading, setError, setSelectedFlight, setSearchPerformed,
    
    // Funciones
    searchFlights, selectFlight, loadAllFlights, getFlightById,
    clearResults, addVuelo, removeVuelo
  };

  return (
    <FlightsContext.Provider value={value}>
      {children}
    </FlightsContext.Provider>
  );
};

// Hook para usar el contexto
export const useFlights = () => {
  const context = useContext(FlightsContext);
  if (!context) {
    throw new Error('useFlights debe ser usado dentro de un FlightsProvider');
  }
  return context;
};

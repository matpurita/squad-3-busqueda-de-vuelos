/**
 * EJEMPLO DE COMPONENTE PARA MOSTRAR RESULTADOS DE BÚSQUEDA
 * ========================================================
 * 
 * Este es un ejemplo de cómo usar la nueva estructura de datos
 * que devuelve apiService.buscarVuelos()
 */

import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';

const VueloCard = ({ resultado }) => {
  const { departure, return: returnFlight, totalPrice, currency, tipo } = resultado;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Encabezado con precio total */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {totalPrice} {currency}
          </Typography>
          <Chip 
            label={tipo === 'roundtrip' ? 'Ida y vuelta' : 'Solo ida'} 
            color={tipo === 'roundtrip' ? 'primary' : 'secondary'}
            size="small"
          />
        </Box>

        {/* Vuelo de ida */}
        <Box mb={returnFlight ? 2 : 0}>
          <Box display="flex" alignItems="center" mb={1}>
            <FlightTakeoffIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Ida - {departure.numeroVuelo}
            </Typography>
          </Box>
          
          <Box display="flex" justifyContent="between" alignItems="center">
            <Box>
              <Typography variant="body2" color="text.secondary">
                {departure.airline}
              </Typography>
              <Typography variant="body1">
                {departure.from} ({departure.fromCode})
              </Typography>
              <Typography variant="body2">
                {departure.departTime} - {departure.fechaSalidaFormateada}
              </Typography>
            </Box>
            
            <Box textAlign="center" mx={2}>
              <Typography variant="body2" color="text.secondary">
                {departure.duracion}
              </Typography>
              <Typography variant="body2">
                Directo
              </Typography>
            </Box>
            
            <Box textAlign="right">
              <Typography variant="body1">
                {departure.to} ({departure.toCode})
              </Typography>
              <Typography variant="body2">
                {departure.arriveTime} - {departure.fechaLlegadaFormateada}
              </Typography>
              <Typography variant="body2" color="primary.main">
                ${departure.price}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Vuelo de regreso (solo si existe) */}
        {returnFlight && (
          <Box>
            <Box display="flex" alignItems="center" mb={1}>
              <FlightLandIcon sx={{ mr: 1, color: 'secondary.main' }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Regreso - {returnFlight.numeroVuelo}
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {returnFlight.airline}
                </Typography>
                <Typography variant="body1">
                  {returnFlight.from} ({returnFlight.fromCode})
                </Typography>
                <Typography variant="body2">
                  {returnFlight.departTime} - {returnFlight.fechaSalidaFormateada}
                </Typography>
              </Box>
              
              <Box textAlign="center" mx={2}>
                <Typography variant="body2" color="text.secondary">
                  {returnFlight.duracion}
                </Typography>
                <Typography variant="body2">
                  Directo
                </Typography>
              </Box>
              
              <Box textAlign="right">
                <Typography variant="body1">
                  {returnFlight.to} ({returnFlight.toCode})
                </Typography>
                <Typography variant="body2">
                  {returnFlight.arriveTime} - {returnFlight.fechaLlegadaFormateada}
                </Typography>
                <Typography variant="body2" color="primary.main">
                  ${returnFlight.price}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Componente principal para mostrar lista de resultados
const ResultadosBusqueda = ({ resultados = [] }) => {
  if (!resultados.length) {
    return (
      <Typography variant="body1" textAlign="center" py={4}>
        No se encontraron vuelos para los criterios de búsqueda.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
      </Typography>
      
      {resultados.map((resultado) => (
        <VueloCard key={resultado.id} resultado={resultado} />
      ))}
    </Box>
  );
};

export default ResultadosBusqueda;

/**
 * USO EN OTRO COMPONENTE:
 * ========================
 * 
 * import { apiService } from '../services/apiService';
 * import ResultadosBusqueda from './ResultadosBusqueda';
 * 
 * const [resultados, setResultados] = useState([]);
 * 
 * const buscarVuelos = async (filtros) => {
 *   try {
 *     const response = await apiService.buscarVuelos(filtros);
 *     setResultados(response.results); // <- Usar directamente los results
 *   } catch (error) {
 *     console.error('Error:', error);
 *   }
 * };
 * 
 * return <ResultadosBusqueda resultados={resultados} />;
 */
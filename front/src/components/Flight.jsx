import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { useFlights } from "../contexts/FlightsContext";
import { useSearch } from "../contexts/SearchContext";
import { utilidades } from "../services";

export default function Flight({ flight, resultado }) {
  const { selectFlight, selectedFlight } = useFlights();
  const { tripType } = useSearch();
  
  // El objeto flight ahora es todo el resultado con departure y return
  const departure = flight.departure;
  const returnFlight = flight.return;
  
  // Verificar si este resultado está seleccionado
  const isSelected = selectedFlight && selectedFlight.ida?.uuid === departure.uuid;
  
  const onSelectFlight = () => {
    if (tripType === 'oneway') {
      // Para solo ida, seleccionar solo el departure
      selectFlight(departure);
    } else {
      // Para ida y vuelta, seleccionar ambos
      selectFlight(departure, returnFlight);
    }
  };

  // Función para formatear duración - ahora maneja tanto string como número
  const formatDuration = (duration) => {
    // Si ya es string con formato "Xh Ym", devolverlo tal como está
    if (typeof duration === 'string' && duration.includes('h')) {
      return duration;
    }
    
    // Si es número (minutos), convertir a "Xh Ym"
    if (typeof duration === 'number') {
      const h = Math.floor(duration / 60);
      const m = duration % 60;
      return `${h}h ${m}m`;
    }
    
    return duration || 'N/A';
  };

  // Formatear precio con moneda
  const formatPrice = (price, currency = 'USD') => {
    if (!price) return 'N/A';
    return `$${price.toFixed(2)} ${currency}`;
  };

  // Renderizar información de un vuelo
  const renderFlightInfo = (vuelo, label, icon) => (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="caption" color="primary" fontWeight="bold">
          {icon} {label}
        </Typography>
      </Stack>
      
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h6">{vuelo.airline}</Typography>
          <Typography variant="caption" color="text.secondary">
            {vuelo.numeroVuelo}
          </Typography>
        </Box>

        <Box flex={1} textAlign="center">
          <Typography variant="body1" fontWeight="medium">
            {vuelo.from} → {vuelo.to}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {vuelo.departTime} - {vuelo.arriveTime}
          </Typography>
          {vuelo.fechaSalida && (
            <Typography variant="caption" color="text.secondary" display="block">
              📅 {utilidades.formatearFecha(vuelo.fechaSalida)}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            Duración: {formatDuration(vuelo.duracion)}
          </Typography>
          {vuelo.fromCode && vuelo.toCode && (
            <Typography variant="caption" color="text.secondary" display="block">
              {vuelo.fromCode} → {vuelo.toCode}
            </Typography>
          )}
        </Box>

        <Box textAlign="right">
          <Typography variant="h6" color="primary">
            {formatPrice(vuelo.price, vuelo.currency)}
          </Typography>
          <Stack direction="row" spacing={1}>
            {vuelo.direct ? (
              <Chip size="small" color="success" label="Directo" />
            ) : (
              <Chip size="small" color="warning" label="Con escalas" />
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Card 
      variant="outlined"
      sx={{
        backgroundColor: isSelected ? 'primary.50' : 'transparent',
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 2,
          borderColor: 'primary.light'
        }
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* Vuelo de Ida */}
          {renderFlightInfo(departure, 'Vuelo de Ida', '🛫')}
          
          {/* Vuelo de Vuelta (si existe) */}
          {returnFlight && (
            <>
              <Divider sx={{ my: 2 }} />
              {renderFlightInfo(returnFlight, 'Vuelo de Vuelta', '🛬')}
            </>
          )}
          
          {/* Precio Total y Botón */}
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {formatPrice(flight.totalPrice, flight.currency)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Precio total {tripType === 'roundtrip' ? '(ida y vuelta)' : ''}
              </Typography>
              {returnFlight && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Ida: {formatPrice(departure.price, departure.currency)} + 
                  Vuelta: {formatPrice(returnFlight.price, returnFlight.currency)}
                </Typography>
              )}
            </Box>
            
            <Button
              variant={isSelected ? "outlined" : "contained"}
              color={isSelected ? "success" : "primary"}
              onClick={onSelectFlight}
              sx={{ 
                minWidth: 140,
                height: 48,
                fontSize: '1rem'
              }}
            >
              {isSelected ? "✓ Seleccionado" : "Seleccionar"}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

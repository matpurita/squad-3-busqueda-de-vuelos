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
    return `$${parseInt(price)} ${currency}`;
  };

  // Renderizar información de un vuelo
  const renderFlightInfo = (vuelo, label, icon) => (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontSize: '0.7rem',
          }}
        >
          {icon} {label}
        </Typography>
      </Stack>
      
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Box sx={{ minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box 
    sx={{ 
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      mb: 0.2 
    }}
  >
    <Box
      component="img"
      src={`/images/${vuelo.airlineCode}.png`}
      alt={vuelo.airline}
      sx={{ 
        borderRadius: 1, 
        width: 55,
        mr: 0
      }}
    />
    
    <Typography 
      variant="subtitle1" 
      sx={{ fontWeight: 600, color: 'primary.main' }}
    >
      {vuelo.airline}
    </Typography>
  </Box>

          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
            {vuelo.numeroVuelo}
          </Typography>
        </Box>

        <Box flex={1} textAlign="center">
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
            {vuelo.from} → {vuelo.to}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            {vuelo.departTime} - {vuelo.arriveTime}
          </Typography>
          {vuelo.fechaSalida && (
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontSize: '0.75rem' }}>
              {utilidades.formatearFecha(vuelo.fechaSalida)}
            </Typography>
          )}
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
            Duración: {formatDuration(vuelo.duracion)}
          </Typography>
          {vuelo.fromCode && vuelo.toCode && (
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontSize: '0.7rem' }}>
              {vuelo.fromCode} → {vuelo.toCode}
            </Typography>
          )}
        </Box>

        <Box textAlign="right" sx={{ minWidth: 100 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {formatPrice(vuelo.price, vuelo.currency)}
          </Typography>
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" mt={0.5}>
            {vuelo.direct ? (
              <Chip 
                size="small" 
                label="Directo" 
                sx={{ 
                  backgroundColor: 'action.hover',
                  color: 'primary.main',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            ) : (
              <Chip 
                size="small" 
                label="Escalas" 
                sx={{ 
                  backgroundColor: 'action.hover',
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
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
        backgroundColor: isSelected ? 'action.hover' : 'background.paper',
        border: isSelected ? '1.5px solid' : '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderRadius: 1,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: isSelected ? 'primary.main' : 'text.disabled',
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2.5}>
          {/* Vuelo de Ida */}
          {renderFlightInfo(departure, 'Vuelo de Ida', '✈')}
          
          {/* Vuelo de Vuelta (si existe) */}
          {returnFlight && (
            <>
              <Divider sx={{ borderColor: 'divider' }} />
              {renderFlightInfo(returnFlight, 'Vuelo de Vuelta', '✈')}
            </>
          )}
          
          {/* Precio Total y Botón */}
          <Divider sx={{ borderColor: 'divider' }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'primary.main',
                  mb: 0.5,
                }}
              >
                {formatPrice(flight.totalPrice, flight.currency)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
                Precio total {tripType === 'roundtrip' ? '(ida y vuelta)' : ''}
              </Typography>
              {returnFlight && (
                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', fontSize: '0.7rem' }}>
                  Ida: {formatPrice(departure.price, departure.currency)} + 
                  Vuelta: {formatPrice(returnFlight.price, returnFlight.currency)}
                </Typography>
              )}
            </Box>
            
            <Button
              variant={isSelected ? "contained" : "outlined"}
              onClick={onSelectFlight}
              sx={{ 
                minWidth: 140,
                height: 44,
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                borderRadius: 1,
                borderWidth: '1.5px',
                ...(isSelected ? {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  }
                } : {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderWidth: '1.5px',
                    backgroundColor: 'action.hover',
                    borderColor: 'primary.main',
                  }
                })
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

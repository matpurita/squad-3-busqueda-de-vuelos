import {
  Stack,
  Typography,
  Chip,
  Button,
  Box,
  Alert,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';

export default function FlightDetail({ flight, user, reservarVuelo, bookingFlights }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isFlightBooked = (vuelo) => {
  if (!vuelo) return false;
  return bookingFlights?.some(b => b?.id === vuelo.id);
};

  if (!flight) return null;
  const { ida, vuelta } = flight;


  const idaBooked = isFlightBooked(ida);
const vueltaBooked = isFlightBooked(vuelta);

// si es solo ida
const soloIda = ida && !vuelta;

// si es ida y vuelta
const idaYVuelta = ida && vuelta;


  return (
    
    <Stack spacing={3} padding={{ xs: 2, md: 3 }}>
      {ida && (
        <>
          {/* Encabezado para el vuelo de ida */}
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 600,
              color: '#1a1a1a',
              letterSpacing: '-0.01em',
            }}
          >
            Vuelo de Ida
          </Typography>

        </>
      )}


      {ida && (
        <>
          {/* Fecha destacada para el vuelo de ida */}
          <Box 
            sx={{ 
              textAlign: 'center',
              backgroundColor: '#f5f5f5',
              color: '#1a1a1a',
              borderRadius: 1,
              py: 1.5,
              px: 2,
              mb: 2,
              border: '1px solid #e6e6e6',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }} data-testid="fecha-salida">
              {formatearFecha(ida?.fechaSalida)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666666', fontSize: '0.75rem' }}>
              Fecha de Salida
            </Typography>
          </Box>

          <Stack spacing={2} alignItems="center">
            <Box textAlign={"center"}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                {ida?.airline}
              </Typography>
              <Typography variant="caption" sx={{ color: '#999999', fontSize: '0.75rem' }} data-testid="numero-vuelo">
                {ida?.numeroVuelo}
              </Typography>
            </Box>
            {ida?.direct && (
              <Chip 
                size="small" 
                label="Directo" 
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  color: '#1a1a1a',
                  fontWeight: 500,
                }}
              />
            )}
            {!ida?.direct && (
              <Chip 
                size="small" 
                label="Con escalas" 
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  color: '#666666',
                  fontWeight: 500,
                }}
              />
            )}
          </Stack>

          <Stack direction="column" spacing={2} alignItems="center">
            <Box textAlign={"center"}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                {ida?.from} → {ida?.to}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                {ida?.departTime} - {ida?.arriveTime}
              </Typography>
              <Typography variant="caption" sx={{ color: '#999999', fontSize: '0.75rem' }}>
                Duración: {ida?.duracion}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="column" spacing={2} alignItems="center">
            <Box textAlign="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                {ida?.clase}
              </Typography>
            </Box>
          </Stack>
        </>
      )}
        

      {vuelta && (
        <>
          {/* Encabezado para el vuelo de vuelta */}
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 600,
              color: '#1a1a1a',
              letterSpacing: '-0.01em',
              mt: 2,
            }}
          >
            Vuelo de Regreso
          </Typography>
          
          {/* Fecha destacada para el vuelo de vuelta */}
          <Box 
            sx={{ 
              textAlign: 'center',
              backgroundColor: '#f5f5f5',
              color: '#1a1a1a',
              borderRadius: 1,
              py: 1.5,
              px: 2,
              mb: 2,
              border: '1px solid #e6e6e6',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatearFecha(vuelta?.fechaSalida)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666666', fontSize: '0.75rem' }}>
              Fecha de Regreso
            </Typography>
          </Box>
          
          <Stack spacing={2} alignItems="center">
            <Box textAlign={"center"}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                {vuelta?.airline}
              </Typography>
              <Typography variant="caption" sx={{ color: '#999999', fontSize: '0.75rem' }}>
                {vuelta?.numeroVuelo}
              </Typography>
            </Box>
            {vuelta?.direct && (
              <Chip 
                size="small" 
                label="Directo" 
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  color: '#1a1a1a',
                  fontWeight: 500,
                }}
              />
            )}
            {!vuelta?.direct && (
              <Chip 
                size="small" 
                label="Con escalas" 
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  color: '#666666',
                  fontWeight: 500,
                }}
              />
            )}
          </Stack>

          <Stack direction="column" spacing={2} alignItems="center">
            <Box textAlign={"center"}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                {vuelta?.from} → {vuelta?.to}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                {vuelta?.departTime} - {vuelta?.arriveTime}
              </Typography>
              <Typography variant="caption" sx={{ color: '#999999', fontSize: '0.75rem' }}>
                Duración: {vuelta?.duracion}
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="column" spacing={2} alignItems="center">
            <Box textAlign="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                {vuelta?.clase}
              </Typography>
            </Box>
          </Stack>
        </>
      )}

       {/* Leyenda para usuarios no logueados */}
      {!user && (
        <Alert 
          severity="info" 
          sx={{ 
            textAlign: "center",
            borderRadius: 1,
            border: '1px solid #e6e6e6',
            backgroundColor: '#f5f5f5',
            color: '#1a1a1a',
            '& .MuiAlert-icon': {
              color: '#1a1a1a',
            },
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
            Para agendar este vuelo debes iniciar sesión
          </Typography>
          <MuiLink 
            component={RouterLink} 
            to="/login"
            sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              textDecoration: 'none',
              fontWeight: 600,
              color: '#1a1a1a',
              '&:hover': {
                opacity: 0.7,
              }
            }}
          >
            <LoginIcon fontSize="small" />
            Iniciar Sesión
          </MuiLink>
        </Alert>
      )}
      <Button
        disabled={
    loading ||
    success ||
    (!user) ||
    (soloIda && idaBooked) ||
    (idaYVuelta && idaBooked && vueltaBooked)
  }
        variant="contained"
        sx={{ 
          minWidth: 120,
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          fontWeight: 600,
          letterSpacing: '0.02em',
          borderRadius: 1,
          py: 1.5,
          '&:hover': {
            backgroundColor: '#404040',
          },
          '&:disabled': {
            backgroundColor: '#d9d9d9',
            color: '#999999',
          },
        }}
        onClick={async () => {
          setLoading(true);
          setError(null);
          setSuccess(false);
          try {
            await reservarVuelo(ida, vuelta);
            setSuccess(true);
          } catch (error) {
            setError('Error al reservar vuelo');
          } finally {
            setLoading(false);
          }
        }}
      >
        {vuelta ? "Agendar Vuelos" : "Agendar Vuelo"}
        {loading && <CircularProgress size={20} sx={{ ml: 1, color: '#ffffff' }} />}
      </Button>
      { success && (
        <Alert 
          severity="success"
          sx={{ 
            borderRadius: 1,
            border: '1px solid #e6e6e6',
            backgroundColor: '#f5f5f5',
            color: '#1a1a1a',
          }}
        >
          Vuelo{vuelta ? 's' : ''} agendado{vuelta ? 's' : ''} con éxito.
        </Alert>
      ) }
      { error && (
        <Alert 
          severity="error"
          sx={{ 
            borderRadius: 1,
            border: '1px solid #e6e6e6',
            backgroundColor: '#fafafa',
            color: '#1a1a1a',
          }}
        >
          {error}
        </Alert>
      )

      }
    </Stack>
  
  );
}

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-AR");
}

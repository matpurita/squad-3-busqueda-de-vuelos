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
    
    <Stack spacing={2} padding={8}>
      {ida && (
        <>
          {/* Encabezado para el vuelo de ida */}
          <Typography variant="h5" color="primary" textAlign="center" fontWeight="bold">
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
              backgroundColor: 'grey.100',
              color: 'text.primary',
              borderRadius: 1,
              py: 1,
              px: 2,
              mb: 2,
              border: '1px solid',
              borderColor: 'grey.300'
            }}
          >
            <Typography variant="body1" fontWeight="medium" data-testid="fecha-salida">
              {formatearFecha(ida?.fechaSalida)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Fecha de Salida
            </Typography>
          </Box>

          <Stack spacing={2} alignItems="center">
            <Box textAlign={"center"}>
              <Typography variant="h6">{ida?.airline}</Typography>
              <Typography variant="caption" color="text.secondary" data-testid="numero-vuelo">
                {ida?.numeroVuelo}
              </Typography>
            </Box>
            {ida?.direct && <Chip size="small" color="success" label="Directo" />}
            {!ida?.direct && (
              <Chip size="small" color="warning" label="Con escalas" />
            )}
          </Stack>

          <Stack direction="column" spacing={2} alignItems="center">
            <Box textAlign={"center"}>
              <Typography variant="body1" fontWeight="medium">
                {ida?.from} → {ida?.to}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ida?.departTime} - {ida?.arriveTime}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Duración: {ida?.duracion}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="column" spacing={2} alignItems="center">
            <Box textAlign="center">
              <Typography variant="h6" color="primary">
                {ida?.clase}
              </Typography>
            </Box>
          </Stack>
        </>
      )}
        

      {vuelta && (
        <>
          {/* Encabezado para el vuelo de vuelta */}
          <Typography variant="h5" color="primary" textAlign="center" fontWeight="bold" sx={{ mt: 4 }}>
            Vuelo de Regreso
          </Typography>
          
          {/* Fecha destacada para el vuelo de vuelta */}
          <Box 
            sx={{ 
              textAlign: 'center',
              backgroundColor: 'grey.100',
              color: 'text.primary',
              borderRadius: 1,
              py: 1,
              px: 2,
              mb: 2,
              border: '1px solid',
              borderColor: 'grey.300'
            }}
          >
            <Typography variant="body1" fontWeight="medium">
              {formatearFecha(vuelta?.fechaSalida)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Fecha de Regreso
            </Typography>
          </Box>
          
          <Stack spacing={2} alignItems="center">
            <Box textAlign={"center"}>
              <Typography variant="h6">{vuelta?.airline}</Typography>
              <Typography variant="caption" color="text.secondary">
                {vuelta?.numeroVuelo}
              </Typography>
            </Box>
            {vuelta?.direct && <Chip size="small" color="success" label="Directo" />}
            {!vuelta?.direct && (
              <Chip size="small" color="warning" label="Con escalas" />
            )}
          </Stack>

          <Stack direction="column" spacing={2} alignItems="center">
            <Box textAlign={"center"}>
              <Typography variant="body1" fontWeight="medium">
                {vuelta?.from} → {vuelta?.to}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vuelta?.departTime} - {vuelta?.arriveTime}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Duración: {vuelta?.duracion}
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="column" spacing={2} alignItems="center">
            <Box textAlign="center">
              <Typography variant="h6" color="primary">
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
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          <Typography variant="body2" gutterBottom>
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
              fontWeight: 'medium',
              '&:hover': {
                textDecoration: 'underline'
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
        sx={{ minWidth: 120 }}
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
        {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
      </Button>
      { success && (
        <Alert severity="success">
          Vuelo{vuelta ? 's' : ''} agendado{vuelta ? 's' : ''} con éxito.
        </Alert>
      ) }
      { error && (
        <Alert severity="error">
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

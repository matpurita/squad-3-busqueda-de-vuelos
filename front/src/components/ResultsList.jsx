import { Card, CardContent, Stack, Typography, Chip, Button, Box, Alert, CircularProgress } from '@mui/material';
import { utilidades } from '../services';
import { useFlights } from '../contexts/FlightsContext';

export default function ResultsList() {
  const { vuelos, loading, error, searchPerformed, selectFlight } = useFlights();

  // Mostrar mensaje de carga
  if (loading) {
    return (
      <Stack alignItems="center" spacing={2}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Buscando vuelos...
        </Typography>
      </Stack>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // Mostrar mensaje si no se ha realizado búsqueda
  if (!searchPerformed) {
    return (
      <Typography variant="body2" color="text.secondary">
        Realiza una búsqueda para ver los resultados.
      </Typography>
    );
  }

  // Mostrar mensaje si no hay resultados
  if (!vuelos.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No se encontraron vuelos. Prueba con otros criterios de búsqueda.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {vuelos.map((r) => (
        <Card key={r.uuid} variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Box>
                  <Typography variant="h6">{r.airline}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {r.numeroVuelo}
                  </Typography>
                </Box>
                {r.direct && <Chip size="small" color="success" label="Directo" />}
                {!r.direct && <Chip size="small" color="warning" label="Con escalas" />}
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {r.from} → {r.to}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {r.departTime} - {r.arriveTime}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Duración: {r.duracion}
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Box textAlign="right">
                  <Typography variant="h6" color="primary">
                    {utilidades.formatearPrecio(r.price)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    por pasajero
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  onClick={() => selectFlight(r)}
                  sx={{ minWidth: 120 }}
                >
                  Seleccionar
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}




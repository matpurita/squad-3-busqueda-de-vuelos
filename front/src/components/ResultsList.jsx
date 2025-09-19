import {
  Stack,
  Typography,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useFlights } from "../contexts/FlightsContext";
import Flight from "./Flight";

export default function ResultsList() {
  const { vuelos, loading, error, searchPerformed, } =
    useFlights();
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
  if (vuelos.vuelosIda.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No se encontraron vuelos. Prueba con otros criterios de búsqueda.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Chip label="Vuelos Ida" />
      {vuelos.vuelosIda.map((r) => (
        <Flight key={r.uuid} flight={r} />
      ))}
      {vuelos.vuelosRegreso.length > 0 && (
        <>
          <Chip label="Vuelos Regreso" />
          {vuelos.vuelosRegreso.map((r) => (
            <Flight key={r.uuid} flight={r} />
          ))}
        </>
      )}
    </Stack>
  );
}

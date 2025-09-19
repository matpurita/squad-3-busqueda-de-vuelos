import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  Button,
  Box,
} from "@mui/material";
import { useFlights } from "../contexts/FlightsContext";

export default function Flight({ flight, flightType }) {
  const { selectFlight, selectedFlight } = useFlights();
  
  // Verificar si este vuelo está seleccionado
  const isSelected = selectedFlight && 
    ((flightType === "ida" && selectedFlight.ida?.uuid === flight.uuid) ||
     (flightType === "vuelta" && selectedFlight.vuelta?.uuid === flight.uuid));
  
  const onSelectFlight = (flight, flightType) => {
    if (flightType === "ida") {
      selectFlight(flight);
    } else if (flightType === "vuelta") {
      selectFlight(null, flight);
    }
  };

  return (
    <Card 
      variant="outlined"
      sx={{
        backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        border: isSelected ? '1px solid rgba(0, 0, 0, 0.1)' : undefined
      }}
    >
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box>
              <Typography variant="h6">{flight.airline}</Typography>
              <Typography variant="caption" color="text.secondary">
                {flight.numeroVuelo}
              </Typography>
            </Box>
            {flight.direct && (
              <Chip size="small" color="success" label="Directo" />
            )}
            {!flight.direct && (
              <Chip size="small" color="warning" label="Con escalas" />
            )}
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {flight.from} → {flight.to}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flight.departTime} - {flight.arriveTime}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Duración: {flight.duracion}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Box textAlign="right">
              <Typography variant="h6" color="primary">
                {flight.price}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                por pasajero
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => onSelectFlight(flight, flightType)}
              sx={{ minWidth: 120 }}
            >
              Seleccionar
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

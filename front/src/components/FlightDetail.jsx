import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  Button,
  Box,
} from "@mui/material";

export default function FlightDetail({ flight }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          spacing={2}
        >
          <Stack spacing={2} alignItems="center">
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
              sx={{ minWidth: 120 }}
              onClick={() => alert('Reserva realizada con exito')}
            >
              Reservar
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

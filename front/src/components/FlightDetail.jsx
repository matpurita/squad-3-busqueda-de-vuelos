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
  if (!flight) return null;
  const { ida, vuelta } = flight;
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
      <Stack spacing={2} alignItems="center">
        <Box textAlign={"center"}>
          <Typography variant="h6">{ida?.airline}</Typography>
          <Typography variant="caption" color="text.secondary">
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
        </>
      )}
      {vuelta && (
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
      )}
      
      {vuelta && (
        <Stack direction="column" spacing={2} alignItems="center">
          <Box textAlign="center">
            <Typography variant="h6" color="primary">
              {vuelta?.clase}
            </Typography>
          </Box>
        </Stack>
      )}
      <Button
        variant="contained"
        sx={{ minWidth: 120 }}
        onClick={() => alert("Reserva realizada con exito")}
      >
        Reservar
      </Button>
    </Stack>
  
  );
}

import { useState } from "react";
import {
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
  Collapse,
  Box,
  Button,
} from "@mui/material";

/**
 * Recibe: { flight: { airline, flightNumber, origin, destination, departure, arrival, price?, cabinClass? } }
 */
export default function FlightCard({ data }) {
  const [open, setOpen] = useState(false);
  const f = data.flight;

  const fmt = (d) =>
    new Date(d).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <Paper className="result-card" elevation={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {f.airline?.name} {f.flightNumber}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {f.origin?.city} ({f.origin?.code}) → {f.destination?.city} ({f.destination?.code})
          </Typography>
        </div>

        {/* Cartel RESERVAR */}
        <Chip
          label="RESERVAR"
          onClick={() => setOpen((v) => !v)}
          sx={{
            cursor: "pointer",
            fontWeight: "bold",
            color: "#fff",
            background: "linear-gradient(135deg, #507BD8 0%, #1E3C72 100%)",
            "&:hover": { opacity: 0.95 },
            px: 1.5,
            py: 2,
            borderRadius: "10px",
          }}
        />
      </Stack>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: "#f5f8ff",
            border: "1px solid #e2e9fb",
          }}
        >
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ color: "#222", opacity: 0.8 }}>
              Detalle de tu vuelo
            </Typography>

            <Typography variant="body2">
              <strong>Salida:</strong> {fmt(f.departure)}
            </Typography>
            <Typography variant="body2">
              <strong>Llegada:</strong> {fmt(f.arrival)}
            </Typography>
            {f.cabinClass && (
              <Typography variant="body2">
                <strong>Clase:</strong> {f.cabinClass}
              </Typography>
            )}
            {f.price && (
              <Typography variant="body2">
                <strong>Precio:</strong> {f.price}
              </Typography>
            )}

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
              {/* Botón COMPRAR (solo visual) */}
              <Button
                variant="contained"
                onClick={(e) => e.preventDefault()}
                sx={{
                  background: "linear-gradient(135deg, #507BD8 0%, #1E3C72 100%)",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                }}
              >
                Comprar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
}

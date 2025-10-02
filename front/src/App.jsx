import { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import SearchForm from "./components/SearchForm";
import FlightCard from "./components/FlightCard";
import "./App.css";

function App() {
  const [results, setResults] = useState([]);

  const handleResults = (data) => {
    setResults(data?.results || []);
  };

  // MOCK temporal para visualizar tarjetas (se usa si no hay resultados reales)
  const mockResults = [
    {
      flight: {
        airline: { name: "Sky Airlines" },
        flightNumber: "SK123",
        origin: { city: "Buenos Aires", code: "EZE" },
        destination: { city: "New York", code: "JFK" },
        departure: "2025-09-25T12:30:00Z",
        arrival: "2025-09-25T20:00:00Z",
        cabinClass: "Económica",
        price: "USD 820",
      },
    },
    {
      flight: {
        airline: { name: "AeroTravel" },
        flightNumber: "AT456",
        origin: { city: "Madrid", code: "MAD" },
        destination: { city: "Roma", code: "FCO" },
        departure: "2025-09-26T08:15:00Z",
        arrival: "2025-09-26T10:30:00Z",
        cabinClass: "Premium",
        price: "EUR 210",
      },
    },
  ];

  return (
    <Box>
      {/* HEADER con degradado + logo (usa la imagen en /public/skytrack-logo.jpeg) */}
     {/* HEADER con degradado + logo */}
<Box
  sx={{
    width: "100vw",   // 👉 ocupa todo el ancho de la ventana
    position: "relative",
    left: "50%",
    right: "50%",
    marginLeft: "-50vw",   // 👉 hack para que realmente se expanda al 100%
    marginRight: "-50vw",
    background: "linear-gradient(90deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    color: "white",
    py: 6,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  }}
>
  <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
    <Box
      component="img"
      src="/skytrack-logo.jpeg"
      alt="SkyTrack Logo"
      sx={{ width: 60, height: 60, borderRadius: 12 }}
    />
    <Box textAlign="left">
      <Typography variant="h3" sx={{ fontWeight: "bold", fontFamily: "Roboto" }}>
        Reservá tu próximo vuelo
      </Typography>
      <Typography variant="subtitle1" sx={{ fontFamily: "Roboto", fontWeight: 400 }}>
        Rápido, seguro y al mejor precio
      </Typography>
    </Box>
  </Stack>
</Box>


      {/* FORMULARIO */}
      <SearchForm onResults={handleResults} />

      {/* RESULTADOS */}
      <Stack spacing={2} sx={{ mt: 4, alignItems: "center", width: "100%" }}>
        {(results.length > 0 ? results : mockResults).map((r, i) => (
          <FlightCard key={i} data={r} />
        ))}
      </Stack>
    </Box>
  );
}

export default App;

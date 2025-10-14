import {
  Grid,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Switch,
  Autocomplete,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  InputAdornment,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import ClassIcon from "@mui/icons-material/Class";
import { useSearch } from "../contexts/SearchContext";
import { useFlights } from "../contexts/FlightsContext";

export default function SearchForm({ onResults }) {
  const {
    tripType,
    from,
    to,
    departDate,
    returnDate,
    adults,
    flexibleDates,
    aeropuertos,
    loading: aeropuertosLoading,
    setTripType,
    setFrom,
    setTo,
    setDepartDate,
    setReturnDate,
    setAdults,
    setFlexibleDates,
    getSearchCriteria,
    isSearchValid,
    selectedClass,
    setSelectedClass,
  } = useSearch();

  const { searchFlights, loading: searchLoading } = useFlights();

  // 🗓️ Utilidades para fechas
  const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  // 🚀 Manejar cambio de fecha de ida con validaciones
  const handleDepartDateChange = (newDate) => {
    setDepartDate(newDate);
    
    // Si la fecha de vuelta es anterior a la nueva fecha de ida, actualizarla
    if (returnDate && newDate && returnDate < newDate) {
      setReturnDate(newDate);
    }
  };

  // 🚀 Manejar cambio de fecha de vuelta con validaciones
  const handleReturnDateChange = (newDate) => {
    // Solo permitir fechas >= fecha de ida
    if (departDate && newDate && newDate >= departDate) {
      setReturnDate(newDate);
    } else if (!departDate) {
      // Si no hay fecha de ida, permitir cualquier fecha >= hoy
      if (newDate >= today) {
        setReturnDate(newDate);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const criteria = getSearchCriteria();
      const data = await searchFlights(criteria);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      alert(error.message);
    }
  };

  const loading = aeropuertosLoading || searchLoading;

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 1200,
        margin: "40px auto",
        padding: 4,
        borderRadius: 5,
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* TOGGLE BUTTONS */}
        <ToggleButtonGroup
          exclusive
          value={tripType}
          onChange={(_, v) => v && setTripType(v)}
          sx={{ mb: 3, width: "100%" }}
        >
          <ToggleButton
            value="oneway"
            sx={{
              flex: 1,
              fontWeight: "bold",
              "&.Mui-selected": {
                backgroundColor: "#507BD8",
                color: "white",
              },
            }}
          >
            SOLO IDA
          </ToggleButton>
          <ToggleButton
            value="roundtrip"
            sx={{
              flex: 1,
              fontWeight: "bold",
              "&.Mui-selected": {
                backgroundColor: "#507BD8",
                color: "white",
              },
            }}
          >
            IDA Y VUELTA
          </ToggleButton>
        </ToggleButtonGroup>

        {/* CAMPOS */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={from}
              onChange={(_, v) => setFrom(v)}
              options={aeropuertos}
              getOptionLabel={(o) => o.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Desde"
                  required
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlightTakeoffIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={to}
              onChange={(_, v) => setTo(v)}
              options={aeropuertos}
              getOptionLabel={(o) => o.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Hacia"
                  required
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlightLandIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Salida"
              type="date"
              value={departDate}
              onChange={(e) => handleDepartDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              inputProps={{
                min: today, // ✅ Solo fechas desde hoy en adelante
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {tripType === "roundtrip" && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Regreso"
                type="date"
                value={returnDate}
                onChange={(e) => handleReturnDateChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                inputProps={{
                  min: departDate || today, // ✅ Mínimo: fecha de ida o hoy
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon />
                    </InputAdornment>
                  ),
                }}
                helperText={departDate ? `Debe ser ${departDate} o posterior` : "Selecciona primero la fecha de ida"}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label="Adultos"
              value={adults}
              onChange={(e) => setAdults(parseInt(e.target.value || "1", 10))}
              inputProps={{ min: 1 }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="label-class">Clase</InputLabel>
              <Select
                labelId="label-class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <ClassIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="economy">Económica</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="business">Business</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <FormControlLabel
          control={
            <Switch
              checked={flexibleDates}
              onChange={(e) => setFlexibleDates(e.target.checked)}
            />
          }
          label="Fechas flexibles"
          sx={{ mt: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !isSearchValid()}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          fullWidth
          sx={{
            mt: 3,
            background: "linear-gradient(135deg, #507BD8, #2a6f97)",
            fontWeight: "bold",
            fontSize: "16px",
            color: "white",
            borderRadius: "10px",
            padding: "12px",
          }}
        >
          {loading ? "Buscando..." : "Buscar vuelo"}
        </Button>
      </form>
    </Paper>
  );
}

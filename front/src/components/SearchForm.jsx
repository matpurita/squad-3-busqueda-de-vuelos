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
    onlyDirect,
    aeropuertos,
    loading: aeropuertosLoading,
    setTripType,
    setFrom,
    setTo,
    setDepartDate,
    setReturnDate,
    setAdults,
    setOnlyDirect,
    getSearchCriteria,
    isSearchValid,
    selectedClass,
    setSelectedClass,
  } = useSearch();

  const { searchFlights, loading: searchLoading } = useFlights();

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
              onChange={(e) => setDepartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
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
                onChange={(e) => setReturnDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon />
                    </InputAdornment>
                  ),
                }}
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
              checked={onlyDirect}
              onChange={(e) => setOnlyDirect(e.target.checked)}
            />
          }
          label="Solo directos"
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

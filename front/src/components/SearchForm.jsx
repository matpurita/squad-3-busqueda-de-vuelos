import {
  Stack,
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
} from "@mui/material";
import { useSearch } from "../contexts/SearchContext";
import { useFlights } from "../contexts/FlightsContext";

export default function SearchForm() {
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
    economy,
    premium,
    business,

  } = useSearch();

  const { searchFlights, loading: searchLoading } = useFlights();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSearchValid()) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      const criteria = getSearchCriteria();
      await searchFlights(criteria);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      alert(error.message);
    }
  };

  const loading = aeropuertosLoading || searchLoading;

  return (
    <Stack 
      component="form"
      onSubmit={handleSubmit}
      spacing={2}
      direction={{ xs: "column", lg: "row" }}
      alignItems="center"
    >
      <ToggleButtonGroup
        size="small"
        exclusive
        value={tripType}
        onChange={(_, v) => v && setTripType(v)}
      >
        <ToggleButton value="oneway">Solo ida</ToggleButton>
        <ToggleButton value="roundtrip">Ida y vuelta</ToggleButton>
      </ToggleButtonGroup>

      <Autocomplete
        value={from}
        onChange={(_, v) => setFrom(v)}
        options={aeropuertos}
        getOptionLabel={(o) => o.label}
        sx={{ minWidth: 220 }}
        renderInput={(params) => (
          <TextField {...params} label="Desde" required />
        )}
        loading={aeropuertosLoading}
      />

      <Autocomplete
        value={to}
        onChange={(_, v) => setTo(v)}
        options={aeropuertos}
        getOptionLabel={(o) => o.label}
        sx={{ minWidth: 220 }}
        renderInput={(params) => (
          <TextField {...params} label="Hacia" required />
        )}
        loading={aeropuertosLoading}
      />

      <TextField fullWidth
        label="Salida"
        type="date"
        value={departDate}
        onChange={(e) => setDepartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      {tripType === "roundtrip" && (
        <TextField 
          label="Regreso"
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      )}

      <TextField fullWidth
        type="number"
        label="Adultos"
        value={adults}
        onChange={(e) => setAdults(parseInt(e.target.value || "1", 10))}
        inputProps={{ min: 1 }}
        
       
      />
      <FormControl fullWidth>
        <InputLabel id="label-class">Class</InputLabel>
        <Select labelId="label-class" id="demo-simple-select" label="Clase">
          <MenuItem value={economy}>Economy</MenuItem>
          <MenuItem value={premium}>Premium Economy</MenuItem>
          <MenuItem value={business}>Business</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel 
        control={
          <Switch
            checked={onlyDirect}
            onChange={(e) => setOnlyDirect(e.target.checked)}
          />
        }
        label="Solo directos"
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading || !from || !to}
        startIcon={loading ? <CircularProgress size={16} /> : null}
      >
        {loading ? "Buscando..." : "Buscar"}
      </Button>
    </Stack>
  );
}

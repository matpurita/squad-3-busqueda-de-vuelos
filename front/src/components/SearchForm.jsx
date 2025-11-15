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
  Paper,
  InputAdornment,
  Alert
} from "@mui/material";
import { DatePicker  } from "@mui/x-date-pickers";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import { useSearch } from "../contexts/SearchContext";
import { useFlights } from "../contexts/FlightsContext";
import { config } from "../config";
import { useState } from "react";

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
    error: searchAirportError,
  } = useSearch();

  const [departDateError, setDepartDateError] = useState("");
  const [returnDateError, setReturnDateError] = useState("");
  const [adultsError, setAdultsError] = useState("");

  const { searchFlights, loading: searchLoading, error:searchError } = useFlights();
  const loading = aeropuertosLoading || searchLoading;


  const aeropuertosDeparture = to ? aeropuertos.filter((a) => a.code !== to.code) : aeropuertos;
  const aeropuertosArrival = from ? aeropuertos.filter((a) => a.code !== from.code) : aeropuertos;

  const today = dayjs();

  // 🔁 Función para resaltar días
  const getDayProps = (date, selectedDate) => {
    if (!selectedDate) return {};
    if (date.isSame(selectedDate, "day")) {
      return {
        sx: {
          bgcolor: config.THEME.SECONDARY_COLOR,
          color: config.THEME.SURFACE_COLOR,
          "&:hover": { bgcolor: config.THEME.SECONDARY_COLOR },
          borderRadius: "50%",
        },
      };
    }
    return {};
  };

  const handleDepartChange = (newValue) => {
  // ⛔ No convertir a string todavía
  // ✔ Guardar directamente el objeto o null
  setDepartDate(newValue);

  // Si hay regreso previo y queda antes de la salida → ajustarlo
 // if (
 //   tripType === "roundtrip" &&
 //   returnDate &&
 //   newValue &&
 //   dayjs(returnDate).isBefore(newValue)
  //) {
  //  setReturnDate(newValue);
  //}
};

  const handleReturnChange = (newValue) => {
    //const formatted = newValue ? newValue.format("YYYY-MM-DD") : null;
    setReturnDate(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const criteria = getSearchCriteria();
      await searchFlights(criteria);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      alert(error.message);
    }
  };
  console.log("Adults error:", adultsError);
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
        {/* 🚨 Alert de error */}
        {(searchError || searchAirportError) && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2
            }}
            onClose={() => {
              // Si tienes una función clearError en FlightsContext, úsala aquí
              // clearSearchError();
            }}
          > <strong>Error en la búsqueda:</strong> {searchError || searchAirportError}
          </Alert>
        )}
        {/* 🔘 Tipo de viaje */}
        <ToggleButtonGroup
          exclusive
          value={tripType}
          onChange={(_, v) => {
            
            v && setTripType(v)
            v === "oneway" && setReturnDate(null);
          }}
          sx={{ mb: 3, width: "100%" }}
        >
          <ToggleButton
            value="oneway"
            color="primary"
            sx={{
              flex: 1,
              fontWeight: "500",
              "&.Mui-selected": {
                backgroundColor: config.THEME.PRIMARY_COLOR,
                color: config.THEME.SURFACE_COLOR,
                opacity: 0.8,
                 "&:hover": {
                  backgroundColor: config.THEME.PRIMARY_COLOR,
                },
              },
            }}
          >
            SOLO IDA
          </ToggleButton>
          <ToggleButton
            value="roundtrip"
            color="primary"
            sx={{
              flex: 1,
              fontWeight: "500",
              "&.Mui-selected": {
                backgroundColor: config.THEME.PRIMARY_COLOR,
                color: config.THEME.SURFACE_COLOR,
                opacity: 0.8,
                "&:hover": {
                  backgroundColor: config.THEME.PRIMARY_COLOR,
                },
              },
             
            }}
          >
            IDA Y VUELTA
          </ToggleButton>
        </ToggleButtonGroup>

        <Grid container spacing={2}>
          {/* 🛫 Aeropuerto origen */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={from}
              onChange={(_, v) => setFrom(v)}
              options={aeropuertosDeparture}
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

          {/* 🛬 Aeropuerto destino */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={to}
              onChange={(_, v) => setTo(v)}
              options={aeropuertosArrival}
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

          {/* 🗓️ Fecha de salida */}
          <Grid item xs={12} sm={6}>
            <DatePicker
  label="Salida"
  value={departDate ? departDate : null}
  minDate={today}
  onChange={handleDepartChange}
  format="DD/MM/YYYY"
  onError={(reason) => {
    if (reason === "minDate") {
      setDepartDateError("La fecha no puede ser anterior a hoy");
    } else if (reason) {
      setDepartDateError("Fecha inválida");
    } else {
      setDepartDateError("");
    }
  }}
  slotProps={{
    textField: {
      fullWidth: true,
      required: true,
      error: Boolean(departDateError),       // 🔥 Estado de error
      helperText: departDateError || "",     // 🔥 Texto debajo del input
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <EventIcon />
          </InputAdornment> 
        ),
      },
    },
  }}
  renderDay={(date, _value, DayComponentProps) => {
    const props = getDayProps(date, returnDate ? dayjs(returnDate) : null);
    return <PickersDay {...DayComponentProps} {...props} />;
  }}
/>
          </Grid>

          {/* 🗓️ Fecha de regreso */}
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Regreso"
              value={returnDate ? returnDate : null}
              minDate={departDate ? dayjs(departDate) : today}
              onChange={handleReturnChange}
              disabled={tripType === "oneway"}
              format="DD/MM/YYYY"
              onError={(reason) => {
                if (tripType === "oneway") {
                  setReturnDateError("");
                  return;
                }
                if (reason === "minDate") {
                  setReturnDateError(
                    "Debe ser igual o posterior a la salida"
                  );
                } else if (reason) {
                  setReturnDateError("Fecha inválida");
                } else {
                  setReturnDateError("");
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: tripType === "roundtrip",
                  error: tripType === "roundtrip" && Boolean(returnDateError),
                  helperText:
                    tripType === "roundtrip"
                      ? returnDateError
                      : "No aplica para solo ida",
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventIcon />
                      </InputAdornment>
                    ),
                  },
                },
               
              }}
              renderDay={(date, _value, DayComponentProps) => {
                // Resalta fecha de ida
                const props = getDayProps(date, departDate ? dayjs(departDate) : null);
                return <div {...DayComponentProps} {...props} />;
              }}
            />
          </Grid>

          {/* 👥 Pasajeros */}
          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label="Adultos"
              inputProps={{ min: 1, max: 9 }}
              fullWidth
              required
              defaultValue={adults}
              helperText={adults < 1 || adults > 9 ? adultsError : "El rango es de 1 a 9 adultos"}
              error={adults < 1 || adults > 9}
              onChange={(e) => {
                const value = Number(e.target.value);

                setAdults(value);

                if (value < 1) {
                  setAdultsError("La cantidad mínima es 1");
                } else if (value > 9) {
                  setAdultsError("La cantidad máxima es 9");
                } else {
                  setAdultsError("");
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {/* 🔁 Switch fechas flexibles */}
        <FormControlLabel
          control={
            <Switch
              checked={flexibleDates}
              onChange={(e) => setFlexibleDates(e.target.checked)}
            />
          }
          label="Fechas flexibles"
          sx={{ mt: 2, color: "text.secondary" }}
        />

        {/* 🚀 Botón buscar */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !isSearchValid() || departDateError || (tripType === "roundtrip" && returnDateError)}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          fullWidth
          sx={{
            mt: 3,
            background: `linear-gradient(135deg, ${config.THEME.PRIMARY_COLOR} 0%, ${config.THEME.INFO_COLOR} 100%)`,
            fontWeight: "bold",
            fontSize: "16px",
            color: config.THEME.SURFACE_COLOR,
            borderRadius: "10px",
            padding: "12px",
            "&:hover": {
              background: `linear-gradient(135deg, ${config.THEME.INFO_COLOR} 0%, ${config.THEME.PRIMARY_COLOR} 100%)`,
            },
            "&:disabled": {
              background: `linear-gradient(135deg, ${config.THEME.DISABLED_COLOR} 0%, ${config.THEME.DISABLED_COLOR} 100%)`,
              opacity: 0.8,
              color: "#ffffff",
            },
          }}
        >
          {loading ? "Buscando..." : "Buscar vuelo"}
        </Button>
      </form>
    </Paper>
  );
}

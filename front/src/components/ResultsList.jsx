import {
  Stack,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TablePagination,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Paper,
  StepIcon,
  Tooltip,
} from "@mui/material";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useFlights } from "../contexts/FlightsContext";
import { useSearch } from "../contexts/SearchContext";
import Flight from "./Flight";
import * as React from "react";

// 🎨 Componente personalizado para iconos del stepper
function FlightStepIcon({ active, completed, icon, step }) {
  const getIcon = () => {
    if (completed) {
      return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 32 }} />;
    }
    
    if (step === 0) {
      return (
        <FlightTakeoffIcon 
          sx={{ 
            color: active ? 'primary.main' : 'grey.400', 
            fontSize: 32,
            transition: 'color 0.3s ease'
          }} 
        />
      );
    } else {
      return (
        <FlightLandIcon 
          sx={{ 
            color: active ? 'primary.main' : 'grey.400', 
            fontSize: 32,
            transition: 'color 0.3s ease'
          }} 
        />
      );
    }
  };

  return (
    <Box
      sx={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: completed 
          ? 'success.light' 
          : active 
            ? 'primary.light' 
            : 'grey.100',
        border: `2px solid ${
          completed 
            ? 'success.main' 
            : active 
              ? 'primary.main' 
              : 'grey.300'
        }`,
        transition: 'all 0.3s ease',
        boxShadow: active || completed ? 2 : 0,
      }}
    >
      {getIcon()}
    </Box>
  );
}

export default function ResultsList() {
  const { setSort, sort, getSearchCriteria, tripType } = useSearch();
  const { vuelos, loading, error, searchPerformed, searchFlights, selectedFlight, selectFlight } =
    useFlights();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  // 🚀 Estado del stepper
  const [activeStep, setActiveStep] = React.useState(0);
  
  // 🎯 Definir los pasos según el tipo de viaje
  const steps = tripType === 'roundtrip' 
    ? ['Seleccionar vuelo de ida', 'Seleccionar vuelo de vuelta']
    : ['Seleccionar vuelo'];
  
  // 🧠 Lógica para determinar el paso actual automáticamente
  React.useEffect(() => {
    console.log('🔍 Stepper useEffect - selectedFlight:', selectedFlight, 'activeStep:', activeStep);
    
    if (tripType === 'roundtrip') {
      // Para ida y vuelta
      if (!selectedFlight?.ida) {
        console.log('📍 No hay ida - yendo a paso 0');
        setActiveStep(0); // Paso 1: Seleccionar ida
      } else if (!selectedFlight?.vuelta) {
        console.log('📍 Hay ida pero no vuelta - yendo a paso 1');
        setActiveStep(1); // Paso 2: Seleccionar vuelta
      }
    } else {
      // Para solo ida
      console.log('📍 Solo ida - mantener paso 0');
      setActiveStep(0);
    }
  }, [selectedFlight, tripType]);

  // 🚀 Funciones de navegación del stepper
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 1 && selectedFlight?.vuelta) {
      selectFlight(selectedFlight.ida, null);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // 🎯 Determinar qué vuelos mostrar según el paso actual
  const getCurrentFlights = () => {
    if (tripType === 'oneway') {
      return vuelos.vuelosIda || [];
    }
    
    if (activeStep === 0) {
      return vuelos.vuelosIda || [];
    } else {
      return vuelos.vuelosRegreso || [];
    }
  };

  // 🎯 Determinar el tipo de vuelo para el paso actual
  const getCurrentFlightType = () => {
    if (tripType === 'oneway') return 'ida';
    return activeStep === 0 ? 'ida' : 'vuelta';
  };
  
  console.log("VUELOS:", vuelos);

  const onSort = (event) => {
    const sortOrder = event.target.value;
    setSort(sortOrder);
  };

  const handleChangePage = async (event, newPage) => {
    const criteria = {
      ...getSearchCriteria(),
      offset: newPage,
    };

    await searchFlights(criteria);
  };

  const handleChangeRowsPerPage = async (event) => {
    const rows = parseInt(event.target.value, 10)
    setRowsPerPage(rows);

        const criteria = {
      ...getSearchCriteria(),
      offset: 0,
      limit: rows
    };

    await searchFlights(criteria);
    
  };

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
  if (vuelos.vuelosIda?.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No se encontraron vuelos. Prueba con otros criterios de búsqueda.
      </Typography>
    );
  }

  const currentFlights = getCurrentFlights();
  const currentFlightType = getCurrentFlightType();

  return (
    <Stack spacing={3}>
      {/* 🚀 Stepper visual mejorado para ida y vuelta */}
      {tripType === 'roundtrip' && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 3
          }}
        >
          <Typography variant="h6" textAlign="center" gutterBottom color="primary.main" fontWeight="bold">
            Proceso de Selección de Vuelos
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, mt: 3 }}>
            {/* Paso 1: Vuelo de Ida */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <FlightStepIcon 
                active={activeStep === 0} 
                completed={!!selectedFlight?.ida} 
                step={0}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 2, 
                  color: activeStep === 0 ? 'primary.main' : selectedFlight?.ida ? 'success.main' : 'grey.600',
                  fontWeight: activeStep === 0 ? 'bold' : 'medium',
                  transition: 'color 0.3s ease'
                }}
              >
                Vuelo de Ida
              </Typography>
              {selectedFlight?.ida ? (
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Chip 
                    label={selectedFlight.ida.numeroVuelo} 
                    color="success" 
                    size="small" 
                    icon={<CheckCircleIcon />}
                  />
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    {selectedFlight.ida.from} → {selectedFlight.ida.to}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  {activeStep === 0 ? '👆 Selecciona tu vuelo de ida' : 'Pendiente de selección'}
                </Typography>
              )}
            </Box>

            {/* Línea conectora animada */}
            <Box 
              sx={{ 
                width: 60, 
                height: 4, 
                background: selectedFlight?.ida 
                  ? 'linear-gradient(90deg, #4caf50, #2196f3)' 
                  : 'linear-gradient(90deg, #ddd, #ddd)',
                borderRadius: 2,
                transition: 'background 0.5s ease',
                position: 'relative',
                '&::after': selectedFlight?.ida ? {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  right: -8,
                  transform: 'translateY(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid #2196f3',
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent',
                } : {}
              }}
            />

            {/* Paso 2: Vuelo de Vuelta */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <FlightStepIcon 
                active={activeStep === 1} 
                completed={!!selectedFlight?.vuelta} 
                step={1}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 2, 
                  color: activeStep === 1 ? 'primary.main' : selectedFlight?.vuelta ? 'success.main' : 'grey.600',
                  fontWeight: activeStep === 1 ? 'bold' : 'medium',
                  transition: 'color 0.3s ease'
                }}
              >
                Vuelo de Vuelta
              </Typography>
              {selectedFlight?.vuelta ? (
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Chip 
                    label={selectedFlight.vuelta.numeroVuelo} 
                    color="success" 
                    size="small" 
                    icon={<CheckCircleIcon />}
                  />
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    {selectedFlight.vuelta.from} → {selectedFlight.vuelta.to}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  {activeStep === 1 ? '👆 Selecciona tu vuelo de vuelta' : !selectedFlight?.ida ? 'Primero selecciona ida' : 'Esperando selección'}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Barra de progreso */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Progreso</Typography>
              <Typography variant="body2" color="primary.main" fontWeight="bold">
                {selectedFlight?.ida && selectedFlight?.vuelta ? '100%' : selectedFlight?.ida ? '50%' : '0%'}
              </Typography>
            </Box>
            <Box
              sx={{
                width: '100%',
                height: 8,
                backgroundColor: 'grey.200',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: selectedFlight?.ida && selectedFlight?.vuelta ? '100%' : selectedFlight?.ida ? '50%' : '0%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #4caf50, #2196f3)',
                  transition: 'width 0.5s ease',
                }}
              />
            </Box>
            
            {/* 🎯 Indicador de cuándo se abre el resumen */}
            {selectedFlight?.ida && selectedFlight?.vuelta && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  🎉 <strong>¡Selección completa!</strong> Se abrirá el resumen de tu viaje
                </Typography>
              </Alert>
            )}
            {selectedFlight?.ida && !selectedFlight?.vuelta && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ⏳ Selecciona tu vuelo de vuelta para ver el resumen completo
                </Typography>
              </Alert>
            )}
          </Box>
        </Paper>
      )}

      {/* 🎯 Información del paso actual */}
      <Box sx={{ textAlign: 'center', py: 1 }}>
        <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
          {tripType === 'roundtrip' ? 
            (activeStep === 0 ? '✈️ Elige tu vuelo de ida' : '🔄 Elige tu vuelo de regreso') : 
            '✈️ Elige tu vuelo'
          }
        </Typography>
        {tripType === 'roundtrip' && selectedFlight?.ida && activeStep === 1 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Vuelo de ida seleccionado:</strong> {selectedFlight.ida.numeroVuelo} • {selectedFlight.ida.from} → {selectedFlight.ida.to} • {selectedFlight.ida.departTime}
            </Typography>
            {selectedFlight?.vuelta && (
              <Typography variant="body2" sx={{ mt: 1, color: 'warning.main' }}>
                ⚠️ <strong>Nota:</strong> Si regresas al paso anterior, se deseleccionará el vuelo de regreso
              </Typography>
            )}
          </Alert>
        )}
        {tripType === 'oneway' && selectedFlight?.ida && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
              🎉 <strong>¡Vuelo seleccionado!</strong> Se abrirá el resumen de tu viaje
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Controles de ordenamiento */}
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Ordenar</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sort}
          label="Ordenar"
          onChange={onSort}
        >
          <MenuItem value={"price_asc"}>Ordenar por precio más bajo</MenuItem>
          <MenuItem value={"price_desc"}>Ordenar por precio más alto</MenuItem>
          <MenuItem value={"duration_asc"}>Menor duración</MenuItem>
          <MenuItem value={"duration_desc"}>Mayor duración</MenuItem>
        </Select>
      </FormControl>

      {/* 🎯 Lista de vuelos del paso actual */}
      <Stack spacing={2}>
        <Chip 
          label={`Vuelos de ${currentFlightType === 'ida' ? 'Ida' : 'Regreso'} (${currentFlights.length})`}
          color="primary" 
          variant="outlined"
        />
        {currentFlights.map((flight) => (
          <Flight key={flight.uuid} flight={flight} flightType={currentFlightType} />
        ))}
      </Stack>

      {/* 🚀 Botones de navegación mejorados para roundtrip */}
      {tripType === 'roundtrip' && (
        <Paper elevation={2} sx={{ p: 2, background: 'rgba(25, 118, 210, 0.04)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tooltip 
              title={
                selectedFlight?.vuelta 
                  ? "⚠️ Al volver se deseleccionará el vuelo de regreso" 
                  : "Volver al paso anterior"
              }
              arrow
            >
              <span>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  variant="outlined"
                  startIcon={<FlightTakeoffIcon />}
                  sx={{ 
                    minWidth: 140,
                    opacity: activeStep === 0 ? 0.5 : 1,
                    color: selectedFlight?.vuelta ? 'warning.main' : 'primary.main',
                    borderColor: selectedFlight?.vuelta ? 'warning.main' : 'primary.main',
                    '&:hover': {
                      borderColor: selectedFlight?.vuelta ? 'warning.dark' : 'primary.dark',
                    }
                  }}
                >
                  Volver a Ida
                </Button>
              </span>
            </Tooltip>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Paso {activeStep + 1} de {steps.length}
              </Typography>
              <Typography variant="body2" color="primary.main" fontWeight="bold">
                {activeStep === 0 ? 'Seleccionando ida' : 'Seleccionando vuelta'}
              </Typography>
            </Box>
            
            <Button
              onClick={handleNext}
              disabled={activeStep >= steps.length - 1 || !selectedFlight?.ida}
              variant="contained"
              endIcon={activeStep === steps.length - 1 ? <CheckCircleIcon /> : <FlightLandIcon />}
              sx={{ 
                minWidth: 140,
                background: activeStep === steps.length - 1 
                  ? 'linear-gradient(45deg, #4caf50, #66bb6a)'
                  : 'linear-gradient(45deg, #2196f3, #42a5f5)',
                '&:hover': {
                  background: activeStep === steps.length - 1 
                    ? 'linear-gradient(45deg, #388e3c, #4caf50)'
                    : 'linear-gradient(45deg, #1976d2, #2196f3)',
                }
              }}
            >
              {activeStep === steps.length - 1 ? 'Finalizar' : 'Ir a Vuelta'}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Paginación */}
      <TablePagination
        component="div"
        count={vuelos.pagination?.total || 0}
        page={vuelos.pagination?.offset || 0}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Stack>
  );
}

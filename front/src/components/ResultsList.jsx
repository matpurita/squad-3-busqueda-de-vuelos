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
  Box,
} from "@mui/material";
import { useFlights } from "../contexts/FlightsContext";
import { useSearch } from "../contexts/SearchContext";
import Flight from "./Flight";
import * as React from "react";

export default function ResultsList() {
  const { setSort, sort, getSearchCriteria, tripType } = useSearch();
  const { vuelos, loading, error, searchPerformed, searchFlights, selectedFlight, selectFlight } =
    useFlights();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
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
  if (!vuelos.results || vuelos.results.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No se encontraron vuelos. Prueba con otros criterios de búsqueda.
      </Typography>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Título */}
      <Box sx={{ textAlign: 'center', py: 1 }}>
        <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
          ✈️ Selecciona tu vuelo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {vuelos.results.length} vuelo{vuelos.results.length !== 1 ? 's' : ''} encontrado{vuelos.results.length !== 1 ? 's' : ''}
        </Typography>
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

      {/* Lista de vuelos */}
      <Stack spacing={2}>
        {vuelos.results.map((resultado) => (
          <Flight 
            key={resultado.id} 
            flight={resultado} // Pasar todo el resultado que incluye departure y return
            resultado={resultado}
          />
        ))}
      </Stack>

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

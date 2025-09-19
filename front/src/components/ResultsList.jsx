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
} from "@mui/material";
import { useFlights } from "../contexts/FlightsContext";
import { useSearch } from "../contexts/SearchContext";
import Flight from "./Flight";
import * as React from "react";

export default function ResultsList() {
  const { setSort, sort, getSearchCriteria } = useSearch();
  const { vuelos, loading, error, searchPerformed, searchFlights } =
    useFlights();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
  if (vuelos.vuelosIda.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No se encontraron vuelos. Prueba con otros criterios de búsqueda.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">ordenar</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sort}
          label="Order"
          onChange={onSort}
        >
          <MenuItem value={"price_asc"}>Ordenar por precio más bajo</MenuItem>
          <MenuItem value={"price_desc"}>Ordenar por precio más alto</MenuItem>
          <MenuItem value={"duration_asc"}>Menor duración</MenuItem>
          <MenuItem value={"duration_desc"}>Mayor duración</MenuItem>
        </Select>
      </FormControl>

      <Chip label="Vuelos Ida" />
      {vuelos.vuelosIda.map((r) => (
        <Flight key={r.uuid} flight={r} flightType="ida" />
      ))}
      {vuelos.vuelosRegreso.length > 0 && (
        <>
          <Chip label="Vuelos Regreso" />
          {vuelos.vuelosRegreso.map((r) => (
            <Flight key={r.uuid} flight={r} flightType="vuelta" />
          ))}
        </>
      )}
      <TablePagination
        component="div"
        count={vuelos.pagination.total}
        page={vuelos.pagination.offset}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Stack>
  );
}

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
  const resultsRef = React.useRef(null);
  
  // Scroll to results when search is performed
  React.useEffect(() => {
    if (searchPerformed && resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
      });
    }
  }, [searchPerformed, vuelos]);

  const onSort = async (event) => {
  const sortOrder = event.target.value;
  setSort(sortOrder);
  
  // Ejecutar nueva búsqueda con el nuevo criterio de ordenamiento
  const criteria = {
    ...getSearchCriteria(),
    sort: sortOrder,
    offset: 0, // Resetear a la primera página
    limit: rowsPerPage
  };

  await searchFlights(criteria);
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
      <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Buscando vuelos...
        </Typography>
      </Stack>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 2,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.default',
          color: 'primary.main',
        }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Stack spacing={3} sx={{ width: '100%' }} ref={resultsRef}>
      {!vuelos.results || vuelos.results.length === 0 ? (
        <Typography
          variant="body2"
          sx={{
            color: 'text.disabled',
            textAlign: 'center',
            py: 4,
            fontWeight: 400
          }}
        >
          No se encontraron vuelos. Prueba con otros criterios de búsqueda.
        </Typography>
      ) : (
        <>
          {/* Título */}
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'primary.main',
                mb: 0.5
              }}
            >
              Resultados
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 400
              }}
            >
              {vuelos.pagination?.total} vuelo{vuelos.pagination?.total !== 1 ? 's' : ''} encontrado
              {vuelos.pagination?.total !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Controles de ordenamiento */}
          <FormControl fullWidth>
            <InputLabel
              id="sort-select-label"
              sx={{
                color: 'text.secondary',
                '&.Mui-focused': {
                  color: 'primary.main'
                }
              }}
            >
              Ordenar por
            </InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={sort}
              label="Ordenar por"
              onChange={onSort}
              sx={{
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'text.disabled'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: '1.5px'
                }
              }}
            >
              <MenuItem value={'price_asc'}>Precio más bajo</MenuItem>
              <MenuItem value={'price_desc'}>Precio más alto</MenuItem>
              <MenuItem value={'duration_asc'}>Menor duración</MenuItem>
              <MenuItem value={'duration_desc'}>Mayor duración</MenuItem>
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
            labelRowsPerPage="Vuelos por página:"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: '1px solid #e6e6e6',
              '& .MuiTablePagination-select': {
                borderRadius: 1
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                color: 'primary.main',
                fontWeight: 500
              }
            }}
          />
        </>
      )}
    </Stack>
  )
}

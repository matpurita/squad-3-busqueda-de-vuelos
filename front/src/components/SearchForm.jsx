import { useState } from 'react';
import { Stack, TextField, Button, ToggleButton, ToggleButtonGroup, FormControlLabel, Switch, Autocomplete } from '@mui/material';

const airports = [
  { code: 'EZE', label: 'Buenos Aires (EZE)' },
  { code: 'AEP', label: 'Aeroparque (AEP)' },
  { code: 'SCL', label: 'Santiago (SCL)' },
  { code: 'GRU', label: 'São Paulo (GRU)' },
  { code: 'MVD', label: 'Montevideo (MVD)' },
];

export default function SearchForm({ onSearch }) {
  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState(airports[0]);
  const [to, setTo] = useState(airports[2]);
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [onlyDirect, setOnlyDirect] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({
      tripType,
      from: from?.code,
      to: to?.code,
      departDate,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      adults,
      onlyDirect,
    });
  };

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems="center">
        <ToggleButtonGroup size="small" exclusive value={tripType} onChange={(_, v) => v && setTripType(v)}>
          <ToggleButton value="oneway">Solo ida</ToggleButton>
          <ToggleButton value="roundtrip">Ida y vuelta</ToggleButton>
        </ToggleButtonGroup>

        <Autocomplete
          value={from}
          onChange={(_, v) => setFrom(v)}
          options={airports}
          getOptionLabel={(o) => o.label}
          sx={{ minWidth: 220 }}
          renderInput={(params) => <TextField {...params} label="Desde" required />}
        />

        <Autocomplete
          value={to}
          onChange={(_, v) => setTo(v)}
          options={airports}
          getOptionLabel={(o) => o.label}
          sx={{ minWidth: 220 }}
          renderInput={(params) => <TextField {...params} label="Hacia" required />}
        />

        <TextField label="Salida" type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        {tripType === 'roundtrip' && (
          <TextField label="Regreso" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        )}

        <TextField type="number" label="Adultos" value={adults} onChange={(e) => setAdults(parseInt(e.target.value || '1', 10))} inputProps={{ min: 1 }} sx={{ width: 110 }} />

        <FormControlLabel control={<Switch checked={onlyDirect} onChange={(e) => setOnlyDirect(e.target.checked)} />} label="Solo directos" />

        <Button type="submit" variant="contained">Buscar</Button>
      </Stack>
  );
}



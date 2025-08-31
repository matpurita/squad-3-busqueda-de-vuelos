import { Card, CardContent, Stack, Typography, Chip, Button } from '@mui/material';

export default function ResultsList({ results = [] }) {
  if (!results.length) {
    return <Typography variant="body2" color="text.secondary">No hay resultados. Proba buscando arriba.</Typography>;
  }

  return (
    <Stack spacing={2}>
      {results.map((r) => (
        <Card key={r.id} variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h6">{r.airline}</Typography>
                {r.direct && <Chip size="small" color="success" label="Directo" />}
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography>{r.from} → {r.to}</Typography>
                <Typography color="text.secondary">{r.departTime} - {r.arriveTime}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h6">${r.price}</Typography>
                <Button variant="contained">Seleccionar</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}




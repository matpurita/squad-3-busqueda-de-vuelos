import { useState } from 'react'
import './App.css'
import { ThemeProvider, CssBaseline, Container, Paper, Stack, Typography, Divider } from '@mui/material'
import theme from './theme'
import SearchForm from './components/SearchForm'
import ResultsList from './components/ResultsList'

function App() {
  const [results, setResults] = useState([])

  const handleSearch = (criteria) => {
    const mock = [
      { id: '1', airline: 'Aerolíneas', from: criteria.from, to: criteria.to, departTime: '08:30', arriveTime: '11:15', price: 180000, direct: true },
      { id: '2', airline: 'LATAM', from: criteria.from, to: criteria.to, departTime: '12:10', arriveTime: '15:20', price: 165000, direct: false },
      { id: '3', airline: 'GOL', from: criteria.from, to: criteria.to, departTime: '19:45', arriveTime: '22:30', price: 152000, direct: criteria.onlyDirect },
    ].filter((r) => (criteria.onlyDirect ? r.direct : true))
    setResults(mock)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h5">Buscador de vuelos</Typography>
            <SearchForm onSearch={handleSearch} />
          </Stack>
        </Paper>

        <Divider sx={{ my: 3 }} />

        <ResultsList results={results} />
      </Container>
    </ThemeProvider>
  )
}

export default App

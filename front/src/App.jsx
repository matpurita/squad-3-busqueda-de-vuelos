import './App.css'
import { ThemeProvider, CssBaseline, Container, Paper, Stack, Typography, Divider, Alert, CircularProgress } from '@mui/material'
import theme from './theme'
import SearchForm from './components/SearchForm'
import ResultsList from './components/ResultsList'
import { SearchProvider } from './contexts/SearchContext'
import { FlightsProvider } from './contexts/FlightsContext'
import '@fontsource/roboto/400.css';
import Sidebar from './components/Sidebar'

function AppContent() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h5" >Buscá tu vuelo</Typography>
          <SearchForm />
        </Stack>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <ResultsList />
      <Sidebar/>
    </Container>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SearchProvider>
        <FlightsProvider>
          <AppContent />
        </FlightsProvider>
      </SearchProvider>
    </ThemeProvider>
  )
}

export default App

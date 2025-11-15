import './App.css'
import { ThemeProvider, CssBaseline, Container, Paper, Box, Typography, Divider, AppBar, Toolbar, Button, Menu, MenuItem, Avatar, IconButton } from '@mui/material'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import theme from './theme'
import SearchForm from './components/SearchForm'
import ResultsList from './components/ResultsList'
import AuthCallback from './components/AuthCallback'
import Login from './components/Login'
import Register from './components/Register'
import { SearchProvider } from './contexts/SearchContext'
import { FlightsProvider } from './contexts/FlightsContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    handleMenuClose()
  }

  const handleRegister = () => {
    navigate("/register");
  }

  return (
    <AppBar position="static" elevation={2} sx={{ width: '100vw' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
          {/* Logo/Título */}
          <Typography variant="h5" component="div" fontWeight="bold">
            SkyTrack
          </Typography>

          {/* Navegación y Auth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                {/* Usuario logueado */}
                <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
                  Hola, {user?.nombre_completo}
                </Typography>

                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ color: 'white' }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                    {user?.name?.[0] || <AccountCircleIcon />}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <Box>
                      <Typography variant="subtitle2">{user?.nombre_completo}</Typography>
                      <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleMenuClose}>Mi Perfil</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {/* Usuario no logueado */}
                <Button
                  color="inherit"
                  startIcon={<LoginIcon />}
                  onClick={handleLogin}
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  Iniciar Sesión
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  startIcon={<PersonAddIcon />}
                  onClick={handleRegister}
                >
                  Registrarse
                </Button>

                {/* Botón compacto para móviles */}
                <IconButton
                  color="inherit"
                  onClick={handleLogin}
                  sx={{ display: { xs: 'flex', sm: 'none' } }}
                >
                  <LoginIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

function Home() {
  return (
    <>
      {/* Contenido Principal Centrado - Dentro de Container */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4
        }}
      >
        {/* Formulario de Búsqueda Centrado */}
        <Box sx={{ width: '100%' }}>
          <Typography variant="h5" gutterBottom textAlign="center" color="primary.main" fontWeight="bold">
            Buscar Vuelos
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SearchForm />
          </LocalizationProvider>
        </Box>

        {/* Resultados Centrados */}
        <ResultsList />

        <Box sx={{ width: { lg: 350 }, flexShrink: 0 }}>
          <Sidebar />
        </Box>
      </Container >
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default'
      }}
    >
      {/* Header con navegación - Oculto en login */}
      {!isLoginPage && !isRegisterPage && <Header />}

      {/* Contenido principal con rutas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>

      {/* Footer - Oculto en login */}
      {!isLoginPage && !isRegisterPage && (
        <Box
          sx={{
            backgroundColor: 'grey.100',
            py: 3,
            textAlign: 'center',
            mt: 'auto',
            width: '100vw'
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary">
              © 2025 SkyTrack - Squad 3 | Encuentra los mejores vuelos
            </Typography>
          </Container>
        </Box>
      )}
    </Box>
  )
}


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <SearchProvider>
            <FlightsProvider>
              <AppContent />
            </FlightsProvider>
          </SearchProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
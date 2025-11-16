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
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        width: '100vw',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e6e6e6',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 0, py: 2 }}>
          {/* Logo/Título Minimalista */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#1a1a1a',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            SKYTRACK
          </Typography>

          {/* Navegación y Auth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {user ? (
              <>
                {/* Usuario logueado */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mr: 1, 
                    display: { xs: 'none', sm: 'block' },
                    color: '#666666',
                    fontWeight: 500,
                  }}
                >
                  {user?.nombre_completo}
                </Typography>

                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ 
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                >
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: '#1a1a1a',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}>
                    {user?.nombre_completo?.[0] || <AccountCircleIcon />}
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
                  PaperProps={{
                    elevation: 2,
                    sx: {
                      mt: 1,
                      borderRadius: 1,
                      border: '1px solid #e6e6e6',
                    }
                  }}
                >
                  <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, px: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {user?.nombre_completo}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ 
                      py: 1, 
                      px: 2,
                      color: '#1a1a1a',
                      fontWeight: 500,
                    }}
                  >
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {/* Usuario no logueado */}
                <Button
                  onClick={handleLogin}
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' },
                    color: '#1a1a1a',
                    fontWeight: 500,
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                >
                  Iniciar Sesión
                </Button>

                <Button
                  variant="contained"
                  onClick={handleRegister}
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    fontWeight: 500,
                    px: 3,
                    '&:hover': {
                      backgroundColor: '#404040',
                    }
                  }}
                >
                  Registrarse
                </Button>

                {/* Botón compacto para móviles */}
                <IconButton
                  onClick={handleLogin}
                  sx={{ 
                    display: { xs: 'flex', sm: 'none' },
                    color: '#1a1a1a',
                  }}
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
          py: { xs: 3, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, md: 5 }
        }}
      >
        {/* Formulario de Búsqueda Centrado */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ mb: { xs: 2, md: 3 }, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: '#1a1a1a',
                mb: 1,
              }}
            >
              Buscar Vuelos
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666666',
                fontWeight: 400,
              }}
            >
              Encuentra las mejores opciones para tu próximo viaje
            </Typography>
          </Box>
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
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e6e6e6',
            py: 3,
            textAlign: 'center',
            mt: 'auto',
            width: '100vw'
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666666',
                fontWeight: 400,
                fontSize: '0.875rem',
              }}
            >
              © 2025 SKYTRACK — Squad 3
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
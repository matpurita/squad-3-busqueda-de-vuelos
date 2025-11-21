import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import HomeIcon from '@mui/icons-material/Home';
import ArrowBack from '@mui/icons-material/ArrowBack';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // Si el login es exitoso, navegar a la página principal
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
  if (window.history.length > 1) {
    navigate(-1); // Volver atrás si hay historial
  } else {
    navigate("/"); // Ir al inicio si no hay historial
  }
};

const handleGoHome = () => {
  navigate("/");
};

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleForgotPassword = () => {
    window.open('https://grupo5-usuarios.vercel.app', '_blank')
    // navigate("/forgot-password");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'background.default',
      }}
    >
      <Box maxWidth={450} sx={{ width: '100%', px: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            position: "relative",
          }}
        >
             {/* Botones de navegación en la esquina superior */}
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton
              onClick={handleGoBack}
              size="small"
              disabled={isLoading}
              sx={{
                backgroundColor: 'action.hover',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
              title="Volver atrás"
            >
              <ArrowBack fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleGoHome}
              size="small"
              disabled={isLoading}
              sx={{
                backgroundColor: 'action.hover',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
              title="Ir al inicio"
            >
              <HomeIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              textAlign: 'center',
              letterSpacing: '-0.02em',
              color: 'primary.main',
              mb: 1,
            }}
          >
            SKYTRACK
          </Typography>
          <Typography
            variant="body2"
            sx={{ 
              color: 'text.secondary',
              textAlign: 'center',
              mb: 3,
              fontWeight: 400,
            }}
          >
            Ingresa tus credenciales para acceder
          </Typography>

          {/* Mostrar error si existe */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2, 
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
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={isLoading}
              autoComplete="email"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={isLoading}
              autoComplete="current-password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
              inputProps={{
                minLength: 8,   // 👈 mínimo de caracteres
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleTogglePassword}
                      disabled={isLoading}
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
              sx={{ 
                mt: 3,
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 600,
                letterSpacing: '0.02em',
                borderRadius: 1,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
                '&:disabled': {
                  backgroundColor: 'action.disabledBackground',
                  color: 'text.disabled',
                },
                position: 'relative'
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress 
                    size={20} 
                    sx={{ 
                      color: 'primary.contrastText',
                      position: 'absolute',
                      left: '50%',
                      marginLeft: '-10px'
                    }} 
                  />
                  <span style={{ opacity: 0 }}>Iniciar sesión</span>
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2.5,
              }}
            >
              <Link 
                component="button"
                type="button"
                underline="hover"
                onClick={handleRegisterClick}
                disabled={isLoading}
                sx={{ 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  color: 'primary.main',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    opacity: 0.7,
                    background: 'transparent'
                  }
                }}
              >
                ¿No tienes cuenta? Registrarse
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
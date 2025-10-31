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
        background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
      }}
    >
      <Box maxWidth={450}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            bgcolor: "rgba(255,255,255,0.8)",
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
                backgroundColor: "rgba(255,255,255,0.8)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.9)",
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
                backgroundColor: "rgba(255,255,255,0.8)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
              }}
              title="Ir al inicio"
            >
              <HomeIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            SkyTrack
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            gutterBottom
          >
            Ingresa tus credenciales para acceder
          </Typography>

          {/* Mostrar error si existe */}
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleTogglePassword}
                      disabled={isLoading}
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
                mt: 2, 
                borderRadius: 3, 
                py: 1.2,
                position: 'relative'
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress 
                    size={20} 
                    sx={{ 
                      color: 'white',
                      position: 'absolute',
                      left: '50%',
                      marginLeft: '-10px'
                    }} 
                  />
                  <span style={{ opacity: 0 }}>Iniciar sesión</span>
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                fontSize: 14,
              }}
            >
              <Link 
                component="button"
                type="button"
                underline="hover"
                onClick={handleForgotPassword}
                disabled={isLoading}
                sx={{ 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <Link 
                component="button"
                type="button"
                underline="hover"
                onClick={handleRegisterClick}
                disabled={isLoading}
                sx={{ 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                Registrarse
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  FlightTakeoff,
  Email,
  Lock,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validaciones básicas
      if (!formData.email || !formData.password) {
        throw new Error('Por favor completa todos los campos');
      }

      // Usar la función login del contexto
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={12}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Stack spacing={3} alignItems="center" mb={4}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
              }}
            >
              <FlightTakeoff sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="primary"
              textAlign="center"
            >
              Bienvenido
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              Inicia sesión para acceder a tu cuenta
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                name="email"
                type="email"
                label="Correo electrónico"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                    boxShadow: '0 12px 40px rgba(33, 150, 243, 0.4)',
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </Stack>
          </Box>

          {/* Demo Info */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              background: 'rgba(25, 118, 210, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(25, 118, 210, 0.2)',
            }}
          >
            <Typography variant="body2" color="primary" fontWeight="bold" mb={1}>
              🎯 Credenciales de demo:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: admin@vuelos.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Contraseña: admin123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
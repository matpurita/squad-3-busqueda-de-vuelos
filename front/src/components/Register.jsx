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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff, Person, Email, Phone, Public } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/apiService";
import HomeIcon from '@mui/icons-material/Home';
import ArrowBack from '@mui/icons-material/ArrowBack';

// Lista de nacionalidades exacta de tu sistema
const nacionalidades = [
  "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda", 
  "Arabia Saudí", "Argelia", "Argentina", "Armenia", "Australia", "Austria", 
  "Azerbaiyán", "Bahamas", "Bangladés", "Barbados", "Baréin", "Bélgica", 
  "Belice", "Benín", "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina", 
  "Botsuana", "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", 
  "Bután", "Cabo Verde", "Camboya", "Camerún", "Canadá", "Catar", "Chad", 
  "Chile", "China", "Chipre", "Ciudad del Vaticano", "Colombia", "Comoras", 
  "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", 
  "Croacia", "Cuba", "Dinamarca", "Dominica", "Ecuador", "Egipto", 
  "El Salvador", "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", 
  "Eslovenia", "España", "Estados Unidos", "Estonia", "Etiopía", "Filipinas", 
  "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia", "Georgia", "Ghana", 
  "Granada", "Grecia", "Guatemala", "Guinea", "Guinea Ecuatorial", 
  "Guinea-Bisáu", "Guyana", "Haití", "Honduras", "Hungría", "India", 
  "Indonesia", "Irak", "Irán", "Irlanda", "Islandia", "Islas Marshall", 
  "Islas Salomón", "Israel", "Italia", "Jamaica", "Japón", "Jordania", 
  "Kazajistán", "Kenia", "Kirguistán", "Kiribati", "Kuwait", "Laos", 
  "Lesoto", "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein", 
  "Lituania", "Luxemburgo", "Macedonia del Norte", "Madagascar", "Malasia", 
  "Malaui", "Maldivas", "Malí", "Malta", "Marruecos", "Mauricio", 
  "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", 
  "Montenegro", "Mozambique", "Namibia", "Nauru", "Nepal", "Nicaragua", 
  "Níger", "Nigeria", "Noruega", "Nueva Zelanda", "Omán", "Países Bajos", 
  "Pakistán", "Palaos", "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", 
  "Polonia", "Portugal", "Reino Unido", "República Centroafricana", 
  "República Checa", "República del Congo", "República Democrática del Congo", 
  "República Dominicana", "Ruanda", "Rumania", "Rusia", "Samoa", 
  "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas", 
  "Santa Lucía", "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", 
  "Sierra Leona", "Singapur", "Siria", "Somalia", "Sri Lanka", "Sudáfrica", 
  "Sudán", "Sudán del Sur", "Suecia", "Suiza", "Surinam", "Tailandia", 
  "Taiwán", "Tanzania", "Tayikistán", "Timor Oriental", "Togo", "Tonga", 
  "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía", "Tuvalu", 
  "Ucrania", "Uganda", "Uruguay", "Uzbekistán", "Vanuatu", "Venezuela", 
  "Vietnam", "Yemen", "Yibuti", "Zambia", "Zimbabue"
];

export default function Register() {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    email: "",
    password: "",
    telefono: "",
    nacionalidad: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  const cleanForm = () => {
    setFormData({
      nombre_completo: "",
      email: "",
      password: "",
      telefono: "",
      nacionalidad: "",
    });
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateForm = () => {
    if (!formData.nombre_completo.trim()) {
      setError("El nombre completo es requerido");
      return false;
    }
    
    if (!formData.email.trim()) {
      setError("El email es requerido");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("El formato del email no es válido");
      return false;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }

    if (formData.password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    if (!formData.nacionalidad.trim()) {
      setError("La nacionalidad es requerida");
      return false;
    }

    return true;
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Crear payload base
      const registerData = {
        name: formData.nombre_completo,
        email: formData.email,
        password: formData.password,
        nationalityOrOrigin: formData.nacionalidad,
        
      };


      // Convertir a JSON para envío
      const jsonPayload = JSON.stringify(registerData);
      
      console.log("JSON Payload enviado:", jsonPayload);
      console.log("Datos de registro:", registerData);

      //await register(registerData);
      await apiService.register(registerData);
      // No redirigir automáticamente - solo mostrar mensaje con link
      setSuccess("El usuario se ha registrado correctamente. Por favor, inicia sesión.");
      cleanForm()
      
    } catch (err) {
      console.error("Error en registro:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Error al registrar usuario. Inténtalo nuevamente."
      );
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

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleLoginClick = () => {
    navigate("/login");
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
        py: 4,
      }}
    >
      <Box maxWidth={500} sx={{ width: '100%', px: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            position: 'relative',
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
            Crea tu cuenta para acceder
          </Typography>

          {/* Mostrar error */}
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

          {/* Mensaje de éxito con link a login */}
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mt: 2, 
                mb: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'action.hover',
                color: 'primary.main',
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                ¡Registro exitoso! Tu cuenta ha sido creada correctamente.
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Link 
                  component="button"
                  type="button"
                  underline="hover"
                  onClick={handleLoginClick}
                  sx={{ 
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'primary.main',
                    '&:hover': {
                      opacity: 0.7,
                    }
                  }}
                >
                  → Ir a iniciar sesión
                </Link>
              </Box>
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {/* Nombre completo */}
            <TextField
              fullWidth
              label="Nombre completo"
              type="text"
              value={formData.nombre_completo}
              onChange={handleChange('nombre_completo')}
              margin="normal"
              required
              disabled={isLoading}
              autoComplete="name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              margin="normal"
              required
              disabled={isLoading}
              autoComplete="email"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />

           

            {/* Nacionalidad */}
            <FormControl 
              fullWidth 
              margin="normal" 
              required 
              disabled={isLoading}
              sx={{ 
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
            >
              <InputLabel 
                id="nacionalidad-label"
                sx={{ 
                  color: 'text.secondary',
                  '&.Mui-focused': {
                    color: 'primary.main',
                  }
                }}
              >
                Nacionalidad
              </InputLabel>
              <Select
                labelId="nacionalidad-label"
                label="Nacionalidad"
                value={formData.nacionalidad}
                onChange={handleChange('nacionalidad')}
                startAdornment={
                  <InputAdornment position="start">
                    <Public sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                }
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                    }
                  }
                }}
              >
                {nacionalidades.map((nacionalidad) => (
                  <MenuItem key={nacionalidad} value={nacionalidad}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{nacionalidad}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Contraseña */}
            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange('password')}
              margin="normal"
              required
              disabled={isLoading}
              autoComplete="new-password"
              helperText="Mínimo 8 caracteres"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
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

            {/* Confirmar contraseña */}
            <TextField
              fullWidth
              label="Confirmar contraseña"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              disabled={isLoading}
              autoComplete="new-password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleToggleConfirmPassword}
                      disabled={isLoading}
                      sx={{ color: 'text.secondary' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                  <span style={{ opacity: 0 }}>Registrarse</span>
                </>
              ) : (
                "Registrarse"
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
                onClick={handleLoginClick}
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
                ¿Ya tienes cuenta? Iniciar sesión
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
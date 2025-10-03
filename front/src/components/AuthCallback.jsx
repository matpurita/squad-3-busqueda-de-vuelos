import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setExternalToken } = useAuth();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // 🚀 Optimizado: función memoizada para procesar token
  const processToken = useCallback(async () => {
    try {
      // Capturar parámetro 't' de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam = urlParams.get('t');
      
      if (!tokenParam) {
        setStatus('error');
        setErrorMessage('No se encontró el token de autenticación');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      // Procesar el token con el contexto de autenticación
      await setExternalToken(tokenParam);
      
      setStatus('success');
      
      // Redireccionar al home después de 2 segundos
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
      
    } catch (error) {
      console.error('Error procesando token:', error);
      setStatus('error');
      setErrorMessage('Error al procesar el token de autenticación');
      
      // Redireccionar al home después de 3 segundos en caso de error
      setTimeout(() => navigate('/'), 3000);
    }
  }, [setExternalToken, navigate]);

  useEffect(() => {
    processToken();
  }, [processToken]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
        p: 3
      }}
    >
      {status === 'processing' && (
        <>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Procesando autenticación...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Por favor espera mientras validamos tu acceso
          </Typography>
        </>
      )}

      {status === 'success' && (
        <>
          <Box sx={{ color: 'success.main', mb: 2 }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </Box>
          <Typography variant="h6" color="success.main">
            ¡Autenticación exitosa!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirigiendo al inicio...
          </Typography>
        </>
      )}

      {status === 'error' && (
        <>
          <Alert severity="error" sx={{ maxWidth: 400 }}>
            <Typography variant="h6" gutterBottom>
              Error de autenticación
            </Typography>
            <Typography variant="body2">
              {errorMessage}
            </Typography>
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Serás redirigido al inicio en unos segundos...
          </Typography>
        </>
      )}
    </Box>
  );
}
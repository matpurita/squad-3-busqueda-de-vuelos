import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { getSuggestionsByCondition, getRandomSuggestions, getAllSuggestions } from '../config/suggestions';

const SuggestionsAside = ({ 
  suggestions = [], 
  displayMode = 'random', // 'random', 'conditional', 'all'
  maxSuggestions = 3,
  condition = null,
  onSuggestionClick = null 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [displayedSuggestions, setDisplayedSuggestions] = useState([]);

  useEffect(() => {
    let selected = [];
    
    if (suggestions.length > 0) {
      // Si se proporcionan sugerencias específicas, usarlas
      selected = suggestions.slice(0, maxSuggestions);
    } else {
      // Usar las sugerencias de la configuración
      if (displayMode === 'conditional' && condition) {
        selected = getSuggestionsByCondition(condition, maxSuggestions);
      } else if (displayMode === 'random') {
        selected = getRandomSuggestions(maxSuggestions);
      } else if (displayMode === 'all') {
        selected = getAllSuggestions().slice(0, maxSuggestions);
      }
    }

    setDisplayedSuggestions(selected);
  }, [suggestions, displayMode, condition, maxSuggestions]);

  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
    // Acción por defecto: podría redirigir a búsqueda con ese destino
    console.log('Sugerencia seleccionada:', suggestion);
  };

  if (displayedSuggestions.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        width: isMobile ? '100%' : '280px',
        minWidth: isMobile ? 'auto' : '280px',
        maxWidth: isMobile ? '100%' : '320px',
        p: 2,
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          mb: 2
        }}
      >
        ✈️ Sugerencias para ti
      </Typography>

      <Stack spacing={2}>
        {displayedSuggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: 1,
              borderColor: 'divider',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
                borderColor: 'primary.main',
              }
            }}
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {/* Contenedor con proporción correcta para imagen 160x600 */}
            <Box 
              sx={{ 
                width: '100%',
                height: 600, // Altura fija
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CardMedia
                component="img"
                image={suggestion.image}
                alt={suggestion.title}
                sx={{
                  width: 'auto',
                  height: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'brightness(0.9)',
                }}
              />
            </Box>
            
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {suggestion.title}
                </Typography>
                {suggestion.tag && (
                  <Chip 
                    label={suggestion.tag} 
                    size="small" 
                    color="primary"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                )}
              </Box>

              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ fontWeight: 500, display: 'block', mb: 0.5 }}
              >
                {suggestion.subtitle}
              </Typography>

              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 1.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {suggestion.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  fontWeight="bold"
                >
                  {suggestion.price}
                </Typography>
                
                <Button 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.75rem',
                    px: 1,
                    py: 0.5,
                    minWidth: 'auto'
                  }}
                >
                  Ver más
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Botón para ver más sugerencias */}
      <Button
        fullWidth
        variant="text"
        sx={{ 
          mt: 2, 
          color: 'primary.main',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04)
          }
        }}
        onClick={() => console.log('Ver más sugerencias')}
      >
        Ver más destinos
      </Button>
    </Box>
  );
};

export default SuggestionsAside;
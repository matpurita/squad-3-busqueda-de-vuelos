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
  useMediaQuery,
  Grid
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { getSuggestionsByCondition, getRandomSuggestions, getAllSuggestions } from '../config/suggestions';

const SuggestionsHorizontal = ({ 
  suggestions = [], 
  displayMode = 'random',
  maxSuggestions = 4,
  condition = null,
  onSuggestionClick = null 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [displayedSuggestions, setDisplayedSuggestions] = useState([]);

  useEffect(() => {
    let selected = [];
    
    if (suggestions.length > 0) {
      selected = suggestions.slice(0, maxSuggestions);
    } else {
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
    console.log('Sugerencia seleccionada:', suggestion);
  };

  if (displayedSuggestions.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          mb: 2,
          textAlign: 'center'
        }}
      >
        ✈️ Destinos recomendados para ti
      </Typography>

      <Grid container spacing={2}>
        {displayedSuggestions.map((suggestion) => (
          <Grid item xs={12} sm={6} md={3} key={suggestion.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 1,
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  borderColor: 'primary.main',
                }
              }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {/* Contenedor optimizado para banners verticales 160x600px */}
              <Box sx={{ 
                position: 'relative', 
                height: 300, // Altura mayor para acomodar proporción vertical
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CardMedia
                  component="img"
                  sx={{
                    width: 'auto',
                    height: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain', // Mostrar imagen completa
                    filter: 'brightness(0.85)',
                  }}
                  image={suggestion.image}
                  alt={suggestion.title}
                />
                
                {/* Overlay con tag */}
                {suggestion.tag && (
                  <Chip 
                    label={suggestion.tag} 
                    size="small" 
                    color="primary"
                    sx={{ 
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      fontSize: '0.7rem',
                      height: 24,
                      backgroundColor: alpha(theme.palette.primary.main, 0.9),
                      color: 'white'
                    }}
                  />
                )}

                {/* Overlay con precio */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    backgroundColor: alpha(theme.palette.background.paper, 0.95),
                    borderRadius: 1,
                    px: 1,
                    py: 0.5
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="primary" 
                    fontWeight="bold"
                    sx={{ fontSize: '0.85rem' }}
                  >
                    {suggestion.price}
                  </Typography>
                </Box>
              </Box>
              
              <CardContent 
                sx={{ 
                  p: 1.5, 
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  '&:last-child': { pb: 1.5 }
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5, fontSize: '1rem' }}>
                  {suggestion.title}
                </Typography>

                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ fontWeight: 500, mb: 0.5 }}
                >
                  {suggestion.subtitle}
                </Typography>

                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 1,
                    flexGrow: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontSize: '0.85rem'
                  }}
                >
                  {suggestion.description}
                </Typography>

                <Button 
                  size="small" 
                  variant="outlined"
                  fullWidth
                  sx={{ 
                    fontSize: '0.75rem',
                    py: 0.5,
                    mt: 'auto'
                  }}
                >
                  Ver vuelos
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Botón para ver más */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant="outlined"
          sx={{ 
            px: 3,
            py: 1,
            borderRadius: 2
          }}
          onClick={() => console.log('Ver más destinos')}
        >
          Explorar más destinos
        </Button>
      </Box>
    </Box>
  );
};

export default SuggestionsHorizontal;
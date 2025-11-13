import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
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

const SuggestionsBanner = ({ 
  suggestions = [], 
  displayMode = 'random',
  maxSuggestions = 3,
  condition = null,
  onSuggestionClick = null 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [displayedSuggestions, setDisplayedSuggestions] = useState([]);

  // Calcular dimensiones proporcionales para 160x600px
  const containerWidth = isMobile ? 120 : 160; // Ancho base
  const containerHeight = containerWidth * 3.75; // Mantener proporción 1:3.75

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
        ✈️ Destinos destacados
      </Typography>

      <Stack 
        direction={isMobile ? 'column' : 'row'} 
        spacing={2} 
        alignItems="center" 
        justifyContent="center"
        sx={{ 
          overflowX: isMobile ? 'visible' : 'auto',
          pb: 1
        }}
      >
        {displayedSuggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: 1,
              borderColor: 'divider',
              width: containerWidth,
              minWidth: containerWidth,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
                borderColor: 'primary.main',
              }
            }}
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {/* Imagen con proporción exacta 160x600 */}
            <Box
              sx={{
                width: containerWidth,
                height: containerHeight,
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#f8f9fa',
              }}
            >
              <img
                src={suggestion.image}
                alt={suggestion.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'brightness(0.9)',
                }}
              />
              
             
            </Box>
          </Card>
        ))}
      </Stack>

      {/* Botón para ver más */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          variant="text"
          size="small"
          sx={{ 
            color: 'primary.main',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04)
            }
          }}
          onClick={() => console.log('Ver más destinos')}
        >
          Ver más destinos →
        </Button>
      </Box>
    </Box>
  );
};

export default SuggestionsBanner;
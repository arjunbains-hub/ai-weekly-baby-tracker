import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { Restaurant, LocalDining } from '@mui/icons-material';
import RecipeForm from './components/RecipeForm';
import RecipeResults from './components/RecipeResults';
import { RecipeRequest, RecipeResponse, SeasoningProfile } from './types/recipe';

// Pull API base URL from environment
const API_BASE = process.env.REACT_APP_API_BASE_URL;

const theme = createTheme({
  palette: {
    primary: {
      main: '#007AFF', // Apple's signature blue
    },
    secondary: {
      main: '#5856D6', // Apple's purple
    },
    background: {
      default: '#F2F2F7', // Apple's light gray background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1D1D1F', // Apple's dark text
      secondary: '#86868B', // Apple's secondary text
    },
    grey: {
      50: '#F2F2F7',
      100: '#E5E5EA',
      200: '#D1D1D6',
      300: '#C7C7CC',
      400: '#AEAEB2',
      500: '#8E8E93',
      600: '#636366',
      700: '#48484A',
      800: '#3A3A3C',
      900: '#1D1D1F',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    // ... other typography settings
  },
  shape: {
    borderRadius: 12,
  },
shadows: [
  'none',
  '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)',
  // …and then 23 more strings, e.g. repeat the same:
  '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)',
  '0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)',
  // (total array length must be 25)
],
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          color: '#1D1D1F',
        },
      },
    },
    // ... other component overrides
  },
});

function App() {
  const [recipeResponse, setRecipeResponse] = useState<RecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const [seasoningProfiles, setSeasoningProfiles] = useState<SeasoningProfile[]>([
    {
      id: '1',
      name: 'Italian Classic',
      description: 'Traditional Italian seasoning blend',
      seasonings: ['basil', 'oregano', 'thyme', 'rosemary', 'garlic', 'parmesan'],
      cuisine: 'Italian',
      spiceLevel: 'mild',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Spicy Mexican',
      description: 'Bold Mexican flavors',
      seasonings: ['cumin', 'chili powder', 'paprika', 'cayenne', 'lime', 'cilantro'],
      cuisine: 'Mexican',
      spiceLevel: 'hot',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const handleCreateRecipe = async (recipeRequest: RecipeRequest) => {
    setLoading(true);
    setError(null);
    setRecipeResponse(null);

    try {
      const response = await fetch(`${API_BASE}/create-recipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RecipeResponse = await response.json();
      setRecipeResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRecipe = () => {
    setRecipeResponse(null);
    setError(null);
  };

  const handleSaveRecipe = (recipe: any) => {
    if (savedRecipes.includes(recipe.id)) {
      setSavedRecipes(savedRecipes.filter(id => id !== recipe.id));
    } else {
      setSavedRecipes([...savedRecipes, recipe.id]);
    }
  };

  const handleAddToShoppingList = (ingredients: string[]) => {
    console.log('Adding to shopping list:', ingredients);
    alert(`Added ${ingredients.length} items to shopping list!`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
            <Restaurant sx={{ mr: 2, color: '#007AFF' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              AI Recipe Creator
            </Typography>
            <LocalDining sx={{ color: '#007AFF' }} />
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 6, mb: 6, px: { xs: 2, sm: 3 } }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom 
              sx={{ 
                mb: 3,
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              Create Delicious Recipes
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Transform your available ingredients into amazing dishes with our AI-powered recipe creator
            </Typography>
          </Box>

          {/* Features Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 8 }}>
            {/* ... Feature cards unchanged ... */}
          </Box>

          {/* Main Content */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '400px 1fr' }, gap: 6 }}>
            <Box>
              <Paper sx={{ 
                p: 4,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                position: 'sticky',
                top: 24,
              }}> 
                <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                  Create Recipe
                </Typography>
                <RecipeForm 
                  onSubmit={handleCreateRecipe} 
                  loading={loading}
                  seasoningProfiles={seasoningProfiles}
                />
              </Paper>
            </Box>

            <Box>
              {/* ... Results and error handling unchanged ... */}
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

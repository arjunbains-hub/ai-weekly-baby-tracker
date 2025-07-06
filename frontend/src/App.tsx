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
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 12, // Apple's rounded corners
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
    '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
    '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
    '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
    '0px 19px 38px rgba(0, 0, 0, 0.30), 0px 15px 12px rgba(0, 0, 0, 0.22)',
    '0px 24px 48px rgba(0, 0, 0, 0.35), 0px 20px 14px rgba(0, 0, 0, 0.22)',
    '0px 29px 58px rgba(0, 0, 0, 0.40), 0px 25px 16px rgba(0, 0, 0, 0.22)',
    '0px 34px 68px rgba(0, 0, 0, 0.45), 0px 30px 18px rgba(0, 0, 0, 0.22)',
    '0px 39px 78px rgba(0, 0, 0, 0.50), 0px 35px 20px rgba(0, 0, 0, 0.22)',
    '0px 44px 88px rgba(0, 0, 0, 0.55), 0px 40px 22px rgba(0, 0, 0, 0.22)',
    '0px 49px 98px rgba(0, 0, 0, 0.60), 0px 45px 24px rgba(0, 0, 0, 0.22)',
    '0px 54px 108px rgba(0, 0, 0, 0.65), 0px 50px 26px rgba(0, 0, 0, 0.22)',
    '0px 59px 118px rgba(0, 0, 0, 0.70), 0px 55px 28px rgba(0, 0, 0, 0.22)',
    '0px 64px 128px rgba(0, 0, 0, 0.75), 0px 60px 30px rgba(0, 0, 0, 0.22)',
    '0px 69px 138px rgba(0, 0, 0, 0.80), 0px 65px 32px rgba(0, 0, 0, 0.22)',
    '0px 74px 148px rgba(0, 0, 0, 0.85), 0px 70px 34px rgba(0, 0, 0, 0.22)',
    '0px 79px 158px rgba(0, 0, 0, 0.90), 0px 75px 36px rgba(0, 0, 0, 0.22)',
    '0px 84px 168px rgba(0, 0, 0, 0.95), 0px 80px 38px rgba(0, 0, 0, 0.22)',
    '0px 89px 178px rgba(0, 0, 0, 1.00), 0px 85px 40px rgba(0, 0, 0, 0.22)',
    '0px 94px 188px rgba(0, 0, 0, 1.00), 0px 90px 42px rgba(0, 0, 0, 0.22)',
    '0px 99px 198px rgba(0, 0, 0, 1.00), 0px 95px 44px rgba(0, 0, 0, 0.22)',
    '0px 104px 208px rgba(0, 0, 0, 1.00), 0px 100px 46px rgba(0, 0, 0, 0.22)',
    '0px 109px 218px rgba(0, 0, 0, 1.00), 0px 105px 48px rgba(0, 0, 0, 0.22)',
    '0px 114px 228px rgba(0, 0, 0, 1.00), 0px 110px 50px rgba(0, 0, 0, 0.22)',
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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '12px 24px',
        },
        contained: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
          '&:hover': {
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007AFF',
            },
          },
        },
      },
    },
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
      const response = await fetch('http://localhost:8000/create-recipe', {
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
    // In a real app, this would add to a shopping list
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
            <Card sx={{ 
              height: '100%', 
              textAlign: 'center', 
              p: 4,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
              }
            }}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h4" sx={{ mb: 2, fontSize: '3rem' }}>
                  🍳
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Smart Recipes
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Generate recipes from your available ingredients with intelligent substitutions
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ 
              height: '100%', 
              textAlign: 'center', 
              p: 4,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
              }
            }}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h4" sx={{ mb: 2, fontSize: '3rem' }}>
                  🌶️
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Seasoning Profiles
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Save and reuse your favorite seasoning combinations
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ 
              height: '100%', 
              textAlign: 'center', 
              p: 4,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
              }
            }}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h4" sx={{ mb: 2, fontSize: '3rem' }}>
                  🥗
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Nutrition Aware
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Get calorie-conscious recipes with detailed nutritional information
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ 
              height: '100%', 
              textAlign: 'center', 
              p: 4,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
              }
            }}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h4" sx={{ mb: 2, fontSize: '3rem' }}>
                  🌍
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Global Cuisines
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Explore recipes from 20+ world cuisines with cultural context
                </Typography>
              </CardContent>
            </Card>
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
              {error && (
                <Paper sx={{ 
                  p: 4, 
                  mb: 3, 
                  background: 'rgba(255, 59, 48, 0.1)',
                  border: '1px solid rgba(255, 59, 48, 0.2)',
                  borderRadius: 12,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#FF3B30', fontWeight: 600 }}>
                    Error
                  </Typography>
                  <Typography sx={{ color: '#FF3B30' }}>{error}</Typography>
                </Paper>
              )}

              {recipeResponse && (
                <Paper sx={{ 
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                }}>
                  <RecipeResults 
                    response={recipeResponse} 
                    onNewRecipe={handleNewRecipe}
                    onSaveRecipe={handleSaveRecipe}
                    onAddToShoppingList={handleAddToShoppingList}
                    savedRecipes={savedRecipes}
                    seasoningProfiles={seasoningProfiles}
                  />
                </Paper>
              )}

              {!recipeResponse && !loading && !error && (
                <Paper sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                }}>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Add your ingredients to create delicious recipes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.6 }}>
                    Our AI will analyze your ingredients and create personalized recipes just for you
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Alert, Snackbar, Typography } from '@mui/material';
import UserProfileForm from './components/UserProfileForm';
import WeekendPlannerForm from './components/WeekendPlannerForm';
import WeekendResults from './components/WeekendResults';
import { UserProfile, WeekendRequest, WeekendResponse, UserProfileCreate } from './types/recipe';

// Create a custom theme with modern UX inspired by Cleo Bank and Airbnb
const theme = createTheme({
  palette: {
    primary: {
      main: '#F7C5CC', // Petal Pink
    },
    secondary: {
      main: '#C6EBDD', // Mint Green
    },
    text: {
      primary: '#000000', // Pure Black for better contrast
      secondary: '#374151', // Darker gray for better readability
    },
    background: {
      default: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Quicksand", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      color: '#000000',
      fontSize: '2.5rem',
      fontFamily: '"Nunito", "Inter", sans-serif',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      color: '#000000',
      fontSize: '2rem',
      fontFamily: '"Nunito", "Inter", sans-serif',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      color: '#000000',
      fontSize: '1.875rem',
      fontFamily: '"Nunito", "Inter", sans-serif',
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 600,
      color: '#000000',
      fontSize: '1.5rem',
      fontFamily: '"Nunito", "Inter", sans-serif',
    },
    h5: {
      fontWeight: 600,
      color: '#000000',
      fontSize: '1.25rem',
      fontFamily: '"Nunito", "Inter", sans-serif',
    },
    h6: {
      fontWeight: 600,
      color: '#000000',
      fontSize: '1.125rem',
      fontFamily: '"Nunito", "Inter", sans-serif',
    },
    body1: {
      fontWeight: 400,
      color: '#000000',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      color: '#374151',
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontWeight: 400,
      color: '#6B7280',
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // reduced from 50
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem', // text-base
          padding: '12px 24px', // py-3 px-6
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // shadow-md
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          backgroundColor: '#2D3142', // Charcoal Navy
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#1F2937', // Gray-800
          },
        },
        outlined: {
          borderColor: '#D1D5DB', // Gray-300
          color: '#374151', // Gray-700
          '&:hover': {
            borderColor: '#9CA3AF',
            backgroundColor: '#F9FAFB', // Gray-100
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8, // reduced from 16
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // shadow-md
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8, // reduced from 16
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // shadow-md
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6, // reduced from 12
            '& fieldset': {
              borderColor: '#E5E7EB', // Gray-200
            },
            '&:hover fieldset': {
              borderColor: '#D1D5DB', // Gray-300
            },
            '&.Mui-focused fieldset': {
              borderColor: '#F7C5CC', // Petal Pink
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6B7280', // Gray-500
            fontWeight: 500,
            fontSize: '0.875rem', // text-sm
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 6, // reduced from 12
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E5E7EB', // Gray-200
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D1D5DB', // Gray-300
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#F7C5CC', // Petal Pink
            borderWidth: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12, // reduced from 20
          fontWeight: 500,
        },
      },
    },
  },
});

type AppStep = 'children' | 'location' | 'preferences' | 'results';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('children');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weekendResults, setWeekendResults] = useState<WeekendResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleChildrenSubmit = async (profileData: Partial<UserProfileCreate>) => {
    setLoading(true);
    setError(null);

    try {
      // Store partial data and move to next step
      setUserProfile({
        id: 'temp',
        children: profileData.children || [],
        postcode: '',
        maxTravelTime: 30,
        transportMode: 'car',
        budget: 50,
        startTime: '2024-01-01T09:00:00',
        endTime: '2024-01-01T17:00:00',
        createdAt: new Date().toISOString(),
      });
      setCurrentStep('location');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = async (locationData: { postcode: string; maxTravelTime: number; transportMode: 'car' | 'public' | 'walking' | 'cycling'; budget: number; startTime: string; endTime: string }) => {
    if (!userProfile) return;

    setLoading(true);
    setError(null);

    try {
      // Update user profile with location data
      const updatedProfile: UserProfile = {
        ...userProfile,
        postcode: locationData.postcode,
        maxTravelTime: locationData.maxTravelTime,
        transportMode: locationData.transportMode,
        budget: locationData.budget,
        startTime: locationData.startTime,
        endTime: locationData.endTime,
      };
      setUserProfile(updatedProfile);
      setCurrentStep('preferences');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async (request: WeekendRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/simple/weekend-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate weekend plans');
      }

      const results = await response.json();
      setWeekendResults(results);
      setCurrentStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (data: WeekendRequest | { postcode: string; maxTravelTime: number; transportMode: 'car' | 'public' | 'walking' | 'cycling'; budget: number; startTime: string; endTime: string }) => {
    if ('activityPreferences' in data) {
      // This is a WeekendRequest (preferences step)
      handlePreferencesSubmit(data);
    } else {
      // This is location data (location step)
      handleLocationSubmit(data);
    }
  };

  const handleBack = () => {
    if (currentStep === 'location') {
      setCurrentStep('children');
    } else if (currentStep === 'preferences') {
      setCurrentStep('location');
    } else if (currentStep === 'results') {
      setCurrentStep('preferences');
    }
  };

  const handleStartOver = () => {
    setCurrentStep('children');
    setUserProfile(null);
    setWeekendResults(null);
    setError(null);
  };

  const handleShare = () => {
    // In a real app, this would implement sharing functionality
    alert('Sharing functionality would be implemented here!');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'children':
        return (
          <UserProfileForm
            onSubmit={handleChildrenSubmit}
            loading={loading}
          />
        );
      
      case 'location':
        if (!userProfile) {
          setCurrentStep('children');
          return null;
        }
        return (
          <WeekendPlannerForm
            userProfile={userProfile}
            onSubmit={handleFormSubmit}
            loading={loading}
            onBack={handleBack}
            step="location"
          />
        );

      case 'preferences':
        if (!userProfile) {
          setCurrentStep('children');
          return null;
        }
        return (
          <WeekendPlannerForm
            userProfile={userProfile}
            onSubmit={handleFormSubmit}
            loading={loading}
            onBack={handleBack}
            step="preferences"
          />
        );
      
      case 'results':
        if (!weekendResults) {
          setCurrentStep('preferences');
          return null;
        }
        return (
          <WeekendResults
            results={weekendResults}
            onBack={handleBack}
            onShare={handleShare}
            onStartOver={handleStartOver}
            loading={loading}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          py: 4,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #87CEEB 0%, #98D8E8 25%, #B0E0E6 50%, #E0F6FF 75%, #F0F8FF 100%)', // sky gradient
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, #FFD700 0%, #FFA500 70%, transparent 100%)',
            borderRadius: '50%',
            animation: 'sunGlow 8s ease-in-out infinite',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.4)',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '5%',
            left: '15%',
            width: '100px',
            height: '60px',
            background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 70%, transparent 100%)',
            borderRadius: '50px',
            animation: 'cloudFloat1 20s ease-in-out infinite',
            zIndex: 1,
          },
          '@keyframes sunGlow': {
            '0%, 100%': {
              transform: 'scale(1)',
              opacity: 0.8,
            },
            '50%': {
              transform: 'scale(1.1)',
              opacity: 1,
            },
          },
          '@keyframes cloudFloat1': {
            '0%, 100%': {
              transform: 'translateX(0px) translateY(0px)',
            },
            '33%': {
              transform: 'translateX(30px) translateY(-10px)',
            },
            '66%': {
              transform: 'translateX(-20px) translateY(5px)',
            },
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Flow Steps */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 2,
              mb: 3
            }}>
              {[
                { step: 'children', label: 'Meet Your Little Explorers', icon: '👶' },
                { step: 'location', label: 'Choose Your Location', icon: '📍' },
                { step: 'preferences', label: 'What Do You Love?', icon: '❤️' },
                { step: 'results', label: 'Your Perfect Weekend', icon: '🎉' }
              ].map((flowStep, index) => (
                <Box key={flowStep.step} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: currentStep === flowStep.step ? '#FFFFFF' : '#000000',
                    backgroundColor: currentStep === flowStep.step ? '#F7C5CC' : '#F3F4F6',
                    border: currentStep === flowStep.step ? '2px solid #F7C5CC' : '2px solid #E5E7EB',
                    transition: 'all 0.3s ease',
                  }}>
                    {flowStep.icon}
                  </Box>
                  {index < 3 && (
                    <Box sx={{
                      width: 60,
                      height: 2,
                      backgroundColor: currentStep === flowStep.step || 
                        (currentStep === 'preferences' && flowStep.step === 'location') ||
                        (currentStep === 'results' && ['location', 'preferences'].includes(flowStep.step)) 
                        ? '#F7C5CC' : '#E5E7EB',
                      mx: 2,
                      transition: 'all 0.3s ease',
                    }} />
                  )}
                </Box>
              ))}
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#000000',
                fontSize: '1rem'
              }}
            >
              {currentStep === 'children' && 'Step 1 of 4: Meet Your Little Explorers'}
              {currentStep === 'location' && 'Step 2 of 4: Choose Your Location'}
              {currentStep === 'preferences' && 'Step 3 of 4: What Do You Love?'}
              {currentStep === 'results' && 'Step 4 of 4: Your Perfect Weekend'}
            </Typography>
          </Box>

          {renderCurrentStep()}
        </Container>
        {/* Additional sky elements */}
        {/* Cloud 2 */}
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '60%',
            width: '120px',
            height: '70px',
            background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 70%, transparent 100%)',
            borderRadius: '60px',
            animation: 'cloudFloat2 25s ease-in-out infinite',
            zIndex: 1,
            '@keyframes cloudFloat2': {
              '0%, 100%': {
                transform: 'translateX(0px) translateY(0px)',
              },
              '25%': {
                transform: 'translateX(-40px) translateY(-5px)',
              },
              '50%': {
                transform: 'translateX(20px) translateY(10px)',
              },
              '75%': {
                transform: 'translateX(-15px) translateY(-8px)',
              },
            },
          }}
        />
        {/* Cloud 3 */}
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            right: '25%',
            width: '90px',
            height: '50px',
            background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.2) 70%, transparent 100%)',
            borderRadius: '45px',
            animation: 'cloudFloat3 30s ease-in-out infinite',
            zIndex: 1,
            '@keyframes cloudFloat3': {
              '0%, 100%': {
                transform: 'translateX(0px) translateY(0px)',
              },
              '20%': {
                transform: 'translateX(25px) translateY(-3px)',
              },
              '40%': {
                transform: 'translateX(-15px) translateY(8px)',
              },
              '60%': {
                transform: 'translateX(30px) translateY(-5px)',
              },
              '80%': {
                transform: 'translateX(-10px) translateY(3px)',
              },
            },
          }}
        />
        {/* Small floating cloud */}
        <Box
          sx={{
            position: 'absolute',
            top: '70%',
            left: '5%',
            width: '60px',
            height: '35px',
            background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 70%, transparent 100%)',
            borderRadius: '30px',
            animation: 'cloudFloat4 18s ease-in-out infinite',
            zIndex: 1,
            '@keyframes cloudFloat4': {
              '0%, 100%': {
                transform: 'translateX(0px) translateY(0px)',
              },
              '50%': {
                transform: 'translateX(25px) translateY(-8px)',
              },
            },
          }}
        />
      </Box>
      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;

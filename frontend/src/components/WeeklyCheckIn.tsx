import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { 
  Bedtime, 
  Refresh, 
  TrendingUp, 
  Help,
  Send,
  Info
} from '@mui/icons-material';
import { BabyProfile, WeeklySleepCheckIn } from '../types/recipe';

interface WeeklyCheckInProps {
  babyProfile: BabyProfile;
  onSubmit: (checkin: WeeklySleepCheckIn) => void;
  loading?: boolean;
}

const WeeklyCheckIn: React.FC<WeeklyCheckInProps> = ({ 
  babyProfile, 
  onSubmit, 
  loading = false 
}) => {
  console.log('WeeklyCheckIn component rendered with babyProfile:', babyProfile); // Debug log
  
  const [formData, setFormData] = useState({
    sleepPattern: '',
    changesTried: '',
    biggestChallenge: '',
    parentNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate baby's age in weeks
  const calculateBabyAgeWeeks = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const ageInDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.floor(ageInDays / 7));
  };

  const babyAgeWeeks = calculateBabyAgeWeeks(babyProfile.dateOfBirth);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    console.log('Validating form data:', formData);

    if (!formData.sleepPattern.trim()) {
      newErrors.sleepPattern = 'Please describe your baby\'s sleep pattern this week';
    }

    if (!formData.biggestChallenge.trim()) {
      newErrors.biggestChallenge = 'Please tell us what\'s been most challenging';
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form is valid:', isValid);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted, validating...');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    const checkinData: WeeklySleepCheckIn = {
      babyId: babyProfile.id,
      weekNumber: babyAgeWeeks,
      sleepPattern: formData.sleepPattern.trim(),
      changesTried: formData.changesTried.trim(),
      biggestChallenge: formData.biggestChallenge.trim(),
      parentNotes: formData.parentNotes.trim() || undefined
    };

    console.log('Submitting checkin data:', checkinData);
    onSubmit(checkinData);
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Input changed for ${field}:`, value); // Debug log
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('Updated formData:', newData); // Debug log
      return newData;
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const sleepPatternExamples = [
    "Frequent night wakings every 2-3 hours",
    "Short naps during the day (30 minutes)",
    "Difficulty settling at bedtime",
    "Waking up early in the morning",
    "Sleeping well but irregular schedule",
    "Contact naps only, won't sleep in crib"
  ];

  const challengeExamples = [
    "Getting baby to sleep independently",
    "Managing frequent night feeds",
    "Establishing a consistent routine",
    "Dealing with early morning wake-ups",
    "Transitioning from contact naps",
    "Managing sleep regressions"
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #F7C5CC 0%, #C6EBDD 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
          boxShadow: '0 4px 20px rgba(247, 197, 204, 0.2)'
        }}>
          <Bedtime sx={{ fontSize: 40, color: '#2D3142' }} />
        </Box>
        <Typography 
          variant="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 800, 
            color: '#000000', 
            fontSize: '2.5rem',
            fontFamily: '"Nunito", "Inter", sans-serif',
            letterSpacing: '-0.025em'
          }}
        >
          Week {babyAgeWeeks} Sleep Check-In
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 1, 
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: 600,
            mx: 'auto',
            fontSize: '1rem',
            color: '#000000'
          }}
        >
          How has {babyProfile.name}'s sleep been this week?
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2,
            fontWeight: 400,
            color: '#6B7280',
            fontSize: '0.875rem',
            fontStyle: 'italic'
          }}
        >
          {babyProfile.name} • {babyAgeWeeks} weeks old
        </Typography>
      </Box>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            
            {/* Sleep Pattern */}
            <Card sx={{ 
              background: '#FEFEFE', 
              border: '1px solid #E5E7EB', 
              borderRadius: 8, 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
              }
            }}>
              <CardContent sx={{ p: 6 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#1F2937', 
                    fontWeight: 600,
                    fontFamily: '"Nunito", "Inter", sans-serif',
                    fontSize: '1.125rem'
                  }}
                >
                  <TrendingUp sx={{ mr: 2, color: '#F7C5CC' }} />
                  What did sleep look like this week? *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.sleepPattern}
                  onChange={(e) => handleInputChange('sleepPattern', e.target.value)}
                  error={!!errors.sleepPattern}
                  helperText={errors.sleepPattern || "Describe naps, night sleep, wake-ups, and any patterns you noticed"}
                  placeholder="e.g., Baby takes 3-4 short naps during the day, wakes up every 3 hours at night, and has trouble settling after night feeds..."
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 6,
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6B7280',
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Changes Tried */}
            <Card sx={{ 
              background: '#FEFEFE', 
              border: '1px solid #E5E7EB', 
              borderRadius: 8, 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
              }
            }}>
              <CardContent sx={{ p: 6 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#1F2937', 
                    fontWeight: 600,
                    fontFamily: '"Nunito", "Inter", sans-serif',
                    fontSize: '1.125rem'
                  }}
                >
                  <Refresh sx={{ mr: 2, color: '#F7C5CC' }} />
                  Any changes you tried this week?
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.changesTried}
                  onChange={(e) => handleInputChange('changesTried', e.target.value)}
                  placeholder="e.g., Started using white noise, tried a new bedtime routine, adjusted wake windows, introduced a lovey..."
                  helperText="What new strategies or routines did you experiment with?"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 6,
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6B7280',
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Biggest Challenge */}
            <Card sx={{ 
              background: '#FEFEFE', 
              border: '1px solid #E5E7EB', 
              borderRadius: 8, 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
              }
            }}>
              <CardContent sx={{ p: 6 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#1F2937', 
                    fontWeight: 600,
                    fontFamily: '"Nunito", "Inter", sans-serif',
                    fontSize: '1.125rem'
                  }}
                >
                  <Help sx={{ mr: 2, color: '#F7C5CC' }} />
                  What's been the biggest challenge? *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.biggestChallenge}
                  onChange={(e) => handleInputChange('biggestChallenge', e.target.value)}
                  error={!!errors.biggestChallenge}
                  helperText={errors.biggestChallenge || "What's been most difficult or frustrating this week?"}
                  placeholder="e.g., Getting baby to sleep without being held, managing night wakings, establishing a consistent schedule..."
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 6,
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6B7280',
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card sx={{ 
              background: '#FEFEFE', 
              border: '1px solid #E5E7EB', 
              borderRadius: 8, 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
              }
            }}>
              <CardContent sx={{ p: 6 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    color: '#1F2937', 
                    fontWeight: 600,
                    fontFamily: '"Nunito", "Inter", sans-serif',
                    fontSize: '1.125rem'
                  }}
                >
                  Additional notes (optional)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.parentNotes}
                  onChange={(e) => handleInputChange('parentNotes', e.target.value)}
                  placeholder="Any other observations, concerns, or context that might be helpful..."
                  helperText="Anything else you'd like us to know about this week"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 6,
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6B7280',
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Info Alert */}
            <Alert severity="info" icon={<Info />} sx={{ 
              background: '#F3F4F6',
              border: '1px solid #E5E7EB',
              borderRadius: 6,
              p: 3,
              '& .MuiAlert-icon': {
                color: '#6B7280',
                fontSize: '1.2rem'
              }
            }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 400, 
                color: '#6B7280', 
                fontSize: '0.875rem',
                fontStyle: 'italic'
              }}>
                Every baby is different, and sleep challenges are completely normal. 
                Our AI sleep consultant will provide personalized advice based on your specific situation.
              </Typography>
            </Alert>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              endIcon={!loading ? <span>→</span> : null}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1rem',
                background: '#2D3142',
                color: '#FFFFFF',
                borderRadius: 8,
                fontWeight: 600,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: '#1F2937',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
                transition: 'all 0.3s ease',
                fontFamily: '"Nunito", "Inter", sans-serif'
              }}
            >
              {loading ? 'Generating Your Sleep Summary...' : 'Get My Sleep Summary'}
            </Button>
          </Box>
        </form>
    </Box>
  );
};

export default WeeklyCheckIn; 
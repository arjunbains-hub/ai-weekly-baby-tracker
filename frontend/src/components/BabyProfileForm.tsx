import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { BabyProfile } from '../types/recipe';
import { ChildCare, Bedtime, Home, Info } from '@mui/icons-material';

interface BabyProfileFormProps {
  onSubmit: (profile: Omit<BabyProfile, 'id'>) => void;
  loading?: boolean;
}

const BabyProfileForm: React.FC<BabyProfileFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: null as Date | null,
    sleepSetup: '',
    sleepLocation: '',
    sleepChallenges: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sleepSetupOptions = [
    { value: 'Crib', label: 'Crib', description: 'Baby sleeps in their own crib' },
    { value: 'Contact naps', label: 'Contact naps', description: 'Baby naps on parent/caregiver' },
    { value: 'Co-sleeping', label: 'Co-sleeping', description: 'Baby sleeps in parent bed' },
    { value: 'Mixed', label: 'Mixed approach', description: 'Combination of different methods' }
  ];

  const sleepLocationOptions = [
    { value: 'Own room', label: 'Own room', description: 'Baby has their own bedroom' },
    { value: 'Parent\'s room', label: 'Parent\'s room', description: 'Baby sleeps in parent bedroom' },
    { value: 'Family bed', label: 'Family bed', description: 'Baby shares bed with parents' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Baby\'s name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const today = new Date();
      const birthDate = formData.dateOfBirth;
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
      // Check if baby is older than 12 months
      const ageInDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      if (ageInDays > 365) {
        newErrors.dateOfBirth = 'This app is designed for babies aged 0-12 months';
      }
    }

    if (!formData.sleepSetup) {
      newErrors.sleepSetup = 'Please select your baby\'s sleep setup';
    }

    if (!formData.sleepLocation) {
      newErrors.sleepLocation = 'Please select where your baby sleeps';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const profileData = {
      name: formData.name.trim(),
      dateOfBirth: formData.dateOfBirth!.toISOString().split('T')[0],
      sleepSetup: formData.sleepSetup,
      sleepLocation: formData.sleepLocation,
      sleepChallenges: formData.sleepChallenges.trim(),
      additionalNotes: formData.additionalNotes.trim()
    };

    onSubmit(profileData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <ChildCare sx={{ fontSize: 48, color: '#FF6B9D', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: '#2C3E50' }}>
            Welcome to Weekly Baby Sleep Genie
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Let's get to know your little one's sleep setup so we can provide personalized weekly sleep guidance.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Baby's Name */}
            <TextField
              fullWidth
              label="Baby's Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="Enter your baby's name"
            />

            {/* Date of Birth */}
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                handleInputChange('dateOfBirth', date);
              }}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/* Sleep Setup */}
            <FormControl fullWidth error={!!errors.sleepSetup}>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Bedtime sx={{ mr: 1, color: '#4ECDC4' }} />
                  How does your baby typically sleep?
                </Box>
              </FormLabel>
              <RadioGroup
                value={formData.sleepSetup}
                onChange={(e) => handleInputChange('sleepSetup', e.target.value)}
              >
                {sleepSetupOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {option.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    }
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      border: '1px solid #E8E8E8', 
                      borderRadius: 2,
                      '&:hover': { backgroundColor: '#F8F9FA' }
                    }}
                  />
                ))}
              </RadioGroup>
              {errors.sleepSetup && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {errors.sleepSetup}
                </Typography>
              )}
            </FormControl>

            {/* Sleep Location */}
            <FormControl fullWidth error={!!errors.sleepLocation}>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, color: '#2C3E50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Home sx={{ mr: 1, color: '#F39C12' }} />
                  Where does your baby sleep?
                </Box>
              </FormLabel>
              <RadioGroup
                value={formData.sleepLocation}
                onChange={(e) => handleInputChange('sleepLocation', e.target.value)}
              >
                {sleepLocationOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {option.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    }
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      border: '1px solid #E8E8E8', 
                      borderRadius: 2,
                      '&:hover': { backgroundColor: '#F8F9FA' }
                    }}
                  />
                ))}
              </RadioGroup>
              {errors.sleepLocation && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {errors.sleepLocation}
                </Typography>
              )}
            </FormControl>

            {/* Sleep Challenges */}
            <TextField
              fullWidth
              label="Any sleep challenges or concerns?"
              value={formData.sleepChallenges}
              onChange={(e) => handleInputChange('sleepChallenges', e.target.value)}
              multiline
              rows={3}
              placeholder="e.g., frequent night wakings, difficulty settling, short naps..."
              helperText="This helps us provide more targeted advice"
            />

            {/* Additional Notes */}
            <TextField
              fullWidth
              label="Additional notes (optional)"
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              multiline
              rows={2}
              placeholder="e.g., reflux, colic, medical conditions, or anything else we should know..."
              helperText="Any other information that might affect sleep"
            />

            {/* Info Alert */}
            <Alert severity="info" icon={<Info />}>
              <Typography variant="body2">
                <strong>Privacy Note:</strong> Your baby's information is stored locally and used only to provide personalized sleep guidance. We don't share your data with third parties.
              </Typography>
            </Alert>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #FF6B9D 30%, #FF5A8A 90%)',
                borderRadius: 3,
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF5A8A 30%, #FF4A7A 90%)',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Start My Sleep Journey'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default BabyProfileForm; 
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import { 
  ChildCare,
  Add,
  Remove,
  Info,
} from '@mui/icons-material';
import { UserProfileCreate, ChildInfo } from '../types/recipe';

// Custom SVG Mascot Component with gradient background
const BabyMascot = () => (
  <Box
    component="svg"
    width="60"
    height="60"
    viewBox="0 0 60 60"
    sx={{
      animation: 'bounce 2s infinite',
      '@keyframes bounce': {
        '0%, 20%, 50%, 80%, 100%': {
          transform: 'translateY(0)',
        },
        '40%': {
          transform: 'translateY(-10px)',
        },
        '60%': {
          transform: 'translateY(-5px)',
        },
      },
    }}
  >
    {/* Gradient background circle */}
    <defs>
      <linearGradient id="babyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F7C5CC" />
        <stop offset="100%" stopColor="#C6EBDD" />
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="25" fill="url(#babyGradient)" stroke="#2D3142" strokeWidth="1"/>
    <circle cx="25" cy="25" r="3" fill="#2D3142"/>
    <circle cx="35" cy="25" r="3" fill="#2D3142"/>
    <path d="M 25 35 Q 30 40 35 35" stroke="#2D3142" strokeWidth="2" fill="none"/>
    <circle cx="30" cy="15" r="2" fill="#2D3142"/>
  </Box>
);

// Age-based avatar component
const AgeAvatar = ({ ageYears, ageMonths }: { ageYears: number; ageMonths: number }) => {
  const totalMonths = ageYears * 12 + ageMonths;
  let avatarSize = 40;
  let emoji = '👶';
  
  if (totalMonths > 6) emoji = '👶';
  if (totalMonths > 12) emoji = '🧒';
  if (totalMonths > 18) emoji = '👧';
  if (totalMonths > 24) emoji = '👦';
  
  return (
    <Avatar
      sx={{
        width: avatarSize,
        height: avatarSize,
        fontSize: '1.2rem',
        backgroundColor: '#F7C5CC',
        color: '#2D3142',
        border: '2px solid #C6EBDD',
      }}
    >
      {emoji}
    </Avatar>
  );
};

interface UserProfileFormProps {
  onSubmit: (profile: Partial<UserProfileCreate>) => void;
  loading?: boolean;
}

export default function UserProfileForm({ onSubmit, loading = false }: UserProfileFormProps) {
  const [children, setChildren] = useState<ChildInfo[]>([{ ageYears: 0, ageMonths: 12 }]);
  const [errors, setErrors] = useState<string[]>([]);

  const addChild = () => {
    if (children.length < 5) {
      setChildren([...children, { ageYears: 0, ageMonths: 0 }]);
    }
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const updateChild = (index: number, field: 'ageYears' | 'ageMonths', value: number) => {
    const updatedChildren = [...children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    setChildren(updatedChildren);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (children.length === 0) {
      newErrors.push('Please add at least one child');
    }

    children.forEach((child, index) => {
      if (child.ageYears > 3) {
        newErrors.push(`Child ${index + 1}: Activities are designed for children aged 0-3 years`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSubmit({ children });
  };

  const getProTip = (child: ChildInfo) => {
    const totalMonths = child.ageYears * 12 + child.ageMonths;
    
    if (totalMonths < 6) {
      return "Perfect age for sensory play and gentle outdoor experiences!";
    } else if (totalMonths < 12) {
      return "Great time for crawling adventures and interactive activities!";
    } else if (totalMonths < 18) {
      return "Ready for walking adventures and simple crafts!";
    } else if (totalMonths < 24) {
      return "Perfect for active play and learning through exploration!";
    } else {
      return "Ready for more complex activities and social interactions!";
    }
  };

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
          <BabyMascot />
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
          Meet Your Little Explorers
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 1, 
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: 500,
            mx: 'auto',
            fontSize: '1rem',
            color: '#000000'
          }}
        >
          Tell us about your little ones so we can create the perfect weekend adventures
        </Typography>
      </Box>

      {/* Children Section */}
      <Card sx={{ 
        background: '#FFFFFF', 
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
            variant="h4" 
            sx={{ 
              mb: 6, 
              display: 'flex', 
              alignItems: 'center', 
              color: '#000000', 
              fontWeight: 700,
              fontFamily: '"Nunito", "Inter", sans-serif',
              fontSize: '1.5rem'
            }}
          >
            <ChildCare sx={{ mr: 2, color: '#F7C5CC' }} />
            Your Little Explorers
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 6,
              fontWeight: 400,
              lineHeight: 1.6,
              color: '#000000'
            }}
          >
            Tell us about your children (ages 0-3 years) so we can tailor activities just for them
          </Typography>
          
          {children.map((child, index) => (
            <Card key={index} sx={{ 
              p: 4, 
              mb: 4, 
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: 6,
              position: 'relative',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#D1D5DB',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                '& .hover-ring': {
                  boxShadow: '0 0 0 3px rgba(247, 197, 204, 0.1)',
                }
              }
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box display="flex" alignItems="center">
                  <AgeAvatar ageYears={child.ageYears} ageMonths={child.ageMonths} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      ml: 2,
                      fontFamily: '"Nunito", "Inter", sans-serif',
                      color: '#000000',
                      fontWeight: 600
                    }}
                  >
                    Baby {index + 1} – Age
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => removeChild(index)}
                  disabled={children.length === 1}
                  color="error"
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(239,68,68,0.1)',
                    '&:hover': { bgcolor: 'rgba(239,68,68,0.2)' }
                  }}
                >
                  <Remove />
                </IconButton>
              </Box>
              
              <Box display="flex" gap={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#6B7280', fontWeight: 500, fontSize: '0.875rem' }}>Years</InputLabel>
                  <Select
                    value={child.ageYears}
                    onChange={(e) => updateChild(index, 'ageYears', e.target.value as number)}
                    label="Years"
                    className="hover-ring"
                    sx={{ 
                      borderRadius: 6,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5E7EB',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#F7C5CC',
                        borderWidth: 2,
                      },
                    }}
                  >
                    {[0, 1, 2, 3].map(year => (
                      <MenuItem key={year} value={year}>
                        {year} {year === 1 ? 'year' : 'years'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#6B7280', fontWeight: 500, fontSize: '0.875rem' }}>Months</InputLabel>
                  <Select
                    value={child.ageMonths}
                    onChange={(e) => updateChild(index, 'ageMonths', e.target.value as number)}
                    label="Months"
                    className="hover-ring"
                    sx={{ 
                      borderRadius: 6,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5E7EB',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#F7C5CC',
                        borderWidth: 2,
                      },
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i).map(month => (
                      <MenuItem key={month} value={month}>
                        {month} {month === 1 ? 'month' : 'months'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Pro Tip for this child */}
              <Alert severity="info" icon={<Info />} sx={{ 
                mt: 4,
                background: '#F3F4F6',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
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
                  {getProTip(child)}
                </Typography>
              </Alert>
            </Card>
          ))}
          
          {children.length < 5 && (
            <Tooltip title="Add another child so we can tailor the plan to both of them" placement="top">
              <Button
                startIcon={<Add />}
                onClick={addChild}
                variant="outlined"
                fullWidth
                sx={{ 
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  borderRadius: 6,
                  py: 3,
                  px: 5,
                  fontWeight: 500,
                  fontSize: '1rem',
                  '&:hover': { 
                    borderColor: '#9CA3AF',
                    bgcolor: '#F9FAFB'
                  }
                }}
              >
                Add Another Explorer
              </Button>
            </Tooltip>
          )}
        </CardContent>
      </Card>

      {/* Progress Preview */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ 
          color: '#6B7280', 
          fontSize: '0.875rem',
          fontStyle: 'italic'
        }}>
          Up next: Choose your location
        </Typography>
      </Box>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mt: 4, borderRadius: 6 }}>
          {errors.map((error, index) => (
            <Typography key={index} variant="body2">
              {error}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Action Button */}
      <Box display="flex" justifyContent="center" mt={6}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          endIcon={!loading ? <span>→</span> : null}
          sx={{
            py: 3,
            px: 6,
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
          {loading ? 'Setting Up Adventure...' : 'Next: Choose your location'}
        </Button>
      </Box>
    </Box>
  );
} 
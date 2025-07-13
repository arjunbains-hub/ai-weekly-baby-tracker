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
  Slider,
  FormControlLabel,
  Switch,
  Checkbox,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Tooltip,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  LocationOn, 
  AttachMoney, 
  AccessTime, 
  DirectionsCar, 
  Person,
  Send,
  Info,
  ExpandMore,
  Favorite,
  FavoriteBorder,
  Restaurant,
  LocalActivity,
  ArrowBack,
  CheckCircle,
  Star,
  ThumbUp,
  ThumbDown,
  DirectionsBus,
  DirectionsWalk,
  DirectionsBike,
} from '@mui/icons-material';
import { WeekendRequest, UserProfile, ActivityPreferences } from '../types/recipe';

interface WeekendPlannerFormProps {
  userProfile: UserProfile;
  onSubmit: (request: WeekendRequest | { postcode: string; maxTravelTime: number; transportMode: 'car' | 'public' | 'walking' | 'cycling'; budget: number; startTime: string; endTime: string }) => void;
  loading?: boolean;
  onBack?: () => void;
  step: 'location' | 'preferences';
}

const activityTypes = [
  { 
    name: 'Parks & Playgrounds', 
    icon: '🌳', 
    description: 'Outdoor fun and fresh air',
    examples: 'Local parks, playgrounds, nature trails'
  },
  { 
    name: 'Museums & Galleries', 
    icon: '🏛️', 
    description: 'Educational and cultural experiences',
    examples: 'Science museums, art galleries, history exhibits'
  },
  { 
    name: 'Soft Play Centers', 
    icon: '🎠', 
    description: 'Indoor play areas for all ages',
    examples: 'Soft play gyms, indoor playgrounds, play cafes'
  },
  { 
    name: 'Farm Visits', 
    icon: '🐄', 
    description: 'Animal encounters and farm experiences',
    examples: 'Petting farms, farm shops, animal sanctuaries'
  },
  { 
    name: 'Aquariums & Zoos', 
    icon: '🐠', 
    description: 'Wildlife and marine life experiences',
    examples: 'Aquariums, zoos, wildlife parks'
  },
  { 
    name: 'Swimming Pools', 
    icon: '🏊', 
    description: 'Water activities and swimming',
    examples: 'Public pools, baby swimming, splash parks'
  },
  { 
    name: 'Libraries & Story Time', 
    icon: '📚', 
    description: 'Reading and educational activities',
    examples: 'Library story time, book clubs, reading corners'
  },
  { 
    name: 'Cafes & Restaurants', 
    icon: '☕', 
    description: 'Family dining and refreshments',
    examples: 'Baby-friendly cafes, family restaurants, play cafes'
  },
  { 
    name: 'Shopping Centers', 
    icon: '🛍️', 
    description: 'Indoor shopping and entertainment',
    examples: 'Malls with play areas, family shopping'
  },
  { 
    name: 'Nature Walks', 
    icon: '🌿', 
    description: 'Outdoor exploration and nature',
    examples: 'Nature trails, woodland walks, coastal paths'
  },
  { 
    name: 'Indoor Play Areas', 
    icon: '🎪', 
    description: 'Indoor entertainment and play',
    examples: 'Indoor playgrounds, play centers, activity rooms'
  },
  { 
    name: 'Educational Centers', 
    icon: '🎓', 
    description: 'Learning and discovery activities',
    examples: 'Science centers, discovery museums, learning labs'
  },
  { 
    name: 'Sports Activities', 
    icon: '⚽', 
    description: 'Physical activities and sports',
    examples: 'Baby gym classes, toddler sports, family fitness'
  },
  { 
    name: 'Arts & Crafts', 
    icon: '🎨', 
    description: 'Creative and artistic activities',
    examples: 'Art classes, craft workshops, creative play'
  },
  { 
    name: 'Music & Dance', 
    icon: '🎵', 
    description: 'Musical and movement activities',
    examples: 'Music classes, dance sessions, sing-alongs'
  },
];

const foodStyles = [
  { value: 'Family-friendly', label: 'Family-friendly', description: 'Casual, relaxed atmosphere with kids menus' },
  { value: 'Quick & Casual', label: 'Quick & Casual', description: 'Fast service, simple food, easy with kids' },
  { value: 'Healthy Options', label: 'Healthy Options', description: 'Nutritious meals, organic ingredients' },
  { value: 'International Cuisine', label: 'International Cuisine', description: 'Global flavors and diverse menus' },
  { value: 'Traditional British', label: 'Traditional British', description: 'Classic British pub food and comfort dishes' },
  { value: 'Vegetarian/Vegan', label: 'Vegetarian/Vegan', description: 'Plant-based options and dietary accommodations' },
  { value: 'Budget-friendly', label: 'Budget-friendly', description: 'Good value, affordable family meals' },
  { value: 'Fine Dining', label: 'Fine Dining', description: 'Special occasion restaurants with high-end service' },
];

const restaurantRequirements = [
  'High chairs available',
  'Changing facilities',
  'Kids menu',
  'Quiet atmosphere',
  'Outdoor seating',
  'Parking nearby',
  'Accessible entrance',
  'Breastfeeding friendly',
];

const transportModes = [
  { value: 'car', label: 'Car', icon: <DirectionsCar />, description: 'Most flexible, parking required' },
  { value: 'public', label: 'Public Transport', icon: <DirectionsBus />, description: 'Eco-friendly, no parking worries' },
  { value: 'walking', label: 'Walking', icon: <DirectionsWalk />, description: 'Healthy, stroller-friendly routes' },
  { value: 'cycling', label: 'Cycling', icon: <DirectionsBike />, description: 'Active, bike trailer options' },
];

const WeekendPlannerForm: React.FC<WeekendPlannerFormProps> = ({ 
  userProfile, 
  onSubmit, 
  loading = false,
  onBack,
  step
}) => {
  const [postcode, setPostcode] = useState(userProfile.postcode);
  const [maxTravelTime, setMaxTravelTime] = useState(userProfile.maxTravelTime);
  const [transportMode, setTransportMode] = useState(userProfile.transportMode);
  const [budget, setBudget] = useState(userProfile.budget);
  const [startTime, setStartTime] = useState(userProfile.startTime.split('T')[1]?.split(':').slice(0, 2).join(':') || '09:00');
  const [endTime, setEndTime] = useState(userProfile.endTime.split('T')[1]?.split(':').slice(0, 2).join(':') || '17:00');
  
  const [activityPreferences, setActivityPreferences] = useState<ActivityPreferences>({
    likedActivities: [],
    dislikedActivities: [],
    eatOut: false,
    foodStyle: '',
    restaurantRequirements: '',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (step === 'location') {
      if (!postcode || postcode.length < 5) {
        newErrors.push('Please enter a valid UK postcode');
      }
      if (budget < 10) {
        newErrors.push('Please set a minimum budget of £10');
      }
    } else if (step === 'preferences') {
      if (activityPreferences.likedActivities.length === 0 && activityPreferences.dislikedActivities.length === 0) {
        newErrors.push('Please select at least some activity preferences to help us create your perfect plan');
      }
      if (activityPreferences.eatOut && !activityPreferences.foodStyle) {
        newErrors.push('Please select a food style if you want to include dining options');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (step === 'location') {
      const locationData = {
        postcode: postcode.toUpperCase(),
        maxTravelTime,
        transportMode,
        budget,
        startTime: `2024-01-01T${startTime}:00`,
        endTime: `2024-01-01T${endTime}:00`,
      };
      onSubmit(locationData);
    } else if (step === 'preferences') {
      const requestData: WeekendRequest = {
        userId: userProfile.id,
        children: userProfile.children,
        postcode: userProfile.postcode,
        maxTravelTime: userProfile.maxTravelTime,
        transportMode: userProfile.transportMode,
        budget: userProfile.budget,
        startTime: userProfile.startTime,
        endTime: userProfile.endTime,
        activityPreferences,
      };
      onSubmit(requestData);
    }
  };

  const toggleActivity = (activity: string, isLiked: boolean) => {
    setActivityPreferences(prev => {
      const newPrefs = { ...prev };
      
      if (isLiked) {
        newPrefs.dislikedActivities = newPrefs.dislikedActivities.filter(a => a !== activity);
        if (newPrefs.likedActivities.includes(activity)) {
          newPrefs.likedActivities = newPrefs.likedActivities.filter(a => a !== activity);
        } else {
          newPrefs.likedActivities = [...newPrefs.likedActivities, activity];
        }
      } else {
        newPrefs.likedActivities = newPrefs.likedActivities.filter(a => a !== activity);
        if (newPrefs.dislikedActivities.includes(activity)) {
          newPrefs.dislikedActivities = newPrefs.dislikedActivities.filter(a => a !== activity);
        } else {
          newPrefs.dislikedActivities = [...newPrefs.dislikedActivities, activity];
        }
      }
      
      return newPrefs;
    });
  };

  const renderLocationStep = () => (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 6, borderRadius: 8, background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 3, 
              fontWeight: 700, 
              color: '#111827', 
              fontSize: '1.875rem',
              fontFamily: '"Nunito", "Inter", sans-serif'
            }}
          >
            Where Are You Based?
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1, 
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: 500,
              mx: 'auto',
              fontSize: '0.875rem',
              color: '#6B7280'
            }}
          >
            We'll find amazing activities near you
          </Typography>
        </Box>

        {/* Location Section */}
        <Card sx={{ 
          mb: 4, 
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
              <LocationOn sx={{ mr: 2, color: '#F7C5CC' }} />
              Your Location
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              mb={4} 
              sx={{ 
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#374151'
              }}
            >
              Enter your postcode to discover nearby adventures
            </Typography>
            <TextField
              fullWidth
              label="Postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              required
              placeholder="e.g., KT1 1AA"
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 6,
                },
                '& .MuiInputLabel-root': {
                  color: '#6B7280',
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }
              }}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: '#F7C5CC' }} />,
              }}
            />
          </CardContent>
        </Card>

        {/* Transport Section */}
        <Card sx={{ 
          mb: 4, 
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
              <DirectionsCar sx={{ mr: 2, color: '#F7C5CC' }} />
              How Will You Travel?
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              mb={4} 
              sx={{ 
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#374151'
              }}
            >
              Choose your preferred transport mode
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={3}>
              {transportModes.map((mode) => (
                <Paper
                  key={mode.value}
                  variant={transportMode === mode.value ? "elevation" : "outlined"}
                  sx={{
                    p: 4,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: transportMode === mode.value ? 'rgba(247, 197, 204, 0.1)' : '#F9FAFB',
                    borderColor: transportMode === mode.value ? '#F7C5CC' : '#E5E7EB',
                    borderWidth: transportMode === mode.value ? 2 : 1,
                    borderRadius: 6,
                    '&:hover': {
                      bgcolor: 'rgba(247, 197, 204, 0.05)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                  onClick={() => setTransportMode(mode.value as any)}
                >
                  <Box display="flex" alignItems="center" gap={3}>
                    <Box sx={{ 
                      color: transportMode === mode.value ? '#F7C5CC' : '#6B7280',
                      fontSize: '1.5rem'
                    }}>
                      {mode.icon}
                    </Box>
                    <Box flex={1}>
                      <Typography 
                        variant="h6" 
                        fontWeight="600" 
                        color={transportMode === mode.value ? '#2D3142' : '#374151'}
                        sx={{ fontFamily: '"Nunito", "Inter", sans-serif' }}
                      >
                        {mode.label}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontWeight: 400,
                          color: '#6B7280'
                        }}
                      >
                        {mode.description}
                      </Typography>
                    </Box>
                    {transportMode === mode.value && (
                      <CheckCircle sx={{ color: '#F7C5CC', fontSize: '1.5rem' }} />
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Travel Time Section */}
        <Card sx={{ 
          mb: 4, 
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
              <AccessTime sx={{ mr: 2, color: '#F7C5CC' }} />
              Maximum Travel Time
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              mb={4} 
              sx={{ 
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#374151'
              }}
            >
              How far are you willing to travel from home?
            </Typography>
            <Box textAlign="center" mb={4}>
              <Typography 
                variant="h2" 
                color="#F7C5CC" 
                fontWeight="700"
                sx={{ fontFamily: '"Nunito", "Inter", sans-serif' }}
              >
                {maxTravelTime} min
              </Typography>
            </Box>
            <Slider
              value={maxTravelTime}
              onChange={(_, value) => setMaxTravelTime(value as number)}
              min={10}
              max={120}
              step={5}
              marks={[
                { value: 10, label: '10m' },
                { value: 30, label: '30m' },
                { value: 60, label: '1h' },
                { value: 120, label: '2h' },
              ]}
              valueLabelDisplay="auto"
              sx={{
                '& .MuiSlider-thumb': {
                  bgcolor: '#F7C5CC',
                  width: 20,
                  height: 20,
                },
                '& .MuiSlider-track': {
                  bgcolor: '#F7C5CC',
                  height: 4,
                },
                '& .MuiSlider-rail': {
                  bgcolor: 'rgba(247, 197, 204, 0.3)',
                  height: 4,
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Budget Section */}
        <Card sx={{ 
          mb: 4, 
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
              <AttachMoney sx={{ mr: 2, color: '#F7C5CC' }} />
              Your Budget
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              mb={4} 
              sx={{ 
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#374151'
              }}
            >
              How much would you like to spend on activities?
            </Typography>
            <Box textAlign="center" mb={4}>
              <Typography 
                variant="h2" 
                color="#F7C5CC" 
                fontWeight="700"
                sx={{ fontFamily: '"Nunito", "Inter", sans-serif' }}
              >
                £{budget}
              </Typography>
            </Box>
            <Slider
              value={budget}
              onChange={(_, value) => setBudget(value as number)}
              min={10}
              max={200}
              step={5}
              marks={[
                { value: 10, label: '£10' },
                { value: 50, label: '£50' },
                { value: 100, label: '£100' },
                { value: 200, label: '£200' },
              ]}
              valueLabelDisplay="auto"
              sx={{
                '& .MuiSlider-thumb': {
                  bgcolor: '#F7C5CC',
                  width: 20,
                  height: 20,
                },
                '& .MuiSlider-track': {
                  bgcolor: '#F7C5CC',
                  height: 4,
                },
                '& .MuiSlider-rail': {
                  bgcolor: 'rgba(247, 197, 204, 0.3)',
                  height: 4,
                }
              }}
            />
            <Typography 
              variant="caption" 
              color="text.secondary" 
              mt={2} 
              sx={{ 
                fontWeight: 400,
                color: '#6B7280',
                fontSize: '0.75rem'
              }}
            >
              This includes activities, food, and travel costs
            </Typography>
          </CardContent>
        </Card>

        {/* Time Section */}
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
              <AccessTime sx={{ mr: 2, color: '#F7C5CC' }} />
              When Will You Go?
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              mb={4} 
              sx={{ 
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#374151'
              }}
            >
              Choose your preferred time window
            </Typography>
            
            <Box display="flex" gap={4}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
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
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
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
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );

  const renderPreferencesStep = () => (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: 6, borderRadius: 8, background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 3, 
              fontWeight: 700, 
              color: '#111827', 
              fontSize: '1.875rem',
              fontFamily: '"Nunito", "Inter", sans-serif'
            }}
          >
            What Do You Love?
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1, 
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: 500,
              mx: 'auto',
              fontSize: '0.875rem',
              color: '#6B7280'
            }}
          >
            Help us create the perfect weekend plan for your family
          </Typography>
        </Box>

        {/* Activity Preferences */}
        <Card sx={{ 
          mb: 6, 
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
              <Favorite sx={{ mr: 2, color: '#F7C5CC' }} />
              Activity Preferences
            </Typography>
            
            {/* What You Love */}
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: '#374151', 
                  fontWeight: 600,
                  fontFamily: '"Nunito", "Inter", sans-serif'
                }}
              >
                <ThumbUp sx={{ mr: 2, color: '#C6EBDD' }} />
                What You Love
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                mb={3} 
                sx={{ 
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: '#6B7280'
                }}
              >
                Select activities your family enjoys
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {activityTypes.map((activity) => (
                  <Tooltip key={activity.name} title={activity.examples} arrow>
                    <Chip
                      label={`${activity.icon} ${activity.name}`}
                      onClick={() => toggleActivity(activity.name, true)}
                      color={activityPreferences.likedActivities.includes(activity.name) ? 'primary' : 'default'}
                      variant={activityPreferences.likedActivities.includes(activity.name) ? 'filled' : 'outlined'}
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        borderRadius: 6,
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          transition: 'transform 0.2s',
                        },
                        '&.MuiChip-filled': {
                          bgcolor: '#F7C5CC',
                          color: '#2D3142',
                          '&:hover': {
                            bgcolor: '#F0B8C0',
                          }
                        }
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>

            {/* What You'd Rather Avoid */}
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: '#374151', 
                  fontWeight: 600,
                  fontFamily: '"Nunito", "Inter", sans-serif'
                }}
              >
                <ThumbDown sx={{ mr: 2, color: '#F7C5CC' }} />
                What You'd Rather Avoid
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                mb={3} 
                sx={{ 
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: '#6B7280'
                }}
              >
                Select activities you'd prefer to skip
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {activityTypes.map((activity) => (
                  <Tooltip key={activity.name} title={activity.examples} arrow>
                    <Chip
                      label={`${activity.icon} ${activity.name}`}
                      onClick={() => toggleActivity(activity.name, false)}
                      color={activityPreferences.dislikedActivities.includes(activity.name) ? 'error' : 'default'}
                      variant={activityPreferences.dislikedActivities.includes(activity.name) ? 'filled' : 'outlined'}
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        borderRadius: 6,
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          transition: 'transform 0.2s',
                        },
                        '&.MuiChip-filled': {
                          bgcolor: '#F7C5CC',
                          color: '#2D3142',
                          '&:hover': {
                            bgcolor: '#F0B8C0',
                          }
                        }
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Food Preferences */}
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
              <Restaurant sx={{ mr: 2, color: '#F7C5CC' }} />
              Dining Preferences
            </Typography>
            
            <FormControl component="fieldset" sx={{ mb: 4 }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={activityPreferences.eatOut}
                      onChange={(e) => setActivityPreferences(prev => ({ ...prev, eatOut: e.target.checked }))}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#F7C5CC',
                          '&:hover': {
                            backgroundColor: 'rgba(247, 197, 204, 0.08)',
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#F7C5CC',
                        },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="600"
                        sx={{ fontFamily: '"Nunito", "Inter", sans-serif' }}
                      >
                        Include dining options in our plan
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontWeight: 400,
                          color: '#6B7280'
                        }}
                      >
                        We'll suggest family-friendly restaurants and cafes
                      </Typography>
                    </Box>
                  }
                />
              </FormGroup>
            </FormControl>

            {activityPreferences.eatOut && (
              <Box sx={{ mt: 4, animation: 'fadeIn 0.3s ease-in' }}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel>Preferred Food Style</InputLabel>
                  <Select
                    value={activityPreferences.foodStyle}
                    onChange={(e) => setActivityPreferences(prev => ({ ...prev, foodStyle: e.target.value }))}
                    label="Preferred Food Style"
                    sx={{ 
                      borderRadius: 6,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 6,
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6B7280',
                        fontWeight: 500,
                        fontSize: '0.875rem'
                      }
                    }}
                  >
                    {foodStyles.map((style) => (
                      <MenuItem key={style.value} value={style.value}>
                        <Box>
                          <Typography 
                            variant="body1" 
                            fontWeight="600"
                            sx={{ fontFamily: '"Nunito", "Inter", sans-serif' }}
                          >
                            {style.label}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ color: '#6B7280' }}
                          >
                            {style.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Accordion sx={{ 
                  background: '#F9FAFB', 
                  borderRadius: 6,
                  border: '1px solid #E5E7EB'
                }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="600"
                      sx={{ fontFamily: '"Nunito", "Inter", sans-serif' }}
                    >
                      Restaurant Requirements
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormGroup>
                      <Box display="flex" flexWrap="wrap" gap={3}>
                        {restaurantRequirements.map((req) => (
                          <Box key={req} minWidth="200px">
                            <FormControlLabel
                              control={<Checkbox />}
                              label={req}
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontSize: '0.875rem',
                                  color: '#374151'
                                }
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </FormGroup>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Any other specific requirements or preferences..."
                      sx={{ 
                        mt: 3, 
                        borderRadius: 6,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 6,
                        },
                        '& .MuiInputLabel-root': {
                          color: '#6B7280',
                          fontWeight: 500,
                          fontSize: '0.875rem'
                        }
                      }}
                      value={activityPreferences.restaurantRequirements}
                      onChange={(e) => setActivityPreferences(prev => ({ ...prev, restaurantRequirements: e.target.value }))}
                    />
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
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
          {step === 'location' ? <LocationOn sx={{ fontSize: 40, color: '#2D3142' }} /> : <LocalActivity sx={{ fontSize: 40, color: '#2D3142' }} />}
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
          {step === 'location' ? 'Choose Your Location' : 'What Do You Love?'}
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
          {step === 'location' 
            ? 'Tell us where you are and how you like to travel, so we can find the perfect activities nearby.'
            : 'Help us understand what activities your family enjoys most, so we can create the perfect weekend plan.'
          }
        </Typography>
        {step === 'preferences' && (
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
            {userProfile.children.length} child{userProfile.children.length > 1 ? 'ren' : ''} • {userProfile.postcode} • £{userProfile.budget} budget
          </Typography>
        )}
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {step === 'location' ? renderLocationStep() : renderPreferencesStep()}

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
              {step === 'location' 
                ? 'The more specific you are, the better we can tailor your adventure!' 
                : 'The more preferences you share, the better we can tailor your weekend plan. Don\'t worry if you\'re not sure - we\'ll suggest a great mix of activities!'
              }
            </Typography>
          </Alert>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert severity="error" sx={{ borderRadius: 6 }}>
              {errors.map((error, index) => (
                <Typography key={index} variant="body2">
                  {error}
                </Typography>
              ))}
            </Alert>
          )}

          {/* Action Buttons */}
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined"
              onClick={onBack}
              startIcon={<ArrowBack />}
              sx={{ 
                borderColor: '#D1D5DB',
                color: '#374151',
                borderRadius: 8,
                py: 2,
                px: 4,
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#9CA3AF',
                  bgcolor: '#F9FAFB'
                }
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
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
              {loading 
                ? 'Creating Your Plan...' 
                : step === 'location' 
                  ? 'Next: Choose Activities' 
                  : 'Get My Weekend Plan'
              }
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default WeekendPlannerForm; 
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Rating,
  Badge,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  AttachMoney,
  DirectionsCar,
  DirectionsWalk,
  DirectionsBus,
  DirectionsBike,
  Restaurant,
  Park,
  Museum,
  LocalActivity,
  Share,
  ArrowBack,
  ExpandMore,
  Star,
  ThumbUp,
  ThumbDown,
  Info,
  CheckCircle,
  Schedule,
  TrendingUp,
  EmojiEvents,
  Refresh,
} from '@mui/icons-material';
import { WeekendResponse, WeekendPlan, ActivityStop } from '../types/recipe';

interface WeekendResultsProps {
  results: WeekendResponse;
  onBack: () => void;
  onShare: () => void;
  onStartOver: () => void;
  loading?: boolean;
}

const WeekendResults: React.FC<WeekendResultsProps> = ({ 
  results, 
  onBack, 
  onShare, 
  onStartOver,
  loading = false 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<WeekendPlan | null>(results.plans[0] || null);

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'car': return <DirectionsCar />;
      case 'walking': return <DirectionsWalk />;
      case 'public': return <DirectionsBus />;
      case 'cycling': return <DirectionsBike />;
      default: return <DirectionsCar />;
    }
  };

  const getActivityIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'parks & playgrounds':
      case 'park': return <Park />;
      case 'museums & galleries':
      case 'museum': return <Museum />;
      case 'cafes & restaurants':
      case 'restaurant': return <Restaurant />;
      default: return <LocalActivity />;
    }
  };

  const formatTime = (time: string) => {
    return time.replace(':', 'h');
  };

  const getPlanRating = (plan: WeekendPlan) => {
    // Simple rating based on variety and cost efficiency
    const varietyScore = plan.stops.length / 3; // More stops = better variety
    const costScore = Math.max(0, 1 - (plan.totalCost / 100)); // Lower cost = better
    const travelScore = Math.max(0, 1 - (plan.totalTravelTime / 120)); // Less travel = better
    
    return Math.min(5, (varietyScore + costScore + travelScore) / 3 * 5);
  };

  const renderStepByStepItinerary = (plan: WeekendPlan) => {
    let currentTime = new Date(`2024-01-01T${plan.stops[0]?.time.split('-')[0] || '09:00'}`);
    
    return (
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {plan.stops.map((stop, index) => {
          const arrivalTime = new Date(currentTime);
          const duration = stop.duration || 90; // Default 90 minutes
          const departureTime = new Date(arrivalTime.getTime() + duration * 60000);
          
          // Calculate travel time to next stop
          const nextStop = plan.stops[index + 1];
          const travelTime = nextStop ? stop.travelTime : 0;
          
          const step = (
            <ListItem key={index} sx={{ 
              flexDirection: 'column', 
              alignItems: 'stretch',
              mb: 2,
              p: 0
            }}>
              {/* Activity Card */}
              <Card sx={{ 
                mb: 2, 
                background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                border: '2px solid #E2E8F0',
                borderRadius: 3
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ 
                      bgcolor: '#6366F1', 
                      mr: 2,
                      width: 48,
                      height: 48
                    }}>
                      {getActivityIcon(stop.category)}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold" color="#1F2937">
                        {stop.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {stop.category}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`£${stop.cost}`}
                      color={stop.cost === 0 ? "success" : "primary"}
                      variant="filled"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={2}>
                    <Schedule sx={{ mr: 1, color: '#6366F1' }} />
                    <Typography variant="body1" fontWeight="600" color="#6366F1">
                      {arrivalTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - {departureTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
                      ({duration} min)
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={2} sx={{ fontWeight: 500 }}>
                    {stop.location}
                  </Typography>
                  
                  <Typography variant="body1" mb={2} sx={{ fontWeight: 500 }}>
                    {stop.note}
                  </Typography>
                  
                  {/* Top Tips */}
                  {stop.topTips.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" fontWeight="bold" color="#10B981" mb={1}>
                        💡 Top Tips:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {stop.topTips.map((tip, tipIndex) => (
                          <Chip 
                            key={tipIndex}
                            label={tip}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: '#10B981',
                              color: '#10B981',
                              fontWeight: 500
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {/* Pros & Cons */}
                  <Box display="flex" gap={2}>
                    {stop.pros.length > 0 && (
                      <Box flex={1}>
                        <Typography variant="subtitle2" fontWeight="bold" color="#10B981" mb={1}>
                          <ThumbUp sx={{ fontSize: 16, mr: 0.5 }} />
                          Pros:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                          {stop.pros.slice(0, 2).map((pro, proIndex) => (
                            <Chip 
                              key={proIndex}
                              label={pro}
                              size="small"
                              sx={{ 
                                bgcolor: '#D1FAE5',
                                color: '#065F46',
                                fontWeight: 500,
                                fontSize: '0.7rem'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {stop.cons.length > 0 && (
                      <Box flex={1}>
                        <Typography variant="subtitle2" fontWeight="bold" color="#EF4444" mb={1}>
                          <ThumbDown sx={{ fontSize: 16, mr: 0.5 }} />
                          Cons:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                          {stop.cons.slice(0, 2).map((con, conIndex) => (
                            <Chip 
                              key={conIndex}
                              label={con}
                              size="small"
                              sx={{ 
                                bgcolor: '#FEE2E2',
                                color: '#991B1B',
                                fontWeight: 500,
                                fontSize: '0.7rem'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
              
              {/* Travel to next stop */}
              {nextStop && (
                <Box display="flex" alignItems="center" mb={2} sx={{ pl: 2 }}>
                  <Box sx={{ 
                    width: 2, 
                    height: 40, 
                    bgcolor: '#E5E7EB',
                    mr: 3,
                    borderRadius: 1
                  }} />
                  <Box display="flex" alignItems="center" sx={{ 
                    bgcolor: '#F3F4F6',
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid #E5E7EB'
                  }}>
                    {getTransportIcon('car')}
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
                      {travelTime} min drive to {nextStop.name}
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {/* Update current time for next iteration */}
              {(() => {
                currentTime = new Date(departureTime.getTime() + (travelTime * 60000));
                return null;
              })()}
            </ListItem>
          );
          
          return step;
        })}
      </List>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
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
          <EmojiEvents sx={{ fontSize: 40, color: '#2D3142' }} />
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
          Your Perfect Weekend
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
          We've created {results.plans.length} amazing plans just for you
        </Typography>
      </Box>

        {/* Weather Summary */}
        <Alert severity="info" icon={<Info />} sx={{ 
          mb: 6,
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
            {results.weatherSummary}
          </Typography>
        </Alert>

        {/* Plan Selection */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              fontWeight: 600, 
              color: '#1F2937',
              fontFamily: '"Nunito", "Inter", sans-serif',
              fontSize: '1.25rem'
            }}
          >
            Choose Your Adventure
          </Typography>
          <Box display="flex" gap={3} sx={{ flexWrap: 'wrap' }}>
            {results.plans.map((plan, index) => (
              <Card
                key={index}
                sx={{
                  flex: 1,
                  minWidth: 280,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: selectedPlan === plan ? '2px solid #F7C5CC' : '1px solid #E5E7EB',
                  borderRadius: 8,
                  background: '#FEFEFE',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.1)',
                  }
                }}
                onClick={() => setSelectedPlan(plan)}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ 
                      bgcolor: selectedPlan === plan ? '#F7C5CC' : '#F3F4F6',
                      color: selectedPlan === plan ? '#2D3142' : '#6B7280',
                      mr: 2,
                      width: 40,
                      height: 40
                    }}>
                      {index + 1}
                    </Avatar>
                    <Box flex={1}>
                      <Typography 
                        variant="h6" 
                        fontWeight="600" 
                        color="#1F2937"
                        sx={{ fontFamily: '"Nunito", "Inter", sans-serif' }}
                      >
                        {plan.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontWeight: 400,
                          color: '#6B7280'
                        }}
                      >
                        {plan.stops.length} stops • {plan.totalDuration}
                      </Typography>
                    </Box>
                    <Rating 
                      value={getPlanRating(plan)} 
                      readOnly 
                      size="small"
                      sx={{ color: '#F7C5CC' }}
                    />
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center">
                      <AttachMoney sx={{ color: '#C6EBDD', mr: 1 }} />
                      <Typography 
                        variant="body1" 
                        fontWeight="600" 
                        color="#2D3142"
                        sx={{ fontFamily: '"Nunito", "Inter", sans-serif' }}
                      >
                        £{plan.totalCost}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <AccessTime sx={{ color: '#F7C5CC', mr: 1 }} />
                      <Typography 
                        variant="body1" 
                        fontWeight="600" 
                        color="#2D3142"
                        sx={{ fontFamily: '"Nunito", "Inter", sans-serif' }}
                      >
                        {plan.totalTravelTime}min travel
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {plan.stops.slice(0, 3).map((stop, stopIndex) => (
                      <Chip
                        key={stopIndex}
                        label={stop.name}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderColor: '#F7C5CC',
                          color: '#2D3142',
                          fontWeight: 500,
                          borderRadius: 6
                        }}
                      />
                    ))}
                    {plan.stops.length > 3 && (
                      <Chip
                        label={`+${plan.stops.length - 3} more`}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderColor: '#6B7280',
                          color: '#6B7280',
                          fontWeight: 500,
                          borderRadius: 6
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Selected Plan Details */}
        {selectedPlan && (
          <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#1F2937' }}>
              {selectedPlan.title}
            </Typography>
            
            {/* Plan Summary */}
            <Card sx={{ 
              mb: 4, 
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              border: '2px solid #F59E0B',
              borderRadius: 3
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                  <Box display="flex" alignItems="center">
                    <AttachMoney sx={{ color: '#F59E0B', mr: 1, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="#92400E">
                        Total Cost: £{selectedPlan.totalCost}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Estimated spend: £{selectedPlan.estimatedSpend}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center">
                    <AccessTime sx={{ color: '#F59E0B', mr: 1, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="#92400E">
                        Duration: {selectedPlan.totalDuration}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Travel time: {selectedPlan.totalTravelTime} minutes
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center">
                    <TrendingUp sx={{ color: '#F59E0B', mr: 1, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="#92400E">
                        Rating: {getPlanRating(selectedPlan).toFixed(1)}/5
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {selectedPlan.stops.length} activities
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Step-by-Step Itinerary */}
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#1F2937' }}>
              Your Step-by-Step Itinerary 🗺️
            </Typography>
            
            {renderStepByStepItinerary(selectedPlan)}
          </Box>
        )}

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" mt={6} flexWrap="wrap" gap={3}>
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
            Back to Preferences
          </Button>
          
          <Box display="flex" gap={3}>
            <Button
              variant="outlined"
              onClick={onStartOver}
              startIcon={<Refresh />}
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
              Start Over
            </Button>
            
            <Button
              variant="contained"
              onClick={onShare}
              startIcon={<Share />}
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
              Share Plan
            </Button>
          </Box>
        </Box>
    </Box>
  );
};

export default WeekendResults; 
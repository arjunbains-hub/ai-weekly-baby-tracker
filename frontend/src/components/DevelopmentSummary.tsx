import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { 
  Bedtime, 
  CheckCircle, 
  Warning, 
  Error,
  Share,
  Email,
  ArrowBack,
  Star,
  Psychology,
  AutoAwesome,
  PlayArrow,
  Chat,
  Favorite,
  Security,
  Schedule
} from '@mui/icons-material';
import { BabySleepResponse } from '../types/recipe';

interface SleepSummaryProps {
  response: BabySleepResponse;
  onStartOver: () => void;
}

const SleepSummary: React.FC<SleepSummaryProps> = ({ response, onStartOver }) => {
  const [sharingEmail, setSharingEmail] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [sharing, setSharing] = useState(false);

  const { summary, babyAgeWeeks } = response;
  const { sleepRating, sleepPlan, sources } = summary;

  // Extract baby name from summary (this would ideally come from props)
  const getBabyName = (summaryText: string): string => {
    const nameMatch = summaryText.match(/(?:baby|child)\s+(\w+)/i);
    return nameMatch ? nameMatch[1] : 'your baby';
  };

  const getSleepRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'improving': return '#10B981';
      case 'settling': return '#F59E0B';
      case 'still tough': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSleepRatingBgColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'improving': return '#D1FAE5';
      case 'settling': return '#FEF3C7';
      case 'still tough': return '#FEE2E2';
      default: return '#F3F4F6';
    }
  };

  const getSleepRatingIcon = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'improving': return <CheckCircle sx={{ fontSize: 32, color: '#10B981' }} />;
      case 'settling': return <Warning sx={{ fontSize: 32, color: '#F59E0B' }} />;
      case 'still tough': return <Error sx={{ fontSize: 32, color: '#EF4444' }} />;
      default: return <Star sx={{ fontSize: 32, color: '#6B7280' }} />;
    }
  };

  const getSleepRatingText = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'improving': return 'Sleep is Improving!';
      case 'settling': return 'Sleep is Settling';
      case 'still tough': return 'Sleep Still Tough';
      default: return 'Sleep Progress';
    }
  };

  const getSleepRatingDescription = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'improving': return 'Great progress! Your baby\'s sleep patterns are showing positive changes.';
      case 'settling': return 'Your baby\'s sleep is starting to improve — keep up the consistent routines.';
      case 'still tough': return 'Sleep challenges are normal at this age. We\'ll focus on gentle strategies.';
      default: return 'Your baby\'s sleep is developing at their own pace.';
    }
  };

  // Categorize sleep strategies with descriptions
  const categorizeSleepStrategies = (strategies: string[]) => {
    const categories: Record<string, Array<{title: string, description: string}>> = {
      routine: strategies.filter(s => 
        s.toLowerCase().includes('routine') || 
        s.toLowerCase().includes('schedule') || 
        s.toLowerCase().includes('bedtime') ||
        s.toLowerCase().includes('wake window') ||
        s.toLowerCase().includes('timing') ||
        s.toLowerCase().includes('consistent')
      ).map(strategy => ({
        title: strategy,
        description: getStrategyDescription(strategy, 'routine')
      })),
      environment: strategies.filter(s => 
        s.toLowerCase().includes('white noise') || 
        s.toLowerCase().includes('dark') || 
        s.toLowerCase().includes('temperature') ||
        s.toLowerCase().includes('crib') ||
        s.toLowerCase().includes('room') ||
        s.toLowerCase().includes('swaddle') ||
        s.toLowerCase().includes('sleep sack')
      ).map(strategy => ({
        title: strategy,
        description: getStrategyDescription(strategy, 'environment')
      })),
      soothing: strategies.filter(s => 
        s.toLowerCase().includes('soothing') || 
        s.toLowerCase().includes('comfort') || 
        s.toLowerCase().includes('calm') ||
        s.toLowerCase().includes('gentle') ||
        s.toLowerCase().includes('pat') ||
        s.toLowerCase().includes('rock') ||
        s.toLowerCase().includes('shush')
      ).map(strategy => ({
        title: strategy,
        description: getStrategyDescription(strategy, 'soothing')
      })),
      other: strategies.filter(s => 
        !s.toLowerCase().includes('routine') && 
        !s.toLowerCase().includes('schedule') && 
        !s.toLowerCase().includes('bedtime') &&
        !s.toLowerCase().includes('wake window') &&
        !s.toLowerCase().includes('timing') &&
        !s.toLowerCase().includes('consistent') &&
        !s.toLowerCase().includes('white noise') &&
        !s.toLowerCase().includes('dark') &&
        !s.toLowerCase().includes('temperature') &&
        !s.toLowerCase().includes('crib') &&
        !s.toLowerCase().includes('room') &&
        !s.toLowerCase().includes('swaddle') &&
        !s.toLowerCase().includes('sleep sack') &&
        !s.toLowerCase().includes('soothing') &&
        !s.toLowerCase().includes('comfort') &&
        !s.toLowerCase().includes('calm') &&
        !s.toLowerCase().includes('gentle') &&
        !s.toLowerCase().includes('pat') &&
        !s.toLowerCase().includes('rock') &&
        !s.toLowerCase().includes('shush')
      ).map(strategy => ({
        title: strategy,
        description: getStrategyDescription(strategy, 'other')
      }))
    };

    return categories;
  };

  const getStrategyDescription = (strategy: string, category: string): string => {
    const strategyLower = strategy.toLowerCase();
    
    if (category === 'routine') {
      if (strategyLower.includes('wake window')) return 'Helps regulate baby\'s natural sleep cycles';
      if (strategyLower.includes('bedtime')) return 'Creates predictable sleep associations';
      if (strategyLower.includes('consistent')) return 'Builds trust and security through predictability';
      return 'Establishes healthy sleep habits and patterns';
    }
    
    if (category === 'environment') {
      if (strategyLower.includes('white noise')) return 'Mimics womb sounds and blocks distractions';
      if (strategyLower.includes('dark')) return 'Promotes melatonin production';
      if (strategyLower.includes('swaddle')) return 'Provides security and prevents startle reflex';
      return 'Creates optimal conditions for sleep';
    }
    
    if (category === 'soothing') {
      if (strategyLower.includes('gentle')) return 'Builds trust without creating dependencies';
      if (strategyLower.includes('pat') || strategyLower.includes('rock')) return 'Provides rhythmic comfort and reassurance';
      return 'Helps baby feel safe and secure';
    }
    
    return 'Supports overall sleep development and well-being';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'routine': return <Schedule />;
      case 'environment': return <Bedtime />;
      case 'soothing': return <Favorite />;
      case 'other': return <Security />;
      default: return <Star />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'routine': return '#4ECDC4';
      case 'environment': return '#FF6B9D';
      case 'soothing': return '#F39C12';
      case 'other': return '#9B59B6';
      default: return '#95A5A6';
    }
  };

  const handleShareWithPartner = async () => {
    if (!sharingEmail) return;
    
    setSharing(true);
    try {
      // In a real app, this would call the backend to send an email
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowShareDialog(false);
      setSharingEmail('');
      // Show success message
      alert('Sleep summary sent to your partner!');
    } catch (error) {
      console.error('Error sharing summary:', error);
      alert('Failed to send summary. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const handleBookConsultation = () => {
    // In a real app, this would open Calendly or similar booking system
    window.open('https://calendly.com/sleep-consultant', '_blank');
  };

  const categorizedStrategies = categorizeSleepStrategies(sleepPlan);
  const babyName = getBabyName(summary.sleepSummary);

  // Format summary text with better structure
  const formatSummaryText = (text: string) => {
    return text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/•\s*(.*?)(?=<br>|<\/p>|$)/g, '• <strong>$1</strong>');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 4
    }}>
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
            Week {babyAgeWeeks} Sleep Summary
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: 600,
              mx: 'auto',
              fontSize: '1rem',
              color: '#000000'
            }}
          >
            Your personalized sleep guidance
          </Typography>
        </Box>

        {/* Sleep Rating Card */}
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
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 500,
                    color: '#6B7280',
                    fontSize: '0.875rem'
                  }}
                >
                  Baby's Name
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4, 
                    fontWeight: 600, 
                    color: '#1F2937',
                    fontFamily: '"Nunito", "Inter", sans-serif'
                  }}
                >
                  {babyName}
                </Typography>

                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 500,
                    color: '#6B7280',
                    fontSize: '0.875rem'
                  }}
                >
                  Age
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4, 
                    fontWeight: 600, 
                    color: '#1F2937',
                    fontFamily: '"Nunito", "Inter", sans-serif'
                  }}
                >
                  {babyAgeWeeks === 1 ? '7 days' : `Week ${babyAgeWeeks}`}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 500,
                    color: '#6B7280',
                    fontSize: '0.875rem'
                  }}
                >
                  Sleep Progress
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  p: 3,
                  borderRadius: 6,
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB'
                }}>
                  <Box sx={{ mr: 2 }}>
                    {getSleepRatingIcon(sleepRating)}
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#2D3142', 
                      fontWeight: 600,
                      fontFamily: '"Nunito", "Inter", sans-serif'
                    }}
                  >
                    {getSleepRatingText(sleepRating)}
                  </Typography>
                </Box>

                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 500,
                    color: '#6B7280',
                    fontSize: '0.875rem'
                  }}
                >
                  What this means
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.6, 
                    color: '#374151',
                    mb: 3,
                    fontWeight: 400
                  }}
                >
                  {getSleepRatingDescription(sleepRating)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AutoAwesome sx={{ mr: 2, color: '#F7C5CC', fontSize: 20 }} />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: 400,
                  color: '#6B7280',
                  fontSize: '0.875rem',
                  fontStyle: 'italic'
                }}
              >
                AI-powered insights from sleep experts
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* This Week's Sleep Summary */}
        <Card sx={{ 
          mb: 4, 
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              color: '#2C3E50'
            }}>
              <Psychology sx={{ mr: 2, color: '#4ECDC4' }} />
              This Week's Sleep Analysis
            </Typography>
            
            <Box sx={{ 
              '& h4': { 
                fontSize: '1.25rem', 
                fontWeight: 600, 
                color: '#2C3E50', 
                mt: 3, 
                mb: 1 
              },
              '& p': { 
                fontSize: '1rem', 
                lineHeight: 1.7, 
                color: '#34495E', 
                mb: 2 
              },
              '& strong': {
                fontWeight: 600,
                color: '#2C3E50'
              },
              '& ul': { 
                pl: 3, 
                mb: 2 
              },
              '& li': { 
                fontSize: '1rem', 
                lineHeight: 1.6, 
                color: '#34495E', 
                mb: 0.5 
              }
            }}>
              <div dangerouslySetInnerHTML={{ 
                __html: formatSummaryText(summary.sleepSummary)
              }} />
            </Box>

            <Box sx={{ 
              mt: 4, 
              pt: 3, 
              borderTop: '1px solid #E8E8E8',
              textAlign: 'center'
            }}>
              <Typography variant="body1" sx={{ 
                fontStyle: 'italic', 
                color: '#7F8C8D',
                mb: 1
              }}>
                Warm regards,
              </Typography>
              <Typography variant="h6" sx={{ 
                color: '#FF6B9D', 
                fontWeight: 600 
              }}>
                Your Sleep Consultant
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Suggested Sleep Strategies */}
        <Card sx={{ 
          mb: 4, 
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ 
              mb: 4, 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              color: '#2C3E50'
            }}>
              <Bedtime sx={{ mr: 2, color: '#FF6B9D' }} />
              This Week's Sleep Strategies
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Object.entries(categorizedStrategies).map(([category, strategies]) => (
                strategies.length > 0 && (
                  <Box key={category}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: `${getCategoryColor(category)}15`
                    }}>
                      <Box sx={{ 
                        color: getCategoryColor(category),
                        mr: 1
                      }}>
                        {getCategoryIcon(category)}
                      </Box>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 600,
                        color: getCategoryColor(category),
                        textTransform: 'capitalize'
                      }}>
                        {category === 'other' ? 'Other' : category}
                      </Typography>
                    </Box>
                    
                    <List dense>
                      {strategies.map((strategy, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon>
                            <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography sx={{ 
                                fontSize: '1rem',
                                fontWeight: 500,
                                lineHeight: 1.5,
                                color: '#2C3E50',
                                mb: 0.5
                              }}>
                                {strategy.title}
                              </Typography>
                            }
                            secondary={
                              <Typography sx={{ 
                                fontSize: '0.875rem',
                                lineHeight: 1.4,
                                color: '#6B7280',
                                fontStyle: 'italic'
                              }}>
                                {strategy.description}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Sources & Trust */}
        <Card sx={{ 
          mb: 4, 
          backgroundColor: '#FFF8E1',
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 600,
              color: '#F39C12'
            }}>
              <Star sx={{ mr: 2 }} />
              Sources & Trust
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {sources.map((source, index) => (
                <Chip
                  key={index}
                  label={source}
                  size="medium"
                  sx={{ 
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    color: '#F39C12',
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                />
              ))}
            </Box>
            
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              This plan was generated using your answers + expert data from trusted sleep resources.
            </Typography>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 3, 
          justifyContent: 'center',
          mt: 6
        }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onStartOver}
            startIcon={<ArrowBack />}
            sx={{ 
              px: 4, 
              py: 2,
              fontSize: '1rem',
              borderColor: '#D1D5DB',
              color: '#374151',
              borderRadius: 8,
              fontWeight: 500,
              '&:hover': {
                borderColor: '#9CA3AF',
                bgcolor: '#F9FAFB'
              }
            }}
          >
            Back to Check-In
          </Button>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowShareDialog(true)}
            startIcon={<Share />}
            sx={{ 
              px: 4, 
              py: 2,
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
            Share This Report
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={handleBookConsultation}
            sx={{ 
              px: 4, 
              py: 2,
              fontSize: '1rem',
              borderColor: '#D1D5DB',
              color: '#374151',
              borderRadius: 8,
              fontWeight: 500,
              '&:hover': {
                borderColor: '#9CA3AF',
                bgcolor: '#F9FAFB'
              }
            }}
          >
            Book Sleep Expert Call
          </Button>
        </Box>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1, color: '#4ECDC4' }} />
              Share This Report
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Share this week's sleep summary with your partner or family members.
            </Typography>
            
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={sharingEmail}
              onChange={(e) => setSharingEmail(e.target.value)}
              placeholder="partner@example.com"
              disabled={sharing}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setShowShareDialog(false)}
              disabled={sharing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleShareWithPartner}
              variant="contained"
              disabled={!sharingEmail || sharing}
              startIcon={sharing ? <CircularProgress size={20} /> : <Email />}
            >
              {sharing ? 'Sending...' : 'Send Report'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default SleepSummary; 
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Paper,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  IconButton
} from '@mui/material';
import { 
  Refresh, 
  Psychology, 
  Timer, 
  Restaurant, 
  Favorite,
  FavoriteBorder,
  ExpandMore,
  LocalDining,
  MonitorWeight,
  ShoppingCart
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { RecipeResponse, Recipe, SeasoningProfile } from '../types/recipe';

interface RecipeResultsProps {
  response: RecipeResponse;
  onNewRecipe: () => void;
  onSaveRecipe?: (recipe: Recipe) => void;
  onAddToShoppingList?: (ingredients: string[]) => void;
  savedRecipes?: string[];
  seasoningProfiles?: SeasoningProfile[];
}

const RecipeResults: React.FC<RecipeResultsProps> = ({ 
  response, 
  onNewRecipe, 
  onSaveRecipe,
  onAddToShoppingList,
  savedRecipes = [],
  seasoningProfiles = []
}) => {
  const getAgentIcon = (agentType?: string) => {
    if (!agentType) return '🍳';
    if (agentType.toLowerCase().includes('research')) return '🔍';
    if (agentType.toLowerCase().includes('recipe')) return '📝';
    if (agentType.toLowerCase().includes('nutrition')) return '🥗';
    if (agentType.toLowerCase().includes('seasoning')) return '🌶️';
    return '🤖';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getCalorieColor = (calories: number) => {
    if (calories < 500) return 'success';
    if (calories < 800) return 'warning';
    return 'error';
  };

  const formatTime = (time: string) => {
    return time.replace(/(\d+)/, '$1 min');
  };

  const isRecipeSaved = (recipeId: string) => {
    return savedRecipes.includes(recipeId);
  };

  // Provide default values for missing properties
  const agentType = response.agent_type || 'Recipe Creator';
  const routeTaken = response.route_taken || 'complete';

  return (
    <Box>
      {/* Agent Info Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4, 
        gap: 3,
        p: 3,
        background: 'rgba(0, 122, 255, 0.05)',
        borderRadius: 12,
        border: '1px solid rgba(0, 122, 255, 0.1)',
      }}>
        <Typography variant="h4" sx={{ fontSize: '2.5rem' }}>
          {getAgentIcon(agentType)}
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1D1D1F' }}>
            {agentType}
          </Typography>
          <Chip
            label={`Route: ${routeTaken}`}
            sx={{
              backgroundColor: 'rgba(0, 122, 255, 0.1)',
              color: '#007AFF',
              border: '1px solid rgba(0, 122, 255, 0.2)',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
            size="small"
            icon={<Psychology sx={{ fontSize: '1rem' }} />}
          />
        </Box>
      </Box>

      {/* Seasoning Suggestions */}
      {response.seasoning_suggestions && response.seasoning_suggestions.length > 0 && (
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid rgba(255, 193, 7, 0.2)',
          borderRadius: 12,
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <LocalDining sx={{ mr: 1 }} />
            Seasoning Suggestions
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {response.seasoning_suggestions.map((seasoning, index) => (
              <Chip
                key={index}
                label={seasoning}
                variant="outlined"
                sx={{ borderColor: 'rgba(255, 193, 7, 0.5)' }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Shopping List */}
      {response.shopping_list && response.shopping_list.length > 0 && (
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          borderRadius: 12,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <ShoppingCart sx={{ mr: 1 }} />
              Missing Ingredients
            </Typography>
            {onAddToShoppingList && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => onAddToShoppingList(response.shopping_list || [])}
                sx={{ borderColor: 'rgba(76, 175, 80, 0.5)', color: 'rgba(76, 175, 80, 0.8)' }}
              >
                Add All to List
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {response.shopping_list.map((item, index) => (
              <Chip
                key={index}
                label={item}
                variant="outlined"
                sx={{ borderColor: 'rgba(76, 175, 80, 0.5)' }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Recipes */}
      {response.recipes && response.recipes.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Your Recipes ({response.recipes.length})
          </Typography>
          
          {response.recipes.map((recipe, index) => (
            <Card key={recipe.id || index} sx={{ 
              mb: 3,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              borderRadius: 12,
            }}>
              <CardContent sx={{ p: 4 }}>
                {/* Recipe Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: '#1D1D1F' }}>
                      {recipe.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {recipe.description}
                    </Typography>
                    
                    {/* Recipe Meta */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip
                        label={recipe.cuisine}
                        size="small"
                        sx={{ backgroundColor: 'rgba(0, 122, 255, 0.1)', color: '#007AFF' }}
                      />
                      <Chip
                        label={recipe.difficulty}
                        size="small"
                        color={getDifficultyColor(recipe.difficulty) as any}
                      />
                      <Chip
                        icon={<Timer sx={{ fontSize: '1rem' }} />}
                        label={formatTime(recipe.cookingTime)}
                        size="small"
                      />
                      <Chip
                        icon={<Restaurant sx={{ fontSize: '1rem' }} />}
                        label={`${recipe.servings} servings`}
                        size="small"
                      />
                      {recipe.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={recipe.rating} readOnly size="small" />
                          <Typography variant="caption" sx={{ ml: 0.5 }}>
                            ({recipe.rating})
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {onSaveRecipe && (
                      <IconButton
                        onClick={() => onSaveRecipe(recipe)}
                        color={isRecipeSaved(recipe.id) ? 'primary' : 'default'}
                      >
                        {isRecipeSaved(recipe.id) ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    )}
                  </Box>
                </Box>

                {/* Nutrition Info */}
                <Paper sx={{ 
                  p: 2, 
                  mb: 3, 
                  background: 'rgba(248, 248, 248, 0.8)',
                  borderRadius: 8,
                }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <MonitorWeight sx={{ mr: 1 }} />
                    Nutrition (per serving)
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Chip
                      label={`${recipe.nutrition.calories} cal`}
                      size="small"
                      color={getCalorieColor(recipe.nutrition.calories) as any}
                    />
                    <Chip label={`${recipe.nutrition.protein}g protein`} size="small" />
                    <Chip label={`${recipe.nutrition.carbs}g carbs`} size="small" />
                    <Chip label={`${recipe.nutrition.fat}g fat`} size="small" />
                    <Chip label={`${recipe.nutrition.fiber}g fiber`} size="small" />
                  </Box>
                </Paper>

                {/* Ingredients */}
                <Accordion sx={{ mb: 2, borderRadius: 8 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Ingredients
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {recipe.ingredients.map((ingredient, idx) => (
                        <ListItem key={idx} sx={{ px: 0 }}>
                          <ListItemText
                            primary={`${ingredient.quantity} ${ingredient.unit || ''} ${ingredient.name}`}
                            primaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                {/* Instructions */}
                <Accordion sx={{ mb: 2, borderRadius: 8 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Instructions
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ 
                      '& ol': { pl: 2 },
                      '& li': { mb: 2, lineHeight: 1.6 },
                      '& strong': { fontWeight: 600 },
                    }}>
                      <ReactMarkdown>
                        {recipe.instructions.map(step => 
                          `${step.step}. ${step.instruction}${step.time ? ` (${step.time})` : ''}${step.tips ? `\n\n**Tip:** ${step.tips}` : ''}`
                        ).join('\n\n')}
                      </ReactMarkdown>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* Tips */}
                {recipe.tips && recipe.tips.length > 0 && (
                  <Accordion sx={{ mb: 2, borderRadius: 8 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Cooking Tips
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {recipe.tips.map((tip, idx) => (
                          <ListItem key={idx} sx={{ px: 0 }}>
                            <ListItemText
                              primary={tip}
                              primaryTypographyProps={{ fontStyle: 'italic' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Substitutions */}
                {recipe.substitutions && Object.keys(recipe.substitutions).length > 0 && (
                  <Accordion sx={{ borderRadius: 8 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Ingredient Substitutions
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {Object.entries(recipe.substitutions).map(([original, substitutes]) => (
                        <Box key={original} sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            {original}:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {substitutes.map((sub, idx) => (
                              <Chip key={idx} label={sub} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Raw Result */}
      {response.result && (
        <Paper sx={{ 
          p: 4,
          background: 'rgba(248, 248, 248, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          borderRadius: 12,
          maxHeight: '400px',
          overflow: 'auto',
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Additional Information
          </Typography>
          <Box sx={{ 
            '& p': { mb: 2, lineHeight: 1.6 },
            '& ul, & ol': { pl: 2 },
            '& li': { mb: 1 },
          }}>
            <ReactMarkdown>
              {response.result}
            </ReactMarkdown>
          </Box>
        </Paper>
      )}

      {/* Action Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={onNewRecipe}
          startIcon={<Refresh />}
          sx={{ 
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 12,
            borderColor: '#007AFF',
            color: '#007AFF',
            '&:hover': {
              borderColor: '#0056CC',
              backgroundColor: 'rgba(0, 122, 255, 0.05)',
              transform: 'translateY(-1px)',
              boxShadow: '0px 4px 12px rgba(0, 122, 255, 0.2)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Create Another Recipe
        </Button>
      </Box>
    </Box>
  );
};

export default RecipeResults;

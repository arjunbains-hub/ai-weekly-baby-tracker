import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  SelectChangeEvent,
  Typography,
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Add, Delete, Restaurant, Timer, LocalDining } from '@mui/icons-material';
import { RecipeRequest, Ingredient, SeasoningProfile } from '../types/recipe';

interface RecipeFormProps {
  onSubmit: (recipeRequest: RecipeRequest) => void;
  loading: boolean;
  seasoningProfiles?: SeasoningProfile[];
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit, loading, seasoningProfiles = [] }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: '', unit: '' }
  ]);
  const [formData, setFormData] = useState<Partial<RecipeRequest>>({
    cuisine: '',
    difficulty: undefined,
    cookingTime: undefined,
    calorieRange: undefined,
    dietaryRestrictions: [],
    seasoningProfileId: '',
    servings: 4,
  });

  const cuisines = [
    'Italian', 'Mexican', 'Indian', 'Thai', 'Chinese', 'Japanese', 'Mediterranean',
    'French', 'Greek', 'Spanish', 'Korean', 'Vietnamese', 'Middle Eastern', 'American',
    'Caribbean', 'African', 'British', 'German', 'Russian', 'Scandinavian'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo',
    'Low-Carb', 'Low-Sodium', 'Nut-Free', 'Halal', 'Kosher'
  ];

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDietaryChange = (restriction: string) => {
    const current = formData.dietaryRestrictions || [];
    const updated = current.includes(restriction)
      ? current.filter(r => r !== restriction)
      : [...current, restriction];
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: updated
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validIngredients = ingredients.filter(ing => ing.name.trim() && ing.quantity.trim());
    
    if (validIngredients.length > 0) {
      const recipeRequest: RecipeRequest = {
        ingredients: validIngredients,
        cuisine: formData.cuisine || undefined,
        difficulty: formData.difficulty as any || undefined,
        cookingTime: formData.cookingTime as any || undefined,
        calorieRange: formData.calorieRange as any || undefined,
        dietaryRestrictions: formData.dietaryRestrictions || undefined,
        seasoningProfileId: formData.seasoningProfileId || undefined,
        servings: formData.servings || 4,
      };
      onSubmit(recipeRequest);
    }
  };

  const isFormValid = ingredients.some(ing => ing.name.trim() && ing.quantity.trim());

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
        Tell us what ingredients you have, and we'll create delicious recipes just for you!
      </Typography>
      
      {/* Ingredients Section */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
        <Restaurant sx={{ mr: 1 }} />
        Available Ingredients
      </Typography>
      
      {ingredients.map((ingredient, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <TextField
              fullWidth
              label="Ingredient"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              placeholder="e.g., chicken breast"
              disabled={loading}
            />
          </Box>
          <Box sx={{ flex: '0 1 120px', minWidth: '120px' }}>
            <TextField
              fullWidth
              label="Quantity"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
              placeholder="2"
              disabled={loading}
            />
          </Box>
          <Box sx={{ flex: '0 1 100px', minWidth: '100px' }}>
            <TextField
              fullWidth
              label="Unit"
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              placeholder="lbs"
              disabled={loading}
            />
          </Box>
          <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => removeIngredient(index)}
              disabled={loading || ingredients.length === 1}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>
      ))}
      
      <Button
        startIcon={<Add />}
        onClick={addIngredient}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        Add Ingredient
      </Button>

      <Divider sx={{ my: 3 }} />

      {/* Recipe Preferences */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
        <LocalDining sx={{ mr: 1 }} />
        Recipe Preferences
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel>Cuisine (Optional)</InputLabel>
            <Select
              name="cuisine"
              value={formData.cuisine || ''}
              label="Cuisine (Optional)"
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em>Any cuisine</em>
              </MenuItem>
              {cuisines.map(cuisine => (
                <MenuItem key={cuisine} value={cuisine}>{cuisine}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel>Difficulty (Optional)</InputLabel>
            <Select
              name="difficulty"
              value={formData.difficulty || ''}
              label="Difficulty (Optional)"
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em>Any difficulty</em>
              </MenuItem>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel>Cooking Time (Optional)</InputLabel>
            <Select
              name="cookingTime"
              value={formData.cookingTime || ''}
              label="Cooking Time (Optional)"
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em>Any time</em>
              </MenuItem>
              <MenuItem value="quick">Quick (15-30 min)</MenuItem>
              <MenuItem value="medium">Medium (30-60 min)</MenuItem>
              <MenuItem value="slow">Slow (60+ min)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel>Calorie Range (Optional)</InputLabel>
            <Select
              name="calorieRange"
              value={formData.calorieRange || ''}
              label="Calorie Range (Optional)"
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em>Any calories</em>
              </MenuItem>
              <MenuItem value="low">Low (300-500)</MenuItem>
              <MenuItem value="medium">Medium (500-800)</MenuItem>
              <MenuItem value="high">High (800-1200+)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <TextField
            fullWidth
            name="servings"
            label="Servings"
            type="number"
            value={formData.servings || 4}
            onChange={handleInputChange}
            disabled={loading}
            inputProps={{ min: 1, max: 12 }}
          />
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel>Seasoning Profile (Optional)</InputLabel>
            <Select
              name="seasoningProfileId"
              value={formData.seasoningProfileId || ''}
              label="Seasoning Profile (Optional)"
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em>No preference</em>
              </MenuItem>
              {seasoningProfiles.map(profile => (
                <MenuItem key={profile.id} value={profile.id}>{profile.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Dietary Restrictions */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        Dietary Restrictions (Optional)
      </Typography>
      <Box sx={{ mb: 3 }}>
        {dietaryOptions.map(option => (
          <Chip
            key={option}
            label={option}
            onClick={() => handleDietaryChange(option)}
            color={(formData.dietaryRestrictions || []).includes(option) ? 'primary' : 'default'}
            variant={(formData.dietaryRestrictions || []).includes(option) ? 'filled' : 'outlined'}
            sx={{ mr: 1, mb: 1 }}
            disabled={loading}
          />
        ))}
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={!isFormValid || loading}
        startIcon={loading ? <CircularProgress size={20} /> : <Timer />}
        sx={{ 
          mt: 4, 
          mb: 2, 
          py: 2,
          fontSize: '1rem',
          fontWeight: 600,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0056CC 0%, #4A4AC4 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0px 8px 25px rgba(0, 122, 255, 0.3)',
          },
          '&:disabled': {
            background: 'rgba(0, 0, 0, 0.12)',
            color: 'rgba(0, 0, 0, 0.38)',
            transform: 'none',
            boxShadow: 'none',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {loading ? 'Creating Your Recipe...' : 'Create Recipe'}
      </Button>
    </Box>
  );
};

export default RecipeForm;

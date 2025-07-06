# AI Recipe Creator

A personalized recipe creation application that generates custom recipes based on available ingredients, user preferences, and dietary requirements. Powered by LangGraph, OpenAI, and Arize observability.

## 🍳 Core Features

- **Ingredient-Based Recipe Generation**: Create recipes from available ingredients with smart substitutions
- **Persistent Seasoning Profiles**: Save and reuse your favorite seasoning combinations
- **Calorie-Aware Options**: Get recipes with detailed nutritional information
- **Global Cuisine Navigation**: Explore 20+ world cuisines with cultural context
- **Dietary Restrictions Support**: Keto, vegetarian, vegan, gluten-free, and more

## Architecture

### Frontend (React + TypeScript)
- Modern Apple-inspired Material-UI interface
- Dynamic ingredient input with add/remove functionality
- Comprehensive recipe display with nutrition info
- Seasoning profile management
- Shopping list generation

### Backend (FastAPI + LangGraph)
- **Sequential LangGraph Workflow**: 
  - Ingredient Analysis Node: Recipe possibilities and substitutions
  - Cuisine Research Node: Cooking techniques and flavor profiles
  - Nutrition Calculation Node: Calorie and macro breakdown
  - Recipe Generation Node: Complete recipe with instructions
- **OpenAI GPT-4o-mini**: Creative recipe generation with 0.7 temperature
- **Comprehensive Tracing**: LangChain + LiteLLM instrumentation

## Quick Start

### 1. Setup Environment

Create a `.env` file in the `backend/` directory:

```bash
# Required: OpenAI API Key (get from https://platform.openai.com)
OPENAI_API_KEY=your_openai_api_key_here

# Required: Arize observability (get from https://app.arize.com)
ARIZE_SPACE_ID=your_arize_space_id
ARIZE_API_KEY=your_arize_api_key

# Optional: For web search capabilities
TAVILY_API_KEY=your_tavily_api_key

# LiteLLM Configuration
LITELLM_LOG=DEBUG
```

### 2. Install Dependencies

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend  
cd ../frontend
npm install
```

### 3. Run the Application

```bash
# Start both services
./start.sh

# Or run separately:
# Backend: cd backend && python main.py
# Frontend: cd frontend && npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Recipe Creation Workflow

### 🔄 Sequential Graph Execution
1. **Ingredient Analysis**: Analyzes available ingredients and suggests recipe possibilities
2. **Cuisine Research**: Researches cooking techniques and flavor profiles for the selected cuisine
3. **Nutrition Calculation**: Calculates approximate nutritional information per serving
4. **Recipe Generation**: Creates complete recipe with instructions, tips, and substitutions

### 📊 Recipe Features
- **Smart Substitutions**: Suggests alternatives for missing ingredients
- **Nutritional Breakdown**: Calories, protein, carbs, fat, and fiber per serving
- **Cooking Tips**: Step-by-step instructions with timing and helpful tips
- **Cultural Context**: Information about cooking techniques and traditional methods

## API Endpoints

### POST `/create-recipe`
Creates a personalized recipe based on available ingredients and preferences.

**Request:**
```json
{
  "ingredients": [
    {
      "name": "chicken breast",
      "quantity": "2",
      "unit": "lbs"
    },
    {
      "name": "rice",
      "quantity": "1",
      "unit": "cup"
    }
  ],
  "cuisine": "Italian",
  "difficulty": "intermediate",
  "cookingTime": "medium",
  "calorieRange": "medium",
  "dietaryRestrictions": ["gluten-free"],
  "servings": 4
}
```

**Response:**
```json
{
  "recipes": [
    {
      "id": "recipe_1",
      "title": "Italian Chicken and Rice",
      "description": "A delicious Italian-inspired dish...",
      "ingredients": [...],
      "instructions": [...],
      "nutrition": {
        "calories": 500,
        "protein": 25.0,
        "carbs": 45.0,
        "fat": 20.0,
        "fiber": 8.0
      },
      "cuisine": "Italian",
      "difficulty": "intermediate",
      "cookingTime": "30 minutes",
      "servings": 4,
      "tips": ["Use fresh ingredients for best results"],
      "substitutions": {
        "chicken breast": ["turkey breast", "tofu"]
      }
    }
  ],
  "agent_type": "Recipe Creator",
  "route_taken": "ingredient_analysis -> cuisine_research -> nutrition_calculation -> recipe_generation",
  "result": "Generated recipe content...",
  "seasoning_suggestions": ["basil", "oregano", "garlic"],
  "missing_ingredients": ["olive oil", "onion"],
  "shopping_list": ["olive oil", "onion", "garlic"]
}
```

### GET `/health`
Health check endpoint.

## Development

### Graph Structure
```
START → Ingredient Analysis → Cuisine Research → Nutrition Calculation → Recipe Generation → END
```

### Key Components
- `ingredient_analysis_node()`: Analyzes ingredients and suggests recipe possibilities
- `cuisine_research_node()`: Researches cooking techniques and flavor profiles
- `nutrition_calculation_node()`: Calculates nutritional information
- `recipe_generation_node()`: Creates complete recipe with instructions

### Prompt Templates
All tools use comprehensive prompt templates with proper variable tracking:
- `ingredient-analysis-v1.0`: Ingredient analysis and recipe possibilities
- `cuisine-research-v1.0`: Cuisine-specific cooking techniques
- `nutrition-calc-v1.0`: Nutritional calculation
- `recipe-generation-v1.0`: Complete recipe creation

## Features Overview

### 🥘 Ingredient-Based Recipe Generation
- Input available ingredients with quantities
- AI analyzes ingredient compatibility and cooking methods
- Offers alternatives for missing ingredients
- Suggests multiple recipe possibilities

### 🌶️ Seasoning Profile System
- Cloud-stored user seasoning preferences
- Save, edit, and categorize seasoning profiles
- Auto-integration with new recipes
- Learning from user's seasoning usage patterns

### 🥗 Calorie-Aware Recipe Options
- Low (300-500), Medium (500-800), High (800-1200+) calorie ranges
- Detailed nutritional breakdown per serving
- Dietary filters: Keto, vegetarian, vegan, gluten-free
- Adjustable serving sizes with automatic recalculation

### 🌍 Cuisine Navigation & Discovery
- 20+ global cuisines (Italian, Thai, Mexican, Indian, etc.)
- Difficulty levels: Beginner, Intermediate, Advanced
- Cooking time filters: Quick (15-30 min), Medium (30-60 min), Slow (60+ min)
- Cultural context and cooking techniques for each cuisine

### 📱 Recipe Management & Sharing
- Save favorite recipes
- Recipe history tracking
- Shopping list generation for missing ingredients
- Social sharing capabilities

## Tech Stack

- **Frontend**: React, TypeScript, Material-UI, Axios
- **Backend**: FastAPI, LangGraph, LangChain, OpenAI, LiteLLM
- **Observability**: Arize, OpenInference, OpenTelemetry
- **Infrastructure**: Docker, Docker Compose

## Troubleshooting

### Common Issues
1. **Slow responses**: Check OpenAI API key configuration
2. **Empty results**: Verify API key configuration in `.env`
3. **Graph errors**: Ensure all dependencies are installed correctly

### Performance Monitoring
View detailed traces and performance metrics in your Arize dashboard to identify bottlenecks and optimize further.

## Future Enhancements

### Phase 2: Enhanced Features
- Advanced AI recipe generation
- Comprehensive seasoning management
- Expanded cuisine library (30+ cuisines)
- Recipe saving and history
- Voice input capability

### Phase 3: Advanced Features
- Image recognition for ingredients
- Social sharing and community features
- Advanced dietary filters
- Offline functionality
- Performance optimization

### Phase 4: Scale & Polish
- Mobile app development
- Advanced analytics and personalization
- Integration with smart kitchen devices
- Premium features and monetization

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import uvicorn
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import json
import uuid
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# LangChain imports
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(title="Recipe Creator API", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for recipe creation
class Ingredient(BaseModel):
    name: str
    quantity: str
    unit: Optional[str] = None
    category: Optional[str] = None

class RecipeRequest(BaseModel):
    ingredients: List[Ingredient]
    cuisine: Optional[str] = None
    difficulty: Optional[str] = None
    cookingTime: Optional[str] = None
    calorieRange: Optional[str] = None
    dietaryRestrictions: Optional[List[str]] = None
    seasoningProfileId: Optional[str] = None
    servings: Optional[int] = 4

class RecipeStep(BaseModel):
    step: int
    instruction: str
    time: Optional[str] = None
    tips: Optional[str] = None

class NutritionalInfo(BaseModel):
    calories: int
    protein: float
    carbs: float
    fat: float
    fiber: float
    perServing: bool = True

class Recipe(BaseModel):
    id: str
    title: str
    description: str
    ingredients: List[Ingredient]
    instructions: List[RecipeStep]
    nutrition: NutritionalInfo
    cuisine: str
    difficulty: str
    cookingTime: str
    servings: int
    prepTime: str
    totalTime: str
    tips: List[str]
    substitutions: Optional[Dict[str, List[str]]] = None
    imageUrl: Optional[str] = None
    rating: Optional[float] = None
    createdAt: str

class RecipeResponse(BaseModel):
    recipes: List[Recipe]
    agent_type: str
    route_taken: str
    result: str
    seasoning_suggestions: Optional[List[str]] = None
    missing_ingredients: Optional[List[str]] = None
    shopping_list: Optional[List[str]] = None

# Initialize the LLM
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o-mini",
    temperature=0.7,
    timeout=30
)

def analyze_ingredients(ingredients: str, cuisine: str = None) -> str:
    """Analyze available ingredients and suggest recipe possibilities."""
    system_prompt = "You are a culinary expert. Analyze ingredients and suggest recipe possibilities. Be concise and practical."
    
    prompt = f"""Analyze these ingredients for recipe creation: {ingredients}

Cuisine preference: {cuisine or 'Any cuisine'}

Provide:
1. Recipe possibilities (3-4 ideas)
2. Missing key ingredients for each
3. Ingredient substitutions
4. Cooking techniques needed

Keep response under 200 words."""
    
    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=prompt)
    ])
    return response.content

def research_cuisine(cuisine: str, difficulty: str = "intermediate") -> str:
    """Research cooking techniques and flavor profiles for a specific cuisine."""
    system_prompt = "You are a culinary researcher specializing in global cuisines. Provide concise, practical cooking information."
    
    prompt = f"""Research {cuisine} cuisine for {difficulty} level cooking.

Focus on:
- Key cooking techniques
- Essential flavor profiles
- Common ingredients
- Traditional methods
- Modern adaptations

Keep under 150 words."""
    
    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=prompt)
    ])
    return response.content

def calculate_nutrition(ingredients: str, servings: int = 4) -> str:
    """Calculate approximate nutritional information for a recipe."""
    system_prompt = "You are a nutrition expert. Calculate approximate nutritional values for recipes. Be realistic and practical."
    
    prompt = f"""Calculate nutrition for this recipe: {ingredients}

Servings: {servings}

Provide per serving:
- Calories (realistic range)
- Protein (grams)
- Carbs (grams)
- Fat (grams)
- Fiber (grams)

Format as JSON-like structure for easy parsing."""
    
    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=prompt)
    ])
    return response.content

def generate_recipe(ingredients: str, cuisine: str, difficulty: str, nutrition_info: str, ingredient_analysis: str) -> str:
    """Generate a complete recipe with instructions and tips."""
    system_prompt = """You are a master chef and recipe creator. Generate detailed, practical recipes that are:
- Clear and easy to follow
- Include helpful cooking tips
- Provide realistic timing
- Include ingredient substitutions
- Match the specified cuisine and difficulty level

Format the response as a structured recipe with clear sections."""
    
    prompt = f"""Create a recipe using: {ingredients}

Cuisine: {cuisine}
Difficulty: {difficulty}
Nutrition: {nutrition_info}
Analysis: {ingredient_analysis}

Generate a complete recipe with:
1. Recipe title and description
2. Detailed ingredients list
3. Step-by-step instructions with timing
4. Cooking tips and techniques
5. Ingredient substitutions
6. Serving suggestions

Make it practical and delicious!"""
    
    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=prompt)
    ])
    return response.content

@app.get("/")
async def root():
    return {"message": "Recipe Creator API is running!"}

@app.post("/create-recipe", response_model=RecipeResponse)
async def create_recipe(recipe_request: RecipeRequest):
    """Create a recipe based on available ingredients and preferences."""
    try:
        # Convert ingredients to string
        ingredients_str = ", ".join([f"{ing.quantity} {ing.unit or ''} {ing.name}" for ing in recipe_request.ingredients])
        
        # Run the recipe creation workflow
        print(f"🍳 Creating recipe with ingredients: {ingredients_str}")
        
        # Step 1: Analyze ingredients
        ingredient_analysis = analyze_ingredients(ingredients_str, recipe_request.cuisine)
        print("✅ Ingredient analysis completed")
        
        # Step 2: Research cuisine
        cuisine = recipe_request.cuisine or "general"
        difficulty = recipe_request.difficulty or "intermediate"
        cuisine_research = research_cuisine(cuisine, difficulty)
        print("✅ Cuisine research completed")
        
        # Step 3: Calculate nutrition
        servings = recipe_request.servings or 4
        nutrition_info = calculate_nutrition(ingredients_str, servings)
        print("✅ Nutrition calculation completed")
        
        # Step 4: Generate recipe
        final_result = generate_recipe(
            ingredients_str,
            cuisine,
            difficulty,
            nutrition_info,
            ingredient_analysis
        )
        print("✅ Recipe generation completed")
        
        # Create recipe object
        recipe = Recipe(
            id=str(uuid.uuid4()),
            title="Generated Recipe",
            description="A delicious recipe created from your ingredients",
            ingredients=recipe_request.ingredients,
            instructions=[
                RecipeStep(step=1, instruction="Follow the generated recipe instructions", time="30 min")
            ],
            nutrition=NutritionalInfo(
                calories=500,
                protein=25.0,
                carbs=45.0,
                fat=20.0,
                fiber=8.0
            ),
            cuisine=recipe_request.cuisine or "General",
            difficulty=recipe_request.difficulty or "intermediate",
            cookingTime="30 minutes",
            servings=recipe_request.servings or 4,
            prepTime="10 minutes",
            totalTime="40 minutes",
            tips=["Use fresh ingredients for best results", "Adjust seasoning to taste"],
            createdAt=datetime.now().isoformat()
        )
        
        return RecipeResponse(
            recipes=[recipe],
            agent_type="Recipe Creator",
            route_taken="ingredient_analysis -> cuisine_research -> nutrition_calculation -> recipe_generation",
            result=final_result,
            seasoning_suggestions=["salt", "pepper", "garlic", "herbs"],
            missing_ingredients=["olive oil", "onion"],
            shopping_list=["olive oil", "onion", "garlic"]
        )
        
    except Exception as e:
        print(f"❌ Error creating recipe: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to create recipe: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Recipe Creator API",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    

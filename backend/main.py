from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import uvicorn
from datetime import datetime, date, timedelta
import math
import json
import uuid
import requests
from dataclasses import dataclass

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# LangChain imports
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain_core.utils import get_from_dict_or_env

# In-memory storage for simple app
user_profiles = {}
weekend_plans = {}
generation_logs = {}

app = FastAPI(title="Weekend Baby Explorer API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for weekend planning
class ChildInfo(BaseModel):
    ageYears: int
    ageMonths: int

class UserProfile(BaseModel):
    id: str
    children: List[ChildInfo]
    postcode: str
    maxTravelTime: int  # in minutes
    transportMode: str  # 'car', 'public', 'walking', 'cycling'
    budget: int  # in GBP
    startTime: str  # ISO datetime
    endTime: str    # ISO datetime
    createdAt: datetime

class UserProfileCreate(BaseModel):
    email: str
    children: List[ChildInfo]
    postcode: str
    maxTravelTime: int
    transportMode: str
    budget: int
    startTime: str
    endTime: str

class ActivityPreferences(BaseModel):
    likedActivities: List[str]
    dislikedActivities: List[str]
    eatOut: bool
    foodStyle: Optional[str] = None
    restaurantRequirements: Optional[str] = None

class WeekendRequest(BaseModel):
    userId: str
    children: List[ChildInfo]
    postcode: str
    maxTravelTime: int
    transportMode: str
    budget: int
    startTime: str  # ISO datetime
    endTime: str    # ISO datetime
    activityPreferences: ActivityPreferences

class ActivityStop(BaseModel):
    name: str
    category: str  # "park", "cafe", "museum", "home", etc.
    time: str      # "10:30-12:00"
    cost: int
    note: str
    location: Optional[str] = None
    bookingUrl: Optional[str] = None
    travelTime: int  # in minutes
    timeBreakdown: str  # detailed breakdown of activities
    topTips: List[str]
    pros: List[str]
    cons: List[str]
    arrivalTime: Optional[str] = None
    departureTime: Optional[str] = None
    duration: Optional[int] = None
    transportDetails: Optional[Dict[str, Any]] = None

class WeekendPlan(BaseModel):
    type: str  # "with_baby" or "parent_recharge"
    title: str
    stops: List[ActivityStop]
    mapImg: Optional[str] = None
    totalCost: int
    totalDuration: str
    totalTravelTime: int
    estimatedSpend: int

class WeekendResponse(BaseModel):
    plans: List[WeekendPlan]
    generationMs: int
    weatherSummary: str

@dataclass
class VenueCandidate:
    name: str
    category: str
    location: str
    cost_estimate: int
    baby_friendly_score: float
    distance_km: float
    weather_suitable: bool
    stroller_accessible: bool
    travel_time_minutes: int
    booking_url: Optional[str] = None
    score: float = 0.0

def collect_inputs(request: WeekendRequest) -> Dict[str, Any]:
    """Validate form data and perform geo lookup."""
    print(f"Collecting inputs for user {request.userId}")
    
    # Create user profile if it doesn't exist (for the new flow)
    if request.userId not in user_profiles:
        # Create a temporary user profile from the request data
        user_profile = UserProfile(
            id=request.userId,
            children=request.children,
            postcode=request.postcode,
            maxTravelTime=request.maxTravelTime,
            transportMode=request.transportMode,
            budget=request.budget,
            startTime=request.startTime,
            endTime=request.endTime,
            createdAt=datetime.now()
        )
        user_profiles[request.userId] = user_profile
        print(f"Created temporary user profile for {request.userId}")
    
    user_profile = user_profiles[request.userId]
    
    # Basic validation
    if request.budget < 10 or request.budget > 200:
        raise HTTPException(status_code=400, detail="Budget must be between £10-200")
    
    if request.maxTravelTime < 10 or request.maxTravelTime > 120:
        raise HTTPException(status_code=400, detail="Travel time must be between 10-120 minutes")
    
    # Calculate total child age for activity recommendations
    total_age_months = sum(child.ageYears * 12 + child.ageMonths for child in request.children)
    avg_age_months = total_age_months / len(request.children)
    
    # Estimate nap windows based on average age
    if avg_age_months < 12:
        nap_windows = ["09:00-10:30", "13:00-14:30"]
    elif avg_age_months < 24:
        nap_windows = ["09:30-11:00", "13:30-15:00"]
    else:
        nap_windows = ["10:00-11:30", "14:00-15:30"]
    
    return {
        "user_id": request.userId,
        "children": request.children,
        "postcode": request.postcode,
        "budget": request.budget,
        "start_time": request.startTime,
        "end_time": request.endTime,
        "max_travel_time": request.maxTravelTime,
        "transport_mode": request.transportMode,
        "activity_preferences": request.activityPreferences,
        "avg_age_months": avg_age_months,
        "nap_windows": nap_windows,
        "duration_hours": 6  # Simplified for MVP
    }

def fetch_candidates(inputs: Dict[str, Any]) -> List[VenueCandidate]:
    """Fetch venue candidates from various APIs."""
    print(f"Fetching candidates for {inputs['postcode']}")
    
    # Mock data for MVP - in production, this would call real APIs
    candidates = []
    
    # Parks and outdoor activities
    candidates.extend([
        VenueCandidate(
            name="Bushy Park",
            category="Parks & Playgrounds",
            location="Hampton Court Road, Hampton",
            cost_estimate=0,
            baby_friendly_score=0.9,
            distance_km=2.5,
            weather_suitable=True,
            stroller_accessible=True,
            travel_time_minutes=15
        ),
        VenueCandidate(
            name="Richmond Park",
            category="Parks & Playgrounds",
            location="Richmond, London",
            cost_estimate=0,
            baby_friendly_score=0.8,
            distance_km=4.2,
            weather_suitable=True,
            stroller_accessible=True,
            travel_time_minutes=25
        ),
        VenueCandidate(
            name="Kew Gardens",
            category="Parks & Playgrounds",
            location="Kew, Richmond",
            cost_estimate=18,
            baby_friendly_score=0.7,
            distance_km=3.8,
            weather_suitable=True,
            stroller_accessible=True,
            travel_time_minutes=22
        )
    ])
    
    # Cafes and restaurants
    candidates.extend([
        VenueCandidate(
            name="Happicino Café",
            category="Cafes & Restaurants",
            location="Kingston High Street",
            cost_estimate=12,
            baby_friendly_score=0.8,
            distance_km=1.2,
            weather_suitable=True,
            stroller_accessible=True,
            travel_time_minutes=8
        ),
        VenueCandidate(
            name="The Ivy Café",
            category="Cafes & Restaurants",
            location="Richmond Hill",
            cost_estimate=35,
            baby_friendly_score=0.6,
            distance_km=3.1,
            weather_suitable=True,
            stroller_accessible=True,
            travel_time_minutes=18
        )
    ])
    
    # Museums and indoor activities
    candidates.extend([
        VenueCandidate(
            name="Horniman Museum",
            category="Museums & Galleries",
            location="Forest Hill, London",
            cost_estimate=0,
            baby_friendly_score=0.8,
            distance_km=8.5,
            weather_suitable=True,
            stroller_accessible=True,
            travel_time_minutes=35
        ),
        VenueCandidate(
            name="Science Museum",
            category="Museums & Galleries",
            location="South Kensington, London",
            cost_estimate=0,
            baby_friendly_score=0.7,
            distance_km=12.3,
            weather_suitable=True,
            stroller_accessible=True,
            travel_time_minutes=45
        )
    ])
    
    # Soft play and indoor activities
    candidates.extend([
        VenueCandidate(
            name="Tumble Tots",
            category="Soft Play Centers",
            location="Kingston upon Thames",
            cost_estimate=8,
            baby_friendly_score=0.9,
            distance_km=1.8,
            weather_suitable=True,
            stroller_accessible=True,
            travel_time_minutes=12
        ),
        VenueCandidate(
            name="Little Gym",
            category="Sports Activities",
            location="Richmond",
            cost_estimate=15,
            baby_friendly_score=0.8,
            distance_km=3.5,
            weather_suitable=True,
            stroller_accessible=True,
            travel_time_minutes=20
        )
    ])
    
    return candidates

def score_and_rank(candidates: List[VenueCandidate], inputs: Dict[str, Any]) -> List[VenueCandidate]:
    """Score and rank candidates based on preferences and constraints."""
    print(f"Scoring {len(candidates)} candidates")
    
    for candidate in candidates:
        # Base score from baby friendliness
        score = candidate.baby_friendly_score * 10
        
        # Bonus for preferred activities
        if candidate.category in inputs['activity_preferences'].likedActivities:
            score += 5
        
        # Penalty for disliked activities
        if candidate.category in inputs['activity_preferences'].dislikedActivities:
            score -= 10
        
        # Travel time penalty
        if candidate.travel_time_minutes > inputs['max_travel_time']:
            score -= 20
        
        # Cost penalty if over budget
        if candidate.cost_estimate > inputs['budget'] * 0.4:  # Max 40% of budget per activity
            score -= 5
        
        # Weather consideration
        if not candidate.weather_suitable:
            score -= 3
        
        candidate.score = score
    
    # Sort by score descending
    return sorted(candidates, key=lambda x: x.score, reverse=True)

def build_itineraries(ranked_candidates: List[VenueCandidate], inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Build weekend itineraries from ranked candidates."""
    print("Building itineraries")
    
    plans = []
    
    # Plan 1: Outdoor Adventure
    outdoor_candidates = [c for c in ranked_candidates if c.category in ["Parks & Playgrounds", "Nature Walks", "Farm Visits"]]
    if outdoor_candidates:
        plan1_stops = []
        current_time = datetime.strptime(inputs['start_time'], "%Y-%m-%dT%H:%M:%S")
        
        for i, candidate in enumerate(outdoor_candidates[:3]):
            arrival_time = current_time + timedelta(hours=i*2)
            duration = 90  # 90 minutes per activity
            departure_time = arrival_time + timedelta(minutes=duration)
            
            # Calculate travel time to next stop
            next_candidate = outdoor_candidates[i + 1] if i + 1 < len(outdoor_candidates[:3]) else None
            travel_time = next_candidate.travel_time_minutes if next_candidate else 0
            
            plan1_stops.append(ActivityStop(
                name=candidate.name,
                category=candidate.category,
                time=f"{arrival_time.strftime('%H:%M')}-{departure_time.strftime('%H:%M')}",
                cost=candidate.cost_estimate,
                note=f"Perfect for {inputs['avg_age_months']:.0f}-month-old children. Bring snacks and water!",
                location=candidate.location,
                bookingUrl=candidate.booking_url,
                travelTime=travel_time,
                timeBreakdown=f"30min travel, 1hr activity, 30min rest",
                topTips=["Bring sunscreen and hats", "Pack plenty of snacks", "Check for changing facilities"],
                pros=["Free entry", "Great for exercise", "Beautiful scenery"],
                cons=["Weather dependent", "Can be busy on weekends"],
                arrivalTime=arrival_time.strftime('%H:%M'),
                departureTime=departure_time.strftime('%H:%M'),
                duration=duration,
                transportDetails={
                    "mode": "car",
                    "duration": travel_time,
                    "instructions": f"Drive {travel_time} minutes to {next_candidate.name if next_candidate else 'home'}"
                } if next_candidate else None
            ))
            
            # Update current time for next iteration
            current_time = departure_time + timedelta(minutes=travel_time)
        
        plans.append(WeekendPlan(
            type="outdoor_adventure",
            title="Outdoor Family Adventure",
            stops=plan1_stops,
            totalCost=sum(stop.cost for stop in plan1_stops),
            totalDuration="6 hours",
            totalTravelTime=sum(stop.travelTime for stop in plan1_stops),
            estimatedSpend=sum(stop.cost for stop in plan1_stops) + 20  # Add food costs
        ))
    
    # Plan 2: Indoor Discovery
    indoor_candidates = [c for c in ranked_candidates if c.category in ["Museums & Galleries", "Soft Play Centers", "Educational Centers"]]
    if indoor_candidates:
        plan2_stops = []
        current_time = datetime.strptime(inputs['start_time'], "%Y-%m-%dT%H:%M:%S")
        
        for i, candidate in enumerate(indoor_candidates[:3]):
            arrival_time = current_time + timedelta(hours=i*2)
            duration = 90  # 90 minutes per activity
            departure_time = arrival_time + timedelta(minutes=duration)
            
            # Calculate travel time to next stop
            next_candidate = indoor_candidates[i + 1] if i + 1 < len(indoor_candidates[:3]) else None
            travel_time = next_candidate.travel_time_minutes if next_candidate else 0
            
            plan2_stops.append(ActivityStop(
                name=candidate.name,
                category=candidate.category,
                time=f"{arrival_time.strftime('%H:%M')}-{departure_time.strftime('%H:%M')}",
                cost=candidate.cost_estimate,
                note=f"Educational and fun for children aged {inputs['avg_age_months']:.0f} months",
                location=candidate.location,
                bookingUrl=candidate.booking_url,
                travelTime=travel_time,
                timeBreakdown=f"30min travel, 1hr activity, 30min rest",
                topTips=["Book in advance if required", "Bring extra clothes", "Check for baby facilities"],
                pros=["Weather proof", "Educational value", "Controlled environment"],
                cons=["Can be expensive", "May be crowded", "Limited outdoor time"],
                arrivalTime=arrival_time.strftime('%H:%M'),
                departureTime=departure_time.strftime('%H:%M'),
                duration=duration,
                transportDetails={
                    "mode": "car",
                    "duration": travel_time,
                    "instructions": f"Drive {travel_time} minutes to {next_candidate.name if next_candidate else 'home'}"
                } if next_candidate else None
            ))
            
            # Update current time for next iteration
            current_time = departure_time + timedelta(minutes=travel_time)
        
        plans.append(WeekendPlan(
            type="indoor_discovery",
            title="Indoor Learning Adventure",
            stops=plan2_stops,
            totalCost=sum(stop.cost for stop in plan2_stops),
            totalDuration="6 hours",
            totalTravelTime=sum(stop.travelTime for stop in plan2_stops),
            estimatedSpend=sum(stop.cost for stop in plan2_stops) + 25  # Add food costs
        ))
    
    # Plan 3: Mixed Experience
    mixed_candidates = ranked_candidates[:4]  # Take top 4 from any category
    if mixed_candidates:
        plan3_stops = []
        current_time = datetime.strptime(inputs['start_time'], "%Y-%m-%dT%H:%M:%S")
        
        for i, candidate in enumerate(mixed_candidates):
            arrival_time = current_time + timedelta(hours=i*1.5)
            duration = 60  # 60 minutes per activity for mixed plan
            departure_time = arrival_time + timedelta(minutes=duration)
            
            # Calculate travel time to next stop
            next_candidate = mixed_candidates[i + 1] if i + 1 < len(mixed_candidates) else None
            travel_time = next_candidate.travel_time_minutes if next_candidate else 0
            
            plan3_stops.append(ActivityStop(
                name=candidate.name,
                category=candidate.category,
                time=f"{arrival_time.strftime('%H:%M')}-{departure_time.strftime('%H:%M')}",
                cost=candidate.cost_estimate,
                note=f"Varied activities perfect for family bonding",
                location=candidate.location,
                bookingUrl=candidate.booking_url,
                travelTime=travel_time,
                timeBreakdown=f"20min travel, 40min activity, 20min rest",
                topTips=["Plan for shorter activities", "Bring snacks between stops", "Check opening times"],
                pros=["Great variety", "Something for everyone", "Flexible timing"],
                cons=["More travel time", "Can be tiring", "Need good planning"],
                arrivalTime=arrival_time.strftime('%H:%M'),
                departureTime=departure_time.strftime('%H:%M'),
                duration=duration,
                transportDetails={
                    "mode": "car",
                    "duration": travel_time,
                    "instructions": f"Drive {travel_time} minutes to {next_candidate.name if next_candidate else 'home'}"
                } if next_candidate else None
            ))
            
            # Update current time for next iteration
            current_time = departure_time + timedelta(minutes=travel_time)
        
        plans.append(WeekendPlan(
            type="mixed_experience",
            title="Mixed Family Experience",
            stops=plan3_stops,
            totalCost=sum(stop.cost for stop in plan3_stops),
            totalDuration="6 hours",
            totalTravelTime=sum(stop.travelTime for stop in plan3_stops),
            estimatedSpend=sum(stop.cost for stop in plan3_stops) + 30  # Add food costs
        ))
    
    return {
        "plans": plans,
        "generationMs": 1500,  # Mock generation time
        "weatherSummary": "Partly cloudy with light showers expected. Perfect for indoor activities or bring rain gear for outdoor fun!"
    }

def render_maps(itineraries: Dict[str, Any], inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Render maps for itineraries (placeholder for MVP)."""
    print("Rendering maps")
    return itineraries

def store_and_log(itineraries: Dict[str, Any], inputs: Dict[str, Any], start_time: datetime) -> Dict[str, Any]:
    """Store results and log generation."""
    print("Storing and logging results")
    
    generation_id = str(uuid.uuid4())
    generation_time = (datetime.now() - start_time).total_seconds() * 1000
    
    # Store in memory
    weekend_plans[generation_id] = {
        "itineraries": itineraries,
        "inputs": inputs,
        "generation_time": generation_time,
        "created_at": datetime.now()
    }
    
    # Log generation
    generation_logs[generation_id] = {
        "user_id": inputs["user_id"],
        "postcode": inputs["postcode"],
        "budget": inputs["budget"],
        "generation_time": generation_time,
        "plans_count": len(itineraries["plans"]),
        "created_at": datetime.now()
    }
    
    return itineraries

def generate_weekend_plans(request: WeekendRequest) -> Dict[str, Any]:
    """Main function to generate weekend plans."""
    start_time = datetime.now()
    
    try:
        # Step 1: Collect and validate inputs
        inputs = collect_inputs(request)
        
        # Step 2: Fetch venue candidates
        candidates = fetch_candidates(inputs)
        
        # Step 3: Score and rank candidates
        ranked_candidates = score_and_rank(candidates, inputs)
        
        # Step 4: Build itineraries
        itineraries = build_itineraries(ranked_candidates, inputs)
        
        # Step 5: Render maps (placeholder)
        itineraries = render_maps(itineraries, inputs)
        
        # Step 6: Store and log
        result = store_and_log(itineraries, inputs, start_time)
        
        return result
        
    except Exception as e:
        print(f"Error generating weekend plans: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate weekend plans: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Weekend Baby Explorer API", "status": "running"}

@app.post("/simple/user-profile", response_model=UserProfile)
async def create_simple_user_profile(profile: UserProfileCreate):
    """Create a simple user profile without authentication."""
    user_id = str(uuid.uuid4())
    
    # Validate child ages
    for child in profile.children:
        if child.ageYears > 3:
            raise HTTPException(status_code=400, detail="Activities are designed for children aged 0-3 years")
    
    user_profile = UserProfile(
        id=user_id,
        children=profile.children,
        postcode=profile.postcode,
        maxTravelTime=profile.maxTravelTime,
        transportMode=profile.transportMode,
        budget=profile.budget,
        startTime=profile.startTime,
        endTime=profile.endTime,
        createdAt=datetime.now()
    )
    
    user_profiles[user_id] = user_profile
    
    return user_profile

@app.post("/simple/weekend-plan", response_model=WeekendResponse)
async def create_weekend_plan(request: WeekendRequest):
    """Generate weekend plans for a user."""
    return generate_weekend_plans(request)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}
    

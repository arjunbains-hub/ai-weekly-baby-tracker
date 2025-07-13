#!/usr/bin/env python3
"""
Seed milestone data for Weekly Baby Genie
Based on NHS and WHO guidelines for baby development
"""

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """Get PostgreSQL connection using Render's managed database."""
    try:
        connection = psycopg2.connect(
            host=os.getenv("RENDER_DB_HOST"),
            database=os.getenv("RENDER_DB_NAME"),
            user=os.getenv("RENDER_DB_USER"),
            password=os.getenv("RENDER_DB_PASSWORD"),
            port=os.getenv("RENDER_DB_PORT", "5432")
        )
        return connection
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def seed_milestone_data():
    """Seed the database with milestone data."""
    conn = get_db_connection()
    if not conn:
        print("❌ Failed to connect to database")
        return
    
    try:
        cursor = conn.cursor()
        
        # Clear existing data
        cursor.execute("DELETE FROM milestone_data")
        
        # Milestone data based on NHS and WHO guidelines
        milestones = [
            # Week 1-4: Newborn
            (1, 4, "physical", "Can lift head briefly when on tummy", "Practice tummy time for 2-3 minutes several times a day", "If baby cannot lift head at all by 4 weeks", "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (1, 4, "social", "Makes eye contact and responds to faces", "Spend time face-to-face talking and singing", "If baby doesn't make eye contact by 4 weeks", "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (1, 4, "communication", "Makes cooing sounds", "Respond to sounds and encourage vocalization", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (1, 4, "feeding", "Shows hunger cues and feeds well", "Feed on demand and watch for hunger signs", "If baby is not feeding well or losing weight", "NHS", "https://www.nhs.uk/conditions/baby/breastfeeding/"),
            
            # Week 5-8: Early Development
            (5, 8, "physical", "Moves arms and legs more purposefully", "Provide safe space for movement and exploration", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (5, 8, "social", "Smiles in response to faces and voices", "Talk, sing, and make faces with your baby", "If baby doesn't smile by 8 weeks", "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (5, 8, "communication", "Makes different sounds for different needs", "Learn to recognize your baby's different cries", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (5, 8, "brain", "Follows moving objects with eyes", "Move colorful objects slowly in front of baby's face", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            
            # Week 9-12: Growing Awareness
            (9, 12, "physical", "Can hold head up when sitting with support", "Practice supported sitting for short periods", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (9, 12, "social", "Recognizes familiar faces and voices", "Spend quality time with consistent caregivers", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (9, 12, "communication", "Babbles and makes vowel sounds", "Have conversations with your baby, taking turns", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (9, 12, "brain", "Reaches for objects and brings them to mouth", "Offer safe toys for exploration", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            
            # Week 13-16: Active Exploration
            (13, 16, "physical", "Rolls from tummy to back", "Encourage rolling with toys and gentle guidance", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (13, 16, "social", "Laughs and shows joy", "Play peek-a-boo and other interactive games", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (13, 16, "communication", "Responds to name being called", "Call baby's name frequently and positively", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (13, 16, "brain", "Shows interest in mirrors and reflections", "Use mirrors for play and self-discovery", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            
            # Week 17-20: Sitting and Reaching
            (17, 20, "physical", "Sits with support and may sit briefly alone", "Practice sitting with cushions for support", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (17, 20, "social", "Shows stranger anxiety", "Introduce new people gradually and positively", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (17, 20, "communication", "Makes consonant sounds (b, p, m)", "Repeat sounds back and encourage babbling", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (17, 20, "brain", "Passes objects from hand to hand", "Offer toys that encourage transfer between hands", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            
            # Week 21-24: Crawling Preparation
            (21, 24, "physical", "Gets into crawling position and rocks", "Encourage crawling with toys just out of reach", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (21, 24, "social", "Plays simple games like pat-a-cake", "Teach and play simple hand games", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (21, 24, "communication", "Understands simple words like 'no' and 'bye'", "Use simple, consistent words and gestures", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (21, 24, "brain", "Looks for hidden objects", "Play hide-and-seek with toys", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            
            # Week 25-28: Crawling and Standing
            (25, 28, "physical", "Crawls or moves around on tummy", "Create safe spaces for crawling exploration", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (25, 28, "social", "Shows attachment to primary caregivers", "Respond consistently to baby's needs", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (25, 28, "communication", "Says 'mama' or 'dada' meaningfully", "Encourage first words with repetition", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (25, 28, "brain", "Uses pincer grasp to pick up small objects", "Offer finger foods and small toys", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            
            # Week 29-32: Standing and Walking
            (29, 32, "physical", "Pulls to stand and cruises along furniture", "Provide stable furniture for cruising practice", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (29, 32, "social", "Shows preference for certain people and toys", "Respect baby's preferences while encouraging exploration", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (29, 32, "communication", "Understands simple commands", "Give simple, clear instructions", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (29, 32, "brain", "Points to objects of interest", "Name objects when baby points", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            
            # Week 33-36: First Steps
            (33, 36, "physical", "Takes first steps or walks with support", "Encourage walking with hands-on support", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (33, 36, "social", "Shows empathy and comfort to others", "Model caring behavior and gentle touch", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (33, 36, "communication", "Says 2-3 words clearly", "Expand on baby's words and encourage talking", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (33, 36, "brain", "Imitates actions and sounds", "Demonstrate actions and encourage imitation", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            
            # Week 37-40: Walking and Talking
            (37, 40, "physical", "Walks independently", "Provide safe spaces for walking practice", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (37, 40, "social", "Plays alongside other children", "Arrange playdates and group activities", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (37, 40, "communication", "Says 5-10 words", "Read books and talk about everything", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (37, 40, "brain", "Shows problem-solving skills", "Offer puzzles and problem-solving toys", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            
            # Week 41-44: Language Development
            (41, 44, "physical", "Climbs stairs with help", "Supervise stair climbing and provide support", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (41, 44, "social", "Shows independence and wants to do things alone", "Allow safe independence while staying close", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (41, 44, "communication", "Combines words into simple phrases", "Model simple phrases and encourage repetition", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (41, 44, "brain", "Remembers and anticipates routines", "Establish consistent daily routines", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            
            # Week 45-48: Advanced Skills
            (45, 48, "physical", "Runs and jumps in place", "Encourage active play and movement", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (45, 48, "social", "Shows concern for others' feelings", "Talk about feelings and model empathy", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (45, 48, "communication", "Uses 50+ words and simple sentences", "Have conversations and expand vocabulary", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (45, 48, "brain", "Shows creativity in play", "Provide open-ended toys and art materials", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            
            # Week 49-52: Toddler Skills
            (49, 52, "physical", "Walks up and down stairs independently", "Practice stair skills with supervision", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (49, 52, "social", "Plays cooperatively with others", "Arrange group play and model sharing", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
            (49, 52, "communication", "Uses 200+ words and complex sentences", "Read books, sing songs, and have conversations", None, "WHO", "https://www.who.int/health-topics/child-development"),
            (49, 52, "brain", "Shows imagination in pretend play", "Encourage pretend play with props and costumes", None, "NHS", "https://www.nhs.uk/conditions/baby/babys-development/"),
        ]
        
        # Insert milestone data
        cursor.executemany("""
            INSERT INTO milestone_data (week_start, week_end, domain, milestone, tip, red_flag, source, citation_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, milestones)
        
        conn.commit()
        print(f"✅ Successfully seeded {len(milestones)} milestone records")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error seeding milestone data: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    print("🌱 Seeding milestone data...")
    seed_milestone_data()
    print("✅ Milestone seeding complete!") 
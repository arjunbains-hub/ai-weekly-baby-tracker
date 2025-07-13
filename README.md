# 🍼 Weekly Baby Genie

A warm, personalized baby development tracker that offers week-by-week developmental summaries and plans for babies aged 0–1. Designed for UK parents and guided by NHS and WHO milestone data, with a tone of voice like a supportive midwife.

## 🎯 What is Weekly Baby Genie?

When you're caring for your baby, you want a clear, personalized sense of what's coming next — so you can feel more confident, prepared, and responsive. Weekly Baby Genie provides:

- **Personalized week-by-week summaries** based on your baby's age and your input
- **Tailored weekly plans** with actionable activities
- **Reassuring tone** with NHS/WHO-sourced guidance
- **Partner sharing** - email plans to your partner
- **Transparent logic** - all milestone data is clear and editable

## 🚀 Features

### For Parents
- **User Authentication**: Secure signup/login with JWT tokens
- **Baby Profile Setup**: Tell us about your baby's temperament, feeding style, and sleep patterns
- **Weekly Check-ins**: Answer milestone questions relevant to your baby's age
- **AI-Generated Summaries**: Get warm, personalized development insights
- **Progress Tracking**: See green/amber/red progress ratings with explanations
- **Activity Suggestions**: Receive 3-5 specific, actionable activities for each week
- **Partner Sharing**: Send summaries to your partner via email
- **Multiple Babies**: Track development for multiple children

### Technical Features
- **LangGraph AI Orchestration**: Sophisticated AI workflow for personalized responses
- **NHS/WHO Data Integration**: Evidence-based milestone tracking with 52 weeks of data
- **Warm Midwife Tone**: AI trained to sound like a caring, supportive professional
- **Responsive Design**: Beautiful, modern UI inspired by Cleo Bank
- **Real-time Processing**: Instant AI-generated summaries
- **PostgreSQL Database**: Persistent storage for users, babies, and summaries
- **JWT Authentication**: Secure user sessions
- **Email Integration**: Partner sharing via SMTP

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Material-UI
- **Backend**: FastAPI + Python + LangChain
- **Database**: PostgreSQL (Render Managed)
- **Authentication**: JWT + bcrypt
- **Email**: SMTP (Gmail/other providers)
- **AI**: OpenAI GPT-4 + LangGraph
- **Styling**: Tailwind-inspired design system
- **Deployment**: Render (web + database + static site)

## 🚀 Quick Deploy to Render

### 1. Fork/Clone this Repository

```bash
git clone <your-repo-url>
cd ai-weekly-baby-tracker
```

### 2. Deploy to Render

1. **Connect to Render**: Go to [render.com](https://render.com) and connect your GitHub repository
2. **Use Blueprint**: Render will automatically detect the `render.yaml` file and create all services
3. **Set Environment Variables**: In the Render dashboard, set these environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `RENDER_SMTP_USER`: Your email for sending summaries (optional)
   - `RENDER_SMTP_PASSWORD`: Your email app password (optional)

### 3. Database Setup

The database will be automatically created and initialized. To seed milestone data:

```bash
# In Render's shell or locally with database connection
cd backend
python seed_milestones.py
```

### 4. Access Your App

- **Frontend**: `https://weekly-baby-genie-frontend.onrender.com`
- **Backend API**: `https://weekly-baby-genie-backend.onrender.com`
- **API Docs**: `https://weekly-baby-genie-backend.onrender.com/docs`

## 🏃‍♀️ Local Development

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (or use Render's managed database)
- OpenAI API key

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp env_example.txt .env
# Edit .env with your configuration
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set REACT_APP_API_BASE_URL=http://localhost:8000
npm start
```

### Database Setup (Local)
```bash
# Install PostgreSQL locally or use Docker
# Update .env with your database credentials
cd backend
python seed_milestones.py
```

### Docker Setup
```bash
docker-compose up --build
```

## 📱 User Journey

1. **Welcome**: Land on the warm, inviting homepage
2. **Authentication**: Sign up or log in with email/password
3. **Baby Profile**: Set up your baby's details (name, DOB, temperament, feeding, sleep)
4. **Weekly Check-in**: Answer milestone questions for your baby's current week
5. **AI Summary**: Receive personalized development insights and activity suggestions
6. **Share**: Optionally send the summary to your partner via email

## 🎨 Design Philosophy

Inspired by Cleo Bank's approach: **warm, soft, but modern**. The design features:
- Rounded corners and generous padding
- Pastel tones with warm pink (#FF6B9D) and soft teal (#4ECDC4)
- Large headings with emoji-enhanced summaries
- Icons for different development domains (🧠 💬 🖐️ 😊 🍽️)
- Supportive, encouraging microcopy throughout

## 🔧 AI Architecture

The application uses a sophisticated LangGraph workflow:

```
fetch_milestones → build_prompt → openai_call → post_process → log_to_db
```

Each step is designed to provide the most personalized, evidence-based guidance possible while maintaining the warm, supportive tone of a trusted midwife.

## 📊 Data Sources

- **NHS Guidelines**: UK-specific baby development milestones
- **WHO Standards**: International child development recommendations
- **AAP Guidelines**: American Academy of Pediatrics best practices

## 🗄️ Database Schema

### Tables
- **users**: User authentication and profiles
- **baby_profiles**: Baby information and characteristics
- **weekly_checkins**: Parent responses to milestone questions
- **development_summaries**: AI-generated summaries and plans
- **milestone_data**: NHS/WHO milestone data for weeks 1-52

### Key Features
- JWT-based authentication
- User-baby relationships
- Comprehensive milestone tracking
- Email sharing capabilities

## 📧 Email Integration

The app supports sending development summaries to partners via SMTP:

1. **Setup**: Configure SMTP settings in environment variables
2. **Sharing**: Users can share summaries with partner emails
3. **Templates**: Beautiful HTML email templates with baby's progress

## 🔐 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure session management
- **Input Validation**: Pydantic models for data validation
- **CORS Protection**: Configured for production deployment
- **Database Security**: Parameterized queries to prevent SQL injection

## 🚀 API Endpoints

### Authentication
- `POST /auth/register` - Create new user account
- `POST /auth/login` - User login and get JWT token

### Baby Management
- `POST /baby-profile` - Create baby profile (authenticated)
- `GET /baby-profiles` - Get user's baby profiles (authenticated)

### Development Tracking
- `GET /milestone-questions/{week}` - Get milestone questions for specific week
- `POST /weekly-checkin` - Submit weekly check-in and get AI summary (authenticated)
- `POST /share-summary` - Share summary with partner via email (authenticated)

### Health
- `GET /health` - Service health check

## 🌱 Milestone Data

The application includes comprehensive milestone data for weeks 1-52:

- **Physical Development**: Motor skills, movement, coordination
- **Social Development**: Interaction, attachment, emotional responses
- **Communication**: Language development, sounds, understanding
- **Brain Development**: Cognitive skills, problem-solving, memory
- **Feeding**: Nutrition milestones and feeding patterns

Each milestone includes:
- Age-appropriate expectations
- Practical tips for parents
- Red flags for concern
- NHS/WHO source citations

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and standards
- Testing requirements
- Documentation updates
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔧 Environment Variables

### Required
- `OPENAI_API_KEY`: Your OpenAI API key
- `JWT_SECRET_KEY`: Secret key for JWT token generation
- `RENDER_DB_*`: Database connection details (auto-populated by Render)

### Optional
- `RENDER_SMTP_*`: Email configuration for partner sharing
- `REACT_APP_API_BASE_URL`: Frontend API base URL

---

**Built with ❤️ for parents everywhere**

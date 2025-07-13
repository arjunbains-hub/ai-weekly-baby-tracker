# 🍼 Weekly Baby Genie

A warm, personalized baby development tracker and weekend planner for parents of babies aged 0–3. Designed for UK parents and guided by NHS and WHO milestone data, with a tone of voice like a supportive midwife.

---

## 🎯 What is Weekly Baby Genie?

Weekly Baby Genie helps you:
- Track your baby's development week by week
- Get personalized summaries and actionable activity plans
- Plan family-friendly weekends based on your preferences and location
- Check in weekly and see your baby's progress

---

## 🚀 Features

- **Baby Profile Setup**: Add your baby's details (name, DOB, etc.)
- **Weekly Check-ins**: Log sleep, milestones, and challenges
- **Personalized Summaries**: Get warm, supportive AI-generated insights
- **Weekend Planner**: Plan activities based on your family's needs
- **Modern, Soft UI**: Inspired by Cleo Bank and Airbnb, with a playful sky background
- **Secure Authentication**: JWT-based login/signup
- **Shareable Summaries**: Email plans to your partner (optional)

---

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Material-UI
- **Backend**: FastAPI + Python
- **Database**: PostgreSQL (Render Managed or local)
- **Authentication**: JWT + bcrypt
- **Deployment**: Render (web + database + static site)
- **Styling**: Custom pastel/soft design system

---

## 🏃‍♀️ Local Development

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (or use Render's managed database)
- OpenAI API key (for AI summaries)

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
# Set REACT_APP_API_URL=http://localhost:8000
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

---

## 📱 User Journey

1. **Welcome**: Land on the inviting homepage with a sky background
2. **Baby Profile**: Set up your baby's details
3. **Weekend Planner**: Enter your location and preferences
4. **Check-in**: Log weekly sleep and milestones
5. **AI Summary**: Receive personalized insights and activity suggestions
6. **Share**: Optionally send the summary to your partner via email

---

## 🎨 Design Philosophy

- Soft, modern, and warm UI (inspired by Cleo Bank & Airbnb)
- Animated sky background with sun and clouds
- Large, bold headings and clear flow steps
- Pastel color palette (petal pink, mint green, charcoal navy)
- Minimal contrast, lots of whitespace, and playful touches

---

## 🔧 Environment Variables

### Required
- `OPENAI_API_KEY`: Your OpenAI API key
- `JWT_SECRET_KEY`: Secret key for JWT token generation
- `RENDER_DB_*`: Database connection details (auto-populated by Render)
- `REACT_APP_API_URL`: Frontend API base URL

### Optional
- `RENDER_SMTP_*`: Email configuration for partner sharing

---

## 🗄️ Database Schema

- **users**: User authentication and profiles
- **baby_profiles**: Baby information
- **weekly_checkins**: Parent responses to milestone questions
- **development_summaries**: AI-generated summaries and plans
- **milestone_data**: NHS/WHO milestone data for weeks 1-52

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**This codebase has been cleaned and now contains only the baby tracker and weekend planner app. All unrelated files and features have been removed for clarity and maintainability.**

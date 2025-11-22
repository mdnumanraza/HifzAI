# HifzFlow (Phase 1)

Smart Qur'an memorization system – foundational phase.

## Stack
Backend: Node.js + Express + MongoDB + Mongoose + JWT + Axios + node-cron
Frontend: React + Vite + TailwindCSS + Zustand + Axios + React Router
External API: Al-Quran Cloud (text + audio: ar.alafasy)

# HifzFlow (Phase 1 & 2)

Smart Qur'an memorization system with gamification and progress tracking.

## Stack
Backend: Node.js + Express + MongoDB + Mongoose + JWT + Axios + node-cron
Frontend: React + Vite + TailwindCSS + Zustand + Axios + React Router + Framer Motion
External API: Al-Quran Cloud (text + audio: ar.alafasy)

## Phase 1 Features
- Auth (register/login) & JWT with 5-day persistent sessions
- User settings (daily goal, current position)
- Dynamic daily ayah fetching (sequential, across surahs)
- Mark ayah memorized and advance pointer
- Progress summary endpoint
- Memorization UI with looping audio per ayah
- Settings, Dashboard, Login/Signup screens with premium Islamic design
- **Qur'an Reading Module**:
  - Browse all 114 Surahs with beautiful card grid
  - Browse all 30 Paras (Juz) with organized list
  - Individual Surah Reader with all ayahs and audio players
  - Individual Para Reader with ayahs grouped by surah
  - Audio playback for each ayah (ar.alafasy reciter)
  - Loop toggle for repeated listening
  - Modern Islamic UI with emerald green, gold accents, and glassmorphism

## Phase 2 Features (NEW!)
- **Streak System**: 
  - Automatic daily streak tracking
  - Current & highest streak display
  - Milestone celebrations (7, 30, 100 days)
  - Animated streak counter with fire icon
- **Reward System**: 
  - Points (+10 per ayah, +50 per goal, +200 per surah)
  - Coins (+1 per ayah, +5 per goal, +20 per surah)
  - Badge system (Surah Champion, Consistency Badge, Dedicated Badge, Century Streak)
  - Animated rewards page with badge gallery
- **Revision Engine**: 
  - Automatic addition to revision list after memorization
  - Revision statistics (total, reviewed today, pending)
  - Individual ayah revision with audio playback
  - Send back to memorization feature
  - Review count tracking
- **Memorization History**: 
  - Date-wise grouped history
  - Memorized vs Reviewed action tracking
  - Play audio directly from history
  - Statistics dashboard
- **Upgraded Memorization Card**: 
  - Quranic fonts (Scheherazade New, Amiri Quran, Noto Naskh Arabic)
  - Larger, more readable Arabic text
  - Islamic geometric border decorations
  - Gold accent underlines
  - Enhanced micro-interactions and animations
- **Celebration System**: 
  - Confetti animation on milestones
  - Milestone modal with badge reveal
  - Animated counters and shine effects

## Running
### Backend
```bash
cd backend
MONGO_URI=mongodb://localhost:27017/hifzflow 
JWT_SECRET=devsecret 
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Visit: http://localhost:5173

## Environment Variables (Backend)
- `MONGO_URI` Mongo connection string
- `JWT_SECRET` Secret for signing tokens
- `PORT` (default 5000)

## Future Phases (Excluded Now)
AI recitation analysis, scheduler, gamification, tafsir, advanced analytics.

## API Summary
Auth:
- POST /auth/register
- POST /auth/login

User:
- PATCH /user/settings

Memorization:
- GET /memorization/daily
- POST /memorization/mark (now triggers streak, rewards, revision, history)
- GET /memorization/progress

Streak (Phase 2):
- POST /streak/update
- GET /streak

Rewards (Phase 2):
- POST /rewards/update
- GET /rewards

Revision (Phase 2):
- POST /revision/add
- GET /revision/list
- POST /revision/remove
- POST /revision/mark-reviewed
- POST /revision/send-back
- GET /revision/stats

History (Phase 2):
- POST /history/add
- GET /history
- GET /history/stats

## Frontend Routes
Public:
- /login - Login page
- /signup - Signup page

Protected (require authentication):
- /dashboard - Main dashboard with stats, streak, rewards overview
- /memorize - Daily memorization with upgraded ayah cards
- /revision - Revision center with ayah list and review tracking
- /rewards - Rewards page with points, coins, badge gallery
- /history - Memorization history grouped by date
- /settings - User settings (daily goal, position)
- /quran/surahs - Browse all surahs
- /quran/paras - Browse all paras (juz)
- /quran/surah/:id - Read complete surah with audio
- /quran/para/:id - Read complete para with audio

## Quran API Used
- Surah list: https://api.alquran.cloud/v1/surah
- Surah with audio: https://api.alquran.cloud/v1/surah/{id}/ar.alafasy
- Juz with audio: https://api.alquran.cloud/v1/juz/{id}/ar.alafasy

## Notes
node-cron placeholder added for future daily automation.

## License
Internal project – no public license declared yet.

# SkillBridge - Community Skill Exchange & Learning Network System

**SkillBridge** is a modern, responsive web application for students, faculty, and professionals to exchange practical skills, connect with learning partners, set milestone-driven goals, log peer learning sessions, and track growth.

---

## 🌟 Key Features Implemented

### 1. High-End Authentication & Dedicated Portal
- **Split-Screen Design**: Dual-column layout featuring community value proposition, platform metrics, peer testimonials, and high-conversion auth cards.
- **Sign In & Account Registration**:
  - Secure email & password authentication with show/hide password toggle.
  - "Remember me" session retention with persistent browser storage.
  - **Quick Test Fill**: Convenient 1-click test credential fill (`alex.morgan@campus.edu` / `password123`) for effortless evaluation.
  - **New User Registration**: Set your full name, email, password, primary discipline, initial teaching skill with category, and initial learning goal.
  - **Forgot Password Workflow**: Modal to define and update your password with instant feedback.
- **Clean Session Management**: Seamless sign-out from the navigation menu with immediate return to the login portal.

### 2. Skill Management (Teaching & Learning Portfolios)
- **Categorized Portfolio**: Manage skills across **Programming, Design, Communication, Writing, Media, Business, and Other**.
- **Proficiency Tracking**: Support for *Beginner, Intermediate, Advanced, and Expert* levels with visual color-coded badges.
- **Detailed Attributes**: Years of experience, scope/description, and custom scheduling availability notes (e.g., "1 hr/week on weekends, code pairing").
- **Full CRUD Support**: Add, edit, or delete teaching skills and learning desires in real-time.

### 3. Discovery & Directory Search
- **Searchable Network**: Instant full-text search across members by name, role, bio keywords, or skill names.
- **Multi-Facet Filtering**: Filter simultaneously by Category, Intent (*Can Teach* vs *Wants to Learn*), Proficiency level, and Format (*1-on-1 Video, Async Review, Hands-on Pairing, Chat, Workshop*).
- **Rich Profile Cards**: Quick overview of offered skills, sought skills, bio, rating, location, and hours available.
- **Dedicated Profile Modal**: Inspect full profile credentials and directly trigger a connection proposal.
- **Contextual Empty States**: Helpful reset buttons and suggestions when searches return zero matches.

### 4. Smart Skill Matching Engine
- **Synergy Algorithm**: Calculates mutual exchanges where User A offers what User B seeks, and User B offers what User A seeks.
- **Categorized Recommendations**:
  - **Mutual Exchanges (2-Way)**: High-priority reciprocal partnerships with synergy explanation and compatibility scores (up to 99%).
  - **Mentor Matches**: Verified experts who teach skills on your learning roadmap.
  - **Peer Learners**: Community members actively seeking what you teach.
- **Save Matches**: Bookmark prospective learning partners for later follow-up.
- **Exchange Proposal Modal**: Pre-fills offered and requested skills with personalized notes and format selection.

### 5. Learning Goals & Milestone Tracking
- **Roadmap Management**: Create, edit, and organize learning goals with target deadlines.
- **Dynamic Checkpoints**: Add custom actionable milestones to each goal.
- **Interactive Checkboxes**: Toggling milestones automatically calculates percentage progress and updates status (*Not Started* → *In Progress* → *Completed*).
- **Status Filters**: Quickly view *All*, *In Progress*, or *Completed* goals.

### 6. Learning Activity Tracker & Audit Trail
- **Session Logging**: Record session date, duration in minutes, skill domain, category, activity format, partner name, and detailed summary.
- **Teaching vs Learning Role**: Clear distinction between time invested in mentoring peers vs absorbing new concepts.
- **Key Takeaways Checklist**: Store bulleted takeaways and insights gained from each session.
- **Metrics Dashboard**: Instant aggregation of total hours, teaching hours, learning hours, and peer sessions.
- **Search & Filter**: Search activity logs by skill or partner name.

### 7. Badges & Milestone Recognition
- **Transparent Criteria**: Badges rewarded for objective milestones (e.g. *First Skill Exchange, Knowledge Giver (2.5h+ teaching), Goal Finisher, 5-Day Consistency Streak, Curious Mind (3+ categories)*).
- **Progress Meters**: Real-time progress bars showing distance to unlock the next tier.
- **Objective Rules**: All achievements represent quantifiable engagement within the network.

### 8. Analytics & Data Export
- **Visual Analytics**:
  - Knowledge Sharing Balance (Teaching vs Learning percentage split).
  - Time Spent per Skill Category (visual horizontal progress distribution).
  - Activity breakdown by collaboration format.
  - Goal completion rate metric.
- **Working CSV Export**:
  - Download full Activity Log history as a formatted `.csv` file.
  - Download Learning Goals and Milestones as a `.csv` file.
- **Print-Friendly Report**: Clean, printer-optimized styling (`window.print()`).

---

## 🚀 How to Run the Application

The application is built with **React 18, TypeScript, Tailwind CSS, Vite, and Lucide Icons**.

### Requirements
- **Node.js** (v18 or higher)
- **npm**

### Step-by-Step Instructions

1. **Navigate to the project directory**:
   ```powershell
   cd C:\Users\ramr7\.gemini\antigravity\scratch\community-skill-exchange
   ```

2. **Start the Development Server**:
   ```powershell
   cmd.exe /c npm run dev
   ```
   Or run the production build preview:
   ```powershell
   cmd.exe /c npm run preview
   ```

3. **Open in your browser**:
   Navigate to `http://localhost:3000` (or the port Vite outputs in your console).

4. **Signing In / Testing**:
   - You can click **"Quick-fill test account"** on the login page or enter:
     - **Email**: `alex.morgan@campus.edu`
     - **Password**: `password123`
   - Or click **"Create Account"** to register a brand new identity with custom skills and credentials.

5. **Building for Production**:
   ```powershell
   cmd.exe /c npm run build
   ```
   The optimized production bundle is generated in `dist/`.

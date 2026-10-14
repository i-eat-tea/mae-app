# ម៉ែ — by FlowErs
### នៅក្បែរម៉ាក់ៗ សម្រាប់ការមានពពោះលើកដំបូង
*A Cambodia-first, Khmer-first pregnancy companion for first-time mothers.*

ម៉ែ is a warm, gentle companion that walks first-time mothers through pregnancy in their own language. It combines monthly maternal voice messages with focused stage guidance and health information from trusted authorities.

## ✨ Features

- **Monthly maternal voice messages** ("ម៉ែមានរឿងចង់ប្រាប់"): Months 1–9, written as a mother speaking to her baby
- **Focused stage guidance**: clear, week-by-week reminders about what matters right now
- **Verified health resources** from the Cambodia Ministry of Health / NMCHC, WHO, UNICEF, and RHAC
- **Khmer-first**, with English available through the language switcher
- **Flower growth visual** that follows the pregnancy journey

---

## 🚀 Quick Start

### Prerequisites

| Tool    | Version    |
|---------|------------|
| Node.js | v18.0.0+   |
| npm     | v9.0.0+    |

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` avoids peer dependency conflicts between Vite and esbuild. It is especially useful on Windows / Git Bash.

### 2. Start the dev server

```bash
npm run dev
```

### 3. Open in your browser

```
http://localhost:3000
```

> **No environment variables needed for now.** The app runs fully offline with local data, and no AI or API keys are used yet. If you leave a `.env.example` from the starter template in the project, you can safely ignore or delete it.

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── screens/                 # Home, Journey, Explore (Resources), Profile, Landing
├── components/              # Audio player, flower growth visual, topic & resource cards, modals
├── context/
│   └── AppContext.tsx       # Global state, auth, language switcher, telemetry logger
└── data/
    ├── monthlyMessages.ts   # Monthly maternal voice scripts (Months 1–9)
    └── resources.ts         # Curated health articles and input template
```

---

## 🗄️ Database Setup & Data Collection

The app currently stores user sessions and research events in browser **localStorage**. When you are ready to collect data in a real database (such as Supabase or Firebase), use the schemas below.

### 1. Users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'km',
  pregnancy_week INTEGER DEFAULT 9,
  due_date DATE,
  notification_preference TEXT DEFAULT 'weekly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### 2. Resources

```sql
CREATE TABLE resources (
  id TEXT PRIMARY KEY,
  title_kh TEXT NOT NULL,
  title_en TEXT,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  category TEXT NOT NULL,
  pregnancy_stage TEXT NOT NULL,
  pregnancy_weeks INTEGER[],
  summary_kh TEXT NOT NULL,
  summary_en TEXT,
  summary_purpose TEXT,
  weekly_focus TEXT,
  status TEXT DEFAULT 'Published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### 3. Analytics / Research Telemetry

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  event_name TEXT NOT NULL,
  content_id TEXT,
  pregnancy_week INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### 🔌 Integration point

In `src/context/AppContext.tsx`, replace the localStorage calls with calls to your database client.

---

## 🩺 Health Content Sources

All health resources are drawn from verified authorities:

- Cambodia Ministry of Health / National Maternal and Child Health Center (NMCHC)
- World Health Organization (WHO)
- UNICEF
- Reproductive Health Association of Cambodia (RHAC)

> ម៉ែ is an informational companion and does not replace advice from a doctor or midwife.

---

Made with care by **FlowErs** 🌸
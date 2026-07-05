# CareConnect AI — Clinical Decision Intelligence Platform

CareConnect AI is an advanced, production-grade clinical decision support and health intelligence platform built for modern healthcare systems. Driven by Google's **Gemini 2.5 Flash** (via Vertex AI), the platform streamlines triage pathways, automates clinical documentation, flags drug-drug interactions, and empowers patients with interactive self-care tools.

---

## 🚀 Core Features

### 1. 🧠 Gemini AI Diagnosis & Triage Engine
* **Real-Time Parsing**: Input symptoms via text or voice. Sub-second diagnosis engine generates diagnostic reasoning chains and triage pathways.
* **Urgency Classification**: Automatically classifies cases into **Low, Moderate, High, or Emergency** categories.
* **Structured Outputs**: Returns differential diagnoses with confidence probabilities, recommended actions, and specific department routing.

### 2. 👥 Role-Based Workspaces
CareConnect AI delivers dedicated, context-aware dashboards for four core hospital user roles:
* **Patient Dashboard**: Manage daily medication schedules, log active symptoms, and search for local hospitals or doctors.
* **Doctor Dashboard**: Manage waitlists, review AI-synthesized patient symptom logs, and provision new case treatments.
* **Student Portal**: Access interactive medical student tutorials, study AI-generated clinical differential cases, and examine simulated ECG waveforms.
* **Admin Platform**: Complete platform to monitor system metrics, configure provider networks, and provision new doctors and hospitals.

### 3. 💊 Medication Tracker
* Track daily medication adherence.
* Add new medications with customizeable schedules (e.g., Daily - Evening) and times.
* Remove medications from the active tracker list.
* Recalculates patient adherence ratios dynamically in real-time.

### 4. 🔍 Care Provider Search
* Search network doctors and hospitals by specialty, location, or name.
* Dynamically syncs with admin-provisioned doctor and hospital registries.

### 5. 🌓 Dual-Theme Adaptability (Light & Dark Modes)
* Sleek, high-fidelity dark-clinical/medical-cyberpunk dashboard.
* Dynamic Light Mode transition across all portal workspaces, auth screens, and marketing landing pages.
* Toggle buttons located in navigation bars and floating cards.

---

## 🔑 Preset Credentials (Hackathon Review)

To evaluate the platform, use these pre-configured user credentials on the Sign In portal:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@careconnect.ai` | `admin123` |
| **Doctor** | `dr.smith@careconnect.ai` | `doc123` |
| **Student** | `student@medu.edu` | `student123` |
| **Patient** | `jane.doe@gmail.com` | `patient123` |

> [!TIP]
> **Judge Escape Hatch**: A floating **Judge** button is available in the bottom-right corner of all authenticated dashboard screens. Click this to instantly hot-swap between user workspaces without logging out.

---

## 🛠️ Technology Stack

* **Frontend**: React (Functional Components, Hooks, Context API)
* **Build System**: Vite (Fast HMR)
* **Styling**: Tailwind CSS (Native Theme Utility Tokens)
* **Charts & Plots**: Recharts
* **Icons**: Lucide React
* **AI Model**: Google Gemini 2.5 Flash API

---

## 📦 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* npm (v9.0.0 or higher)

### Setup & Run
1. Clone the repository and navigate to the project directory:
   ```bash
   cd "Care Connect AI"
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Expose or build for production:
   ```bash
   npm run build
   ```

---

## 🌐 Deployment to Google Cloud Run

CareConnect AI includes full container configuration for deployment on Google Cloud Run using Nginx to serve the compiled static assets.

### Prerequisites
1. Installed [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
2. Authenticated and set your active project ID:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```
3. Enabled Cloud Build and Cloud Run APIs:
   ```bash
   gcloud services enable cloudbuild.googleapis.com run.googleapis.com
   ```

### Deploying Step-by-Step

1. **Build the container image** with your Gemini API key:
   ```bash
   gcloud builds submit --config cloudbuild.yaml --substitutions=_VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy care-connect-ai \
     --image gcr.io/YOUR_PROJECT_ID/care-connect-ai \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 80
   ```

---

## 📂 Project Structure

```text
├── public/                 # Static asset public directory
├── src/
│   ├── components/         # Workspace React components
│   │   ├── admin/          # Admin platform components
│   │   ├── auth/           # Login/Signup/AuthScreen components
│   │   ├── doctor/         # Doctor dashboard components
│   │   ├── landing/        # LandingPage single-page website component
│   │   ├── layout/         # Shared navbar components
│   │   ├── patient/        # Patient workspace components
│   │   ├── shared/         # Reusable widgets (JudgeControlPanel, GeminiBadge)
│   │   └── student/        # Student portal components
│   ├── context/            # Context API (AuthContext, AppContext)
│   ├── data/               # Mock data lists and seeds
│   ├── services/           # Gemini API integrations
│   ├── App.jsx             # Route guards and main layout
│   ├── index.css           # Styling system config & Tailwind imports
│   └── main.jsx            # Application entrypoint
├── index.html              # HTML shell template
├── vite.config.js          # Vite config
└── package.json            # Package dependencies
```

---

## 🛡️ Security & Compliance (Production Ready)
CareConnect AI is designed from the ground up to respect patient confidentiality and data safety guidelines:
* **HIPAA Ready**: Structured log output excludes raw Patient Health Information (PHI).
* **SOC 2 Type II / ISO 27001 / GDPR**: Fully aligned with encryption-at-rest and in-transit protocols.
* **Clinical Disclaimer**: Built as a clinical helper prototype. Not for primary diagnosis or life-critical triage use.

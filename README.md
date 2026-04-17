# India Post — AI-Based Financial Needs Identification System

> Intelligently identify which financial and insurance schemes to promote in which villages, targeting the right demographic at the right time of year.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Schemes Reference](#schemes-reference)
- [Data Upload Format](#data-upload-format)
- [User Roles](#user-roles)
- [Default Credentials](#default-credentials)
- [Scoring Logic](#scoring-logic)
- [Team & Responsibilities](#team--responsibilities)

---

## About the Project

The **Department of Posts** runs outreach camps called **melas** across villages in India to promote savings and insurance products. Currently these melas are conducted uniformly in all villages without considering the demographic composition of each village — resulting in poor conversion rates.

This system solves that by:
1. Taking village-level demographic data as input
2. Running an AI scoring engine to rank all 7 financial schemes per village
3. Telling staff **which scheme to promote**, **in which village**, and **when** (based on farming season)

---

## Problem Statement

> *"While the Post Office Network serves everyone, everywhere, on all days, the need for various services has a seasonal variation. A robust system to segment, target and focus on each customer based on their needs from time to time is needed for India Post."*

**Example:** A village with 68% female children under 10 should get an SSA (Sukanya Samriddhi Account) mela — not an SCSS (Senior Citizen) mela. A farming village in March (post-Rabi harvest) should get an RPLI mela when farmers have cash.

---

## How It Works

```
User uploads village data (CSV / Excel / Manual Form)
            ↓
Spring Boot saves village to MongoDB
            ↓
Spring Boot calls Python ML service automatically
            ↓
Python scores all 7 schemes using demographic ratios
            ↓
Ranked recommendations saved to MongoDB
            ↓
React displays ranked scheme cards to user
```

---

## Tech Stack

| Layer            | Technology            | Version       |
|------------------|----------------------|----------------|
| Backend          | Spring Boot + Java   | 3.2 / Java 21  |
| AI Engine        | Python + FastAPI     | 3.11 / 0.109   |
| Database         | MongoDB              | 7.0            |
| Authentication   | JWT (HMAC-SHA256)    | RFC 7519       |
| Excel Parsing    | Apache POI           | 5.2.5          |
| CSV Parsing      | OpenCSV              | 5.9            |
| PDF Generation   | iText                | 5.5.13         |
---

##  System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (Port 3000)                    │
│                    React Frontend                        │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP REST + JWT
                        ▼
┌─────────────────────────────────────────────────────────┐
│               Spring Boot Backend (Port 8080)            │
│  AuthController  VillageController  UploadController     │
│  RecommendationController  MelaController  ReportController│
│  UserController                                          │
│                                                          │
│  AuthService  VillageService  UploadService              │
│  RecommendationService  MelaService  ReportService       │
│  UserService                                             │
└──────────┬─────────────────────────┬────────────────────┘
           │ MongoDB Wire Protocol   │ HTTP REST
           ▼                         ▼
┌──────────────────┐    ┌────────────────────────────────┐
│  MongoDB (27017) │    │   Python ML Service (8000)      │
│                  │    │                                 │
│  users           │    │  POST /recommend                │
│  villages        │    │  Scores all 7 schemes           │
│  recommendations │    │  Returns ranked JSON            │
│  melas           │    │                                 │
│  uploads         │    │                                 │
└──────────────────┘    └────────────────────────────────┘
```

---

##  Project Structure

```
Minor Project/
├── Development/
│   └── Backend/
│       ├── financialneeds/              ← Spring Boot project
│       │   ├── src/main/java/com/indiapost/financialneeds/
│       │   │   ├── config/
│       │   │   │   ├── SecurityConfig.java
│       │   │   │   ├── JwtUtil.java
│       │   │   │   ├── JwtFilter.java
│       │   │   │   └── CorsConfig.java
│       │   │   ├── model/
│       │   │   │   ├── User.java
│       │   │   │   ├── Village.java
│       │   │   │   ├── Recommendation.java
│       │   │   │   ├── Mela.java
│       │   │   │   └── UploadLog.java
│       │   │   ├── repository/
│       │   │   │   ├── UserRepository.java
│       │   │   │   ├── VillageRepository.java
│       │   │   │   ├── RecommendationRepository.java
│       │   │   │   ├── MelaRepository.java
│       │   │   │   └── UploadRepository.java
│       │   │   ├── dto/
│       │   │   │   ├── LoginRequest.java
│       │   │   │   ├── LoginResponse.java
│       │   │   │   ├── VillageRequest.java
│       │   │   │   ├── MelaRequest.java
│       │   │   │   ├── UserRequest.java
│       │   │   │   └── UploadResult.java
│       │   │   ├── service/
│       │   │   │   ├── AuthService.java
│       │   │   │   ├── UserService.java
│       │   │   │   ├── VillageService.java
│       │   │   │   ├── RecommendationService.java
│       │   │   │   ├── UploadService.java
│       │   │   │   ├── MelaService.java
│       │   │   │   └── ReportService.java
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── VillageController.java
│       │   │   │   ├── UploadController.java
│       │   │   │   ├── RecommendationController.java
│       │   │   │   ├── MelaController.java
│       │   │   │   ├── ReportController.java
│       │   │   │   └── UserController.java
│       │   │   ├── DataSeeder.java
│       │   │   └── FinancialNeedsApplication.java
│       │   ├── src/main/resources/
│       │   │   └── application.properties
│       │   └── pom.xml
│       │
│       └── python-ml/                   ← Python ML service
│           ├── app/
│           │   ├── __init__.py
│           │   ├── main.py
│           │   ├── models.py
│           │   ├── scorer.py
│           │   └── seasonal.py
│           ├── venv/                    ← auto-generated, do not touch
│           ├── requirements.txt
│           ├── .env
│           ├── run.py
│           └── README.md
│
└── frontend/                            ← React project (your friend)
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js
    │   │   ├── auth.js
    │   │   ├── villages.js
    │   │   ├── upload.js
    │   │   ├── recommendations.js
    │   │   ├── melas.js
    │   │   ├── reports.js
    │   │   └── users.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── SchemeBadge.jsx
    │   │   ├── ConfirmModal.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── VillageList.jsx
    │   │   ├── VillageDetail.jsx
    │   │   ├── Upload.jsx
    │   │   ├── UploadHistory.jsx
    │   │   ├── Melas.jsx
    │   │   ├── Reports.jsx
    │   │   └── UserManagement.jsx
    │   └── utils/
    │       ├── schemeConfig.js
    │       └── formatDate.js
    └── package.json
```

---

##  Prerequisites

Make sure these are installed before starting:

| Tool            | Version           | Download |
|-----------------|------------------|----------|
| Java JDK        | 21 (LTS)         | [Download](https://adoptium.net) |
| Maven           | 3.9+             | [Download](https://maven.apache.org) |
| Python          | 3.11 or 3.12     | [Download](https://python.org) |
| MongoDB         | 7.0 Community    | [Download](https://mongodb.com/try/download/community) |
| Node.js         | 18+              | [Download](https://nodejs.org) |
| IntelliJ IDEA   | Community        | [Download](https://jetbrains.com/idea) |
| Postman         | Latest           | [Download](https://postman.com) |

**Verify all installations:**
```bash
java -version        # openjdk 21
mvn -version         # Apache Maven 3.9.x
python --version     # Python 3.11.x
mongod --version     # db version v7.0.x
node --version       # v18.x.x
```

---

##  Installation & Setup

### 1. Clone / Download the project

```bash
# Place the project at:
C:\Users\lenovo\OneDrive\Desktop\Aryan\Minor Project\Development\Backend\
```

### 2. Setup Spring Boot

Open `financialneeds/pom.xml` — make sure all dependencies are present (see pom.xml in project).

Open IntelliJ IDEA → File → Open → select `financialneeds/` folder.

In IntelliJ:
- Maven panel (right side) → click **Reload** button
- File → Settings → Plugins → search **Lombok** → Install → Restart
- File → Settings → Build → Compiler → Annotation Processors → ✅ Enable

Verify `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/indiapost
server.port=8080
jwt.secret=indiapost-super-secret-key-2026-make-this-very-long
jwt.expiration=86400000
ml.service.url=http://localhost:8000
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### 3. Setup Python ML Service

```bash
# Navigate to python-ml folder
cd Development/Backend/python-ml

# Create virtual environment
python -m venv venv

# Activate (Windows Command Prompt)
venv\Scripts\activate

# Activate (Windows PowerShell)
venv\Scripts\Activate.ps1

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Setup React Frontend

```bash
cd frontend

# Install all dependencies
npm install
```

---

## Running the Application

**Start all four services in this exact order:**

### Terminal 1 — MongoDB
```bash
# MongoDB starts automatically on Windows after installation
# Or start manually:
mongod
```

### Terminal 2 — Python ML Service
```bash
cd Development/Backend/python-ml

# Activate virtual environment first
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Start the service
python run.py

# You should see:
# India Post ML Service Starting...
# URL:  http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Terminal 3 — Spring Boot Backend
```bash
cd Development/Backend/financialneeds

mvn spring-boot:run

# You should see:
# Started FinancialNeedsApplication in X seconds
# Default users created:
#   user@indiapost.gov.in  / user123
#   admin@indiapost.gov.in / admin123
```

### Terminal 4 — React Frontend
```bash
cd frontend

npm start

# Browser opens automatically at http://localhost:3000
```

---

##  Default Credentials

| Role | Email | Password |
|---|---|---|
| USER | user@indiapost.gov.in | user123 |
| ADMIN | admin@indiapost.gov.in | admin123 |

>  Change these passwords immediately before any production use.

---

## 📡 API Endpoints

All endpoints except login require `Authorization: Bearer <token>` header.

**Base URL:** `http://localhost:8080`

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login — returns JWT token |

### Villages
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/villages` | Both | List villages — optional `?state=&district=&block=` |
| GET | `/api/villages/{id}` | Both | Single village detail |
| POST | `/api/villages` | Both | Create village manually |

### Upload
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/upload/csv` | Both | Upload CSV file |
| POST | `/api/upload/excel` | Both | Upload Excel file |
| GET | `/api/uploads` | Both | Upload history |

### Recommendations
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/recommendations` | Both | All villages top scheme summary |
| GET | `/api/recommendations/{villageId}` | Both | Full ranked schemes for one village |

### Melas
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/melas` | Both | List melas — optional `?district=&schemeCode=` |
| POST | `/api/melas` | USER only | Schedule a new mela |

### Reports
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/reports/district/{district}` | Both | District statistics |
| GET | `/api/reports/export/{district}` | Both | Download PDF report |

### Users (Admin only)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | ADMIN | List all users |
| POST | `/api/users` | ADMIN | Create user |
| PUT | `/api/users/{id}` | ADMIN | Edit user |
| PATCH | `/api/users/{id}/deactivate` | ADMIN | Deactivate user |

---

## 📊 Schemes Reference

| Code | Full Name | Target Group | Badge Colour |
|---|---|---|---|
| SSA | Sukanya Samriddhi Account | Female children under 10 | 🩷 `#E91E63` |
| MSSC | Mahila Samman Savings Certificate | Adult women | 💜 `#9C27B0` |
| SCSS | Senior Citizen Savings Scheme | Population aged 60+ | 🟠 `#FF9800` |
| PPF | Public Provident Fund | Salaried youth | 🔵 `#2196F3` |
| PLI | Postal Life Insurance | Salaried service holders | 🩵 `#00BCD4` |
| RPLI | Rural Postal Life Insurance | Farmers / rural population | 🟢 `#4CAF50` |
| RD_TD | Recurring / Time Deposit | All segments | 🟤 `#795548` |

---

## Data Upload Format

### CSV / Excel Column Format

Row 1 must be the header with **exact** column names:

```
villageName, block, district, state, popTotal, popMale, popFemale,
popChildUnder10, popSenior60Plus, popFarmer, popSalaried, popBusiness,
cropType, harvestMonths
```

### Example data row:
```
Simulpur, Bongaon, North 24 Parganas, West Bengal, 1240, 580, 660, 210, 145, 380, 120, 95, Rabi, "3,4"
```

### Notes:
- `cropType` must be one of: `Rabi`, `Kharif`, `Both`
- `harvestMonths` — comma-separated month numbers (1=Jan, 12=Dec). Wrap in quotes if multiple: `"3,4"`
- All population fields must be non-negative integers
- `popMale + popFemale` must not exceed `popTotal`

---

## 👥 User Roles

| Feature | USER | ADMIN |
|---|---|---|
| Upload village data | ✅ | ✅ |
| View village list & detail | ✅ | ✅ |
| View AI recommendations | ✅ | ✅ |
| Schedule melas | ✅ | ❌ |
| Download PDF reports | ✅ | ✅ |
| View upload history | ✅ | ✅ |
| Manage user accounts | ❌ | ✅ |

---

##  Scoring Logic

Python scores each scheme using demographic ratios:

| Scheme | Formula | Seasonal Boost |
|---|---|---|
| SSA | `(female/total × 0.5) + (childUnder10/total × 0.5)` | None |
| MSSC | `female / total` | None |
| SCSS | `senior60+ / total` | None |
| PPF | `salaried / total` | None |
| PLI | `salaried / total × 0.8` | None |
| RPLI | `farmer / total` | **+0.20** during harvest months |
| RD_TD | `0.30` fixed base | **+0.10** during harvest months |

**Seasonal boost trigger:**
- Rabi crop + month is March or April → RPLI and RD_TD get boost
- Kharif crop + month is October or November → RPLI and RD_TD get boost

---

## 🔧 Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `Cannot resolve symbol 'lombok'` | Lombok plugin not installed | File → Settings → Plugins → install Lombok |
| `Package does not correspond to file path` | Wrong folder structure | Mark `src/main/java` as Sources Root |
| `Connection refused` on Spring Boot start | MongoDB not running | Start `mongod` first |
| Recommendations not generated | Python ML not running | Start `python run.py` on port 8000 |
| CORS error in browser | Spring Boot not running | Start Spring Boot before React |
| `401 Unauthorized` on API call | Token expired or missing | Re-login to get fresh token |
| PowerShell activation blocked | Execution policy restricted | Run: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |

---

##  Team & Responsibilities

| Member | Role | Responsibility |
|---|---|---|
| Aryan Gore | Backend Developer | Spring Boot REST API, MongoDB, JWT auth, file upload parsing, PDF generation |
| Ayushi Rajpoot | AI/ML Developer | Python FastAPI scoring engine, seasonal logic |
| Jayesh Khatke | Frontend Developer | React UI, all screens, API integration, charts |

---

## 📄 Documents

All project documents are available in the project folder:

- `IndiaPost_SRS_IEEE.docx` — Software Requirements Specification (IEEE format)
- `IndiaPost_SpringBoot_Complete.docx` — Complete Spring Boot code with learning notes
- `IndiaPost_Python_Complete.docx` — Complete Python ML service code
- `IndiaPost_Frontend_Spec_v1.1.docx` — Frontend specification for React developer
- `IndiaPost_System_Explanation.docx` — Plain-language system explanation
- `IndiaPost_UML_Diagrams.docx` — All 8 UML diagrams

---

##  License

This project is developed as a Minor Project for academic purposes.

---

*India Post AI Financial Needs System — Making every mela count.*

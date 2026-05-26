# AZ-2008-May-26-2026

![Main Workflow](https://github.com/msftnutta/AZ-2008-May-26-2026/actions/workflows/main-workflow-github-action.yml/badge.svg?branch=main)
![CI Pipeline](https://github.com/msftnutta/AZ-2008-May-26-2026/actions/workflows/ci.yml/badge.svg?branch=main)
![CD Pipeline](https://github.com/msftnutta/AZ-2008-May-26-2026/actions/workflows/cd.yml/badge.svg?branch=main)
![Coverage](https://msftnutta.github.io/AZ-2008-May-26-2026/coverage/badge.svg)

## AZ-2008 DevOps Foundation

A Node.js Express web application that displays live world clocks and weather forecasts for Australia, Thailand, Japan, and India — built as a hands-on project for learning DevOps practices with GitHub and Azure.

---

## About the Project

This is a simple Express.js web app with Bootstrap that:
- Displays real-time clocks for multiple countries
- Fetches 5-day weather forecasts from **Azure Maps API**
- Shows weather icons and a hover popout for detailed forecasts

The real focus of this project is the **DevOps workflow** — how we use GitHub features and automation to build, test, and deliver software.

---

## Quick Setup

```bash
# Clone the repo
git clone https://github.com/msftnutta/AZ-2008-May-26-2026.git
cd AZ-2008-May-26-2026

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your Azure Maps key

# Run the app
npm start
```

### Environment Variables

| Variable | Description | How to Get |
|----------|-------------|------------|
| `AZURE_MAPS_KEY` | Azure Maps subscription key | Azure Portal → Create Azure Maps Account → Keys |

> Navigate to [Azure Portal](https://portal.azure.com) → Create a resource → Search "Azure Maps" → Create → Copy Primary Key from the Authentication section.

---

## DevOps Workflow Overview

This project demonstrates a complete DevOps lifecycle using GitHub as the platform.

```mermaid
flowchart LR
    A[Plan] --> B[Code]
    B --> C[Build]
    C --> D[Test]
    D --> E[Release]
    E --> F[Deploy]
    F --> G[Monitor]
    G --> A
```

---

## GitHub Features Used

### 1. Issues — Planning & Tracking

Use **GitHub Issues** to track bugs, features, and tasks.

```mermaid
flowchart TD
    A[Create Issue] --> B{Type?}
    B -->|Bug| C[🐛 Bug Report]
    B -->|Feature| D[✨ Feature Request]
    B -->|Task| E[📋 Task]
    C --> F[Assign to Developer]
    D --> F
    E --> F
    F --> G[Link to Project Board]
    G --> H[Create Branch from Issue]
```

### 2. Projects — Kanban Board

Use **GitHub Projects** to visualize work in progress.

| Column | Purpose |
|--------|---------|
| 📋 Backlog | New issues waiting to be prioritized |
| 🏗️ In Progress | Currently being worked on |
| 👀 In Review | Pull request submitted, awaiting review |
| ✅ Done | Merged and deployed |

### 3. Branches — Feature Branch Workflow

```mermaid
gitGraph
    commit id: "initial"
    branch feature/add-weather
    checkout feature/add-weather
    commit id: "add weather API"
    commit id: "add unit tests"
    checkout main
    merge feature/add-weather id: "PR #1 merged"
    branch bugfix/fix-flags
    checkout bugfix/fix-flags
    commit id: "fix flag images"
    checkout main
    merge bugfix/fix-flags id: "PR #2 merged"
    commit id: "release v1.1"
```

### 4. Pull Requests — Code Review

Pull Requests are how code gets into `main`:

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub
    participant CI as CI Pipeline
    participant Rev as Reviewer

    Dev->>GH: Push feature branch
    Dev->>GH: Open Pull Request
    GH->>CI: Trigger CI workflow
    CI->>CI: Build → Test → Coverage
    CI->>GH: Report status ✅/❌
    GH->>Rev: Request review
    Rev->>GH: Approve PR
    GH->>GH: Merge to main
    GH->>CI: Trigger CD workflow
```

---

## CI/CD Pipeline Architecture

Our pipeline is split into **CI** (Continuous Integration) and **CD** (Continuous Deployment):

```mermaid
flowchart TD
    subgraph Trigger
        A[Push to main] --> B[main-workflow-github-action.yml]
        A2[Pull Request] --> B
    end

    subgraph CI[CI Pipeline - ci.yml]
        B --> C[🔨 Build & Compile]
        C --> D[🧪 Unit Test]
        D --> E[📊 Code Coverage]
    end

    subgraph CD[CD Pipeline - cd.yml]
        E --> F{Push to main?}
        F -->|Yes| G[📦 Package App]
        G --> H[🔑 Azure Login - Service Principal]
        H --> I[🚀 Deploy to App Service]
        F -->|No / PR| J[⏹️ Skip Deploy]
    end

    subgraph Azure[Azure Cloud]
        I --> K[Azure App Service]
        K --> L[Live Application]
    end
```

### Pipeline Jobs Breakdown

| Job | Workflow | Purpose |
|-----|----------|---------|
| **Build & Compile** | `ci.yml` | Install deps, verify the app loads correctly |
| **Unit Test** | `ci.yml` | Run Jest tests to catch regressions |
| **Code Coverage** | `ci.yml` | Measure test coverage, upload report |
| **Deploy** | `cd.yml` | Deploy to Azure App Service via Service Principal |

---

## GitHub Actions — Workflow Files

```
.github/workflows/
├── main-workflow-github-action.yml   ← Orchestrator (calls CI then CD)
├── ci.yml                            ← Build → Unit Test → Code Coverage
└── cd.yml                            ← Deploy to Azure App Service
```

### How It Works

```mermaid
flowchart LR
    subgraph main-workflow-github-action.yml
        direction TB
        M1[Trigger: push/PR to main]
    end

    subgraph ci.yml
        direction TB
        C1[Build] --> C2[Unit Test] --> C3[Coverage]
    end

    subgraph cd.yml
        direction TB
        D1[Download Artifact] --> D2[Azure Login] --> D3[Deploy]
    end

    M1 -->|calls| C1
    C3 -->|on success + push to main| D1
```

---

## Releases & Packages

### Creating a Release

After a successful deployment, create a **GitHub Release** to version your app:

```mermaid
flowchart TD
    A[Code merged to main] --> B[CI/CD passes ✅]
    B --> C[Create Git Tag]
    C --> D[Create GitHub Release]
    D --> E[Attach build artifacts]
    D --> F[Auto-generate release notes]
    E --> G[v1.0.0 Published 🎉]
    F --> G
```

**Steps:**
1. Go to **Releases** → **Draft a new release**
2. Create a new tag (e.g., `v1.0.0`)
3. Auto-generate release notes (GitHub summarizes PRs since last release)
4. Publish release

### GitHub Packages

You can publish your app as an npm package to **GitHub Packages** for reuse:
- Settings → Packages → Connect repository
- Add `publishConfig` to `package.json` pointing to GitHub registry

---

## Setting Up the Service Principal for Deployment

To deploy to Azure, you need a **Service Principal** — an identity that GitHub Actions uses to authenticate with Azure.

```mermaid
sequenceDiagram
    participant GH as GitHub Actions
    participant SP as Service Principal
    participant AZ as Azure

    GH->>SP: Use AZURE_CREDENTIALS secret
    SP->>AZ: Authenticate (Client ID + Secret)
    AZ->>SP: Access Token ✅
    SP->>GH: Authenticated
    GH->>AZ: Deploy to App Service
```

**Commands to set up:**

```bash
# 1. Create the Service Principal
az ad sp create-for-rbac --name "github-actions-sp" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP> \
  --sdk-auth

# 2. Copy the JSON output and add as GitHub Secret: AZURE_CREDENTIALS

# 3. Set app settings on Azure App Service
az webapp config appsettings set \
  --name <APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --settings AZURE_MAPS_KEY=<YOUR_KEY>
```

---

## GitHub Secrets Required

| Secret | Purpose |
|--------|---------|
| `AZURE_CREDENTIALS` | Service Principal JSON for Azure login |
| `AZURE_WEBAPP_NAME` | Target App Service name |
| `AZURE_MAPS_KEY` | Azure Maps API key (for tests & app config) |

Add these at: **Repository → Settings → Secrets and variables → Actions**

---

## Running Tests Locally

```bash
# Run tests with coverage
npm test

# Output:
# ✓ should return 200 and serve the HTML page
# ✓ should contain Hello World in the page
# ✓ should return weather data with valid coordinates
# Coverage: 87.5% statements
```

---

## Project Structure

```
├── .github/workflows/       # GitHub Actions CI/CD pipelines
│   ├── main-workflow-github-action.yml
│   ├── ci.yml
│   └── cd.yml
├── public/
│   └── index.html           # Frontend (Bootstrap + live clocks + weather)
├── index.js                 # Express server + Azure Maps weather proxy
├── index.test.js            # Jest unit tests
├── .env                     # Environment variables (not committed)
├── .gitignore               # Ignores node_modules, .env, coverage
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

---

## Learning Outcomes

By working with this project, you will understand:

- ✅ How to use **GitHub Issues** for planning work
- ✅ How to use **GitHub Projects** for tracking progress
- ✅ How to work with **branches** and **pull requests**
- ✅ How to set up **GitHub Actions** for CI/CD automation
- ✅ How to run **unit tests** and measure **code coverage**
- ✅ How to deploy to **Azure App Service** using a **Service Principal**
- ✅ How to manage **releases** and **packages**
- ✅ How to use **status badges** to communicate build health

# 📊 Evidence & Claim Ledger: Source of Truth (Sigit Adi Irianto)

Dokumen ini berfungsi sebagai **Master Repository of Facts, Claims, and Keywords** untuk menyusun seluruh varian CV (Master, Applied AI, SecOps) dan memastikan 100% konsistensi, transparansi, serta integritas teknis (*defensibility*) saat melalui penyaringan ATS maupun wawancara teknis (*deep-dive technical interview*).

---

## 🏛️ 1. Professional Identity & Seniority Framing

| Unsur Profil | Klaim Lama / Berisiko | Framing Baru (Defensible & High-Impact) | Rasional & Justifikasi |
| :--- | :--- | :--- | :--- |
| **Total Pengalaman** | *"24 years of enterprise operations"* | **"24+ years in IT, systems infrastructure, and technology delivery with recent specialization in Applied AI and SecOps"** | Pengalaman 2002–2020 adalah fondasi IT Ops/Network/Sysadmin. Pengalaman ini adalah aset reliabilitas sistem, bukan sekadar *career switcher*. |
| **Headline Master** | `IT & SecOps Specialist · Applied AI Engineer` | `Applied AI Engineer · SecOps & IT Infrastructure Specialist` *(Master)* | Menegaskan bahwa pondasi utamanya adalah IT Infrastructure yang telah berevolusi ke SecOps dan AI. |
| **Headline Target AI** | `Applied AI Engineer` (ambigu) | `Applied AI Engineer \| LLM \| AI Automation` | Mengklarifikasi domain praktis: membangun aplikasi LLM, evaluasi prompt/schema, dan otomasi workflow. |
| **Headline Target SecOps** | `SecOps Specialist` (ambigu) | `SecOps Specialist \| SIEM \| Threat Monitoring \| Incident Response` | Mengklarifikasi domain teknis: triage Wazuh, response playbook, WAF, dan threat monitoring. |

---

## 📈 2. Claim & Metric Ledger (Audit & Defense Matrix)

Semua metrik kuantitatif dan klaim teknis diklasifikasikan berdasarkan tingkat pembuktian empiris (*Evidence Level*):

| # | Klaim / Metrik | Klasifikasi Sumber | Evidence Lingkungan | Relevansi AI | Relevansi SecOps | Formula Redaksi Aman (*Safe Wording*) |
| :- | :--- | :--- | :--- | :---: | :---: | :--- |
| **C-01** | **MTTR −45%** | Benchmark / Sim. Lab | Simulated SOC Environment (SCOPS + Wazuh) | ★☆☆ | ★★★ | *"Reduced simulated SOC triage MTTR by 45% through automated Tier-1 response playbooks and structured priority queues."* |
| **C-02** | **MTTA −55%** | Project Operasional | SOC Analyst (PT. Prospera / Ops) | ★☆☆ | ★★★ | *"Reduced Mean Time to Acknowledge (MTTA) by 55% across 500+ daily alerts by standardizing alert triage workflows."* |
| **C-03** | **500+ alerts/day** | Operasional Riil | Wazuh SIEM & FortiWeb WAF Monitoring | ☆☆☆ | ★★★ | *"Monitored and triaged 500+ daily security alerts from Wazuh SIEM and FortiWeb WAF, escalating confirmed incidents per SOP incident playbooks."* |
| **C-04** | **1,000+ Prompt Pairs** | Freelance / Project | Outlier.ai / AI Training & Evaluation | ★★★ | ☆☆☆ | *"Evaluated and optimized 1,000+ prompt-response pairs for factuality, instruction following, safety, and output consistency."* |
| **C-05** | **30% Log Review Time** | Kontrak Pemerintah | Web Administrator (Ministry of Environment) | ★☆☆ | ★★☆ | *"Decreased weekly manual log review overhead by 30% by containerizing environments on Linux Server/WSL and standardizing Wazuh agents."* |
| **C-06** | **Status Proyek Live** | Personal / Public | 4 Live Public Web Deployments | ★★★ | ★★★ | *"Engineered and deployed 4 live, publicly accessible technical applications with zero-backend or containerized architectures."* |
| **C-07** | **Client-Side Privacy** | Arsitektur Teknis | SmartExpenseML (Browser-only execution) | ★★☆ | ★☆☆ | *"Implemented 100% client-side text classification and Indonesian currency parsing without external server dependencies."* |
| **C-08** | **Pola Kontrak Kemendagri** | Kontrak Pengadaan | Proyek Pemerintah Berbasis Siklus Tender | ★★☆ | ★★☆ | *"Delivered technical milestones across fixed-term government IT modernization contracts (Senior Programmer & Incident Handling)."* |
| **C-09** | **50+ Endpoints & 99%+ Uptime** | Operasional IT Lead | ACE Ltd. & PT. Dipta Safari Jaya | ★★☆ | ★★★ | *"Maintained 99%+ operational availability across 50+ workstations and server fleet with zero data-loss incidents."* |
| **C-10** | **40% Manual Time Cut** | Otomasi Internal | Reporting Automation (SQL Scripts & REST APIs) | ★★★ | ★★☆ | *"Automated recurring operational reporting workflows, reducing weekly manual data entry overhead by up to 40%."* |
| **C-11** | **1,000+ IT Tickets** | Fondasi Karir (12 Yrs) | PT. Laju Karunia Jaya · Arya Mobile | ★☆☆ | ★★★ | *"Resolved 1,000+ hardware, OS, and network troubleshooting tickets over a 12-year foundational IT support tenure."* |

---

## 🧩 3. Keyword Architecture & Taxonomy

### Track A: Applied AI Engineer & AI Automation
```
├── Core Concepts: LLM Application Development, Prompt Engineering, Prompt Stability Testing,
│                  LLM Evaluation, Output Consistency, Structured Output Validation,
│                  Client-Side NLP, Privacy-First Architecture, Text Classification Engine
├── Frameworks & APIs: Gemini API, LangChain, Ollama (Local LLM Inference), Next.js, TypeScript, Python, Streamlit
├── Automation & Web: n8n Workflows, REST APIs, Web Development, Git & GitHub
└── Evaluation Metrics: Instruction-Following Adherence, Factuality, Safety, Prompt Drift Detection
```

### Track B: SecOps, SOC & Cybersecurity
```
├── Core Concepts: SOC Tier-1 Triage, Incident Triage, Threat Hunting, Alert Prioritization,
│                  Log Ingestion, SOP Incident Playbooks, Vulnerability Assessment, Server Hardening
├── Systems & Infrastructure: Linux Server, Windows Server, Docker, WSL, Systems Administration,
│                             Local Network (LAN/WAN), Backup & Recovery, Database SQL
├── Tools & Technologies: Wazuh SIEM, FortiWeb WAF, DVWA Sandboxing, Docker, Linux Server,
│                         Streamlit Security Dashboards, REST APIs, Python, Git & GitHub
└── Metrics & KPIs: MTTA (Mean Time to Acknowledge), Simulated MTTR, False Positive Reduction, Daily Alert Throughput
```

---

## 🚀 4. Flagship Projects Deep-Dive

### Project 1: SCOPS (Security Operations Command & Orchestration Platform)
*   **Target Domain**: SecOps / SOC Automation (Tier 1 Flagship)
*   **Problem Statement**: Analis Tier-1 SOC sering mengalami *alert fatigue* akibat 500+ log mentah per hari yang tidak terklasifikasi secara otomatis.
*   **Architecture**: Wazuh Agent/Manager Telemetry $\rightarrow$ REST API Ingestion $\rightarrow$ Python/Streamlit Risk Engine $\rightarrow$ Priority Triage Queue $\rightarrow$ Automated Response Playbook.
*   **Validated Impact**: Memangkas waktu *simulated MTTR* hingga 45% dalam lingkungan pengujian serangan terkontrol.
*   **Deployment Status**: Live Deployment (Web Demo + Open Source Repository).

### Project 2: A.R.Y.A. (Automated Telemetry & SOC Analytics Pipeline)
*   **Target Domain**: SecOps / Data Pipelines (Tier 2 Supporting)
*   **Problem Statement**: Format log multi-sumber (JSON, XML, CSV) memperlambat korelasi ancaman manual.
*   **Architecture**: Multi-format Data Ingestion Pipeline $\rightarrow$ Normalization Layer $\rightarrow$ Interactive Threat Hunting Dashboard.
*   **Stack**: Python, Streamlit, Pandas, REST APIs.
*   **Deployment Status**: Live Deployment.

### Project 3: PromptMatrix 2.0 (LLM Prompt Stability & Evaluation Suite)
*   **Target Domain**: Applied AI / LLM Engineering (Tier 1 Flagship)
*   **Problem Statement**: Pipeline AI rentan terhadap kegagalan output format (*JSON schema breakage*) dan variasi jawaban antar model.
*   **Architecture**: User Prompt Input $\rightarrow$ Systematic Variant Generation $\rightarrow$ Multi-Model LLM Execution (Gemini API) $\rightarrow$ Output Consistency & Stability Testing $\rightarrow$ Strict Schema & JSON Adherence Check.
*   **Stack**: Next.js, TypeScript, LangChain, Google Gemini API, Tailwind CSS.
*   **Security Model**: Client-Side Privacy — Kunci API hanya berada di memori lokal browser.
*   **Deployment Status**: Live Deployment.

### Project 4: SmartExpenseML (Client-Side NLP Expense Classifier)
*   **Target Domain**: Applied AI / Privacy Engineering (Tier 2 Supporting)
*   **Problem Statement**: Pengguna enggan mengunggah catatan keuangan pribadi ke server cloud pihak ketiga.
*   **Architecture**: Browser-only Text Classification Engine + Indonesian Informal Currency Regex Parser (`25rb`, `5.5jt`).
*   **Stack**: Vanilla JavaScript, HTML5 LocalStorage, Zero Backend / Zero Tracking.
*   **Deployment Status**: Live Deployment.

---

## 📜 5. Certification Tiering & Mapping

| Sertifikasi | Penerbit | Tahun | AI Track | SecOps Track | Status Master |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Microsoft Certified: Azure AI Fundamentals (AI-900)** | Microsoft | 2025 | ★★★ | ★☆☆ | Active |
| **Certified SOC Analyst (CSA) / Triage Specialist** | Industry / Cyber Acad | 2024 | ★☆☆ | ★★★ | Active |
| **BSSN Cybersecurity Exercise / Incident Handling** | BSSN Indonesia | 2024 | ☆☆☆ | ★★★ | Active |
| **LLM Application & Prompt Engineering with Gemini** | Hacktiv8 | 2025 | ★★★ | ★☆☆ | Active |
| **Advanced Workflow Automation with n8n** | n8n Academy | 2025 | ★★★ | ★★☆ | Active |
| **Certified Penetration Testing Specialist** | Cybrary | 2024 | ☆☆☆ | ★★☆ | Active |
| **Certified DevSecOps Practitioner** | DevOps Institute / Acad | 2024 | ★★☆ | ★★★ | Active |
| **Enterprise Ubuntu Administration & Security** | Canonical Academy | 2024 | ★★☆ | ★★★ | Active |
| **Certified Ethical Hacker (Foundation)** | EC-Council Associate | 2024 | ☆☆☆ | ★★☆ | Active |

---

## 🏢 6. Career Chronology Mapping (Grouping & Context)

| Periode | Entitas / Lembaga | Jabatan Resmi | Konteks & Justifikasi Durasi Singkat |
| :--- | :--- | :--- | :--- |
| **Mar 2026 – Now** | Ministry of Environment | Web Administrator | *Fixed-term government IT modernization contract.* Fokus pada Docker, Linux Server/WSL, hardening & Wazuh. |
| **Jun 2024 – Now** | Outlier.ai / Tech Platforms | AI Trainer & LLM Evaluator *(Concurrent)* | *Continuous remote project.* Evaluasi factuality, safety, instruction-following & prompt stability. |
| **Okt 2025 – Des 2025** | Ministry of Home Affairs | Senior Programmer | *3-month fixed-term procurement contract.* Backend transaction platform & API integration. |
| **Jan 2025 – Sep 2025** | PT. Prospera Global Solusi | SOC Analyst (Part-Time) | *Operational security engagement.* 500+ daily alerts, Wazuh SIEM, FortiWeb WAF, MTTA −55%. |
| **Okt 2024 – Des 2024** | Ministry of Home Affairs | Incident Handling Operational | *3-month critical infrastructure audit & triage project.* SOP incident playbooks & security baseline reviews. |
| **2021 – 2023** | PT. Bintang Abadi Express | IT & Operations Manager | End-to-end logistics infrastructure, 50+ staff, ERP uptime, network infrastructure. |
| **2002 – 2020** | Various Enterprises | Project Office Manager, IT Support & Sysadmin | 18+ tahun fondasi sistem, jaringan LAN/WAN, hardware troubleshooting, dan manajemen operasional. |

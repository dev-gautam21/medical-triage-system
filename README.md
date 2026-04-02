# 🏥 AI-Assisted Medical Triage & Case Summarization System

An AI-powered healthcare support system that evaluates basic patient symptoms (Fever, Cold, Cough) and classifies urgency levels while generating structured case summaries for doctors.

> ⚠️ **Disclaimer:** This system is NOT a diagnosis tool and does NOT provide medical advice. It is designed only for triage assistance.

---

## 🚀 Live Demo

🔗 *https://medical-triage-system.vercel.app/*

---

## 📌 Problem Statement

In many situations, patients struggle to decide:

* Whether their condition is serious
* Whether immediate medical attention is required

This project aims to:
👉 Assist in **early triage decision-making**
👉 Help doctors with **structured case summaries**

---

## 🚧 Project Scope (Phase 1)

This project is currently in its **initial development stage (Phase 1)**.

To ensure accuracy, reliability, and controlled testing, the system currently focuses only on:

* Fever
* Cold
* Cough

This scope limitation allows the model to:

* Maintain better prediction quality
* Avoid over-generalization
* Ensure safe and ethical behavior

---

## 🔮 Scalability & Future Expansion

The system is designed to be **scalable and extensible**.

In future versions, we aim to:

* Support a wider range of diseases
* Expand symptom coverage
* Improve ML model accuracy with larger datasets
* Integrate real-time healthcare systems

👉 This phased approach ensures a balance between **accuracy, safety, and scalability**.

---

## 🎯 Features

### 👤 Patient Interface

* Step-by-step dynamic question flow (wizard style)
* Symptom-based path:

  * Fever
  * Cold
  * Cough
* One question per screen
* Progress bar
* Form validation
* Mobile responsive design

---

### 🚦 AI-Based Triage System

* 🟢 **Green** → Routine

* 🟡 **Yellow** → Doctor Required

* 🔴 **Red** → Emergency

* Rule-based + ML-assisted logic

* Real-time urgency classification

---

### 📝 Case Summary Generation

Structured output:

* Patient Age
* Primary Symptom
* Associated Symptoms
* Duration
* Key Answers
* Existing Conditions
* Urgency Level
* Red Flags Identified

---

### 👨‍⚕️ Doctor View Dashboard

* Card-based UI
* Displays patient details clearly
* Highlights **red flags**
* Print-friendly format

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS

### Backend

* Node.js
* Express.js

### Machine Learning

* Python
* Scikit-learn
* Pandas

---

## 🧠 System Architecture

```
User (Frontend)
     ↓
React UI (Question Flow)
     ↓
Node.js Backend (API + Logic)
     ↓
ML Model (Prediction + Triage)
     ↓
Response (Urgency + Summary)
     ↓
Frontend Display (Result + Doctor View)
```

---

## ⚙️ How It Works

1. User selects a symptom (Fever / Cold / Cough)
2. Dynamic questions are generated
3. User responses are sent to backend API
4. Backend:

   * Applies rule-based logic
   * Uses ML model for assistance
5. System returns:

   * Urgency Level
   * Structured Case Summary
6. Frontend displays results clearly

---

## 📂 Project Structure

```
medical-triage-system/
│── backend/        # Node.js API & logic
│── frontend/       # React UI
│── ml/             # ML model & scripts
│── README.md
```

---

## 🧪 Run Locally

### Clone Repository

```
git clone https://github.com/dev-gautam21/medical-triage-system.git
cd medical-triage-system
```

---

### Run Backend

```
cd backend
npm install
node index.js
```

---

### Run Frontend

```
cd frontend
npm install
npm start
```

---

### Run ML Service (if required)

```
cd ml
python predict_api.py
```

---

## ⚠️ Ethical Considerations

* ❌ No diagnosis is provided
* ❌ No medication advice
* ❌ Not a replacement for a doctor

✔ Designed only for:

* Triage assistance
* Awareness
* Structured case reporting

---

## 🔮 Future Improvements

* Cloud deployment of ML model
* Multi-language support
* Authentication system
* Real-time doctor integration
* Improved dataset & accuracy

---

## 👨‍💻 Author

**Gautam Sharma**

---

## ⭐ If you found this useful, give it a star!

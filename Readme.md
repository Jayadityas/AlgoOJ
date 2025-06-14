# 🧑‍⚖️ THE OJ - Online Judge System

THE OJ is a full-stack **Online Judge system** that allows users to solve coding problems with real-time code evaluation. It features a powerful admin dashboard for managing problems, test cases, and submissions — all built with a modern tech stack, fully containerized using Docker, and deployed on **Vercel (frontend)** and **AWS (backend)**.

---

## 🌐 Live Demo

- 🔗 Frontend (Vercel): [https://theoj.vercel.app](https://theoj.vercel.app)
- 🔗 Backend (AWS): [https://api.theoj.online](https://api.theoj.online)

---

## 📸 Screenshots

| Home / Explore Problems | Problem Page |
|-------------------------|--------------|
| ![Home](https://github.com/user-attachments/assets/44fbded0-51da-44d7-a841-a3ca243f5cbb) | ![Problem](https://github.com/user-attachments/assets/e5b70dd5-0f4b-48d3-8972-06e73b5ef116) |

| Code Editor + Submission Panel | My Submissions |
|-------------------------------|----------------|
| ![Editor](https://github.com/user-attachments/assets/82927446-9fe2-4fbc-92df-162926e240c3) | ![Submissions](https://github.com/user-attachments/assets/f96ba6ea-9802-4724-ad6b-90d4faf003a8) |

| Admin - Create / Update Problem | Auth (Login / Signup) |
|-------------------------------|------------------------|
| ![Admin](https://github.com/user-attachments/assets/208441bb-1bbe-4c75-af16-0f2feba1f54d) | ![Auth](https://github.com/user-attachments/assets/bab9ce09-3eb8-4289-9003-1e4d808b845b) |

---

## ⚙️ Features

### 👨‍🎓 User Panel
- Browse and solve programming problems
- Submit code in an interactive editor (CodeMirror)
- View test case-wise feedback (passed/failed)
- Maintain a submission history

### 🛠️ Admin Panel
- Create and update problems
- Upload sample and hidden test cases (via file upload)
- Toggle problem visibility
- View all user submissions

### 🔐 Authentication
- Secure user login/signup with JWT
- Passwords hashed using `bcrypt`
- Protected admin routes

### ⚙️ Code Execution Engine
- Containerized code execution with Docker
- Secure sandbox for running user-submitted code
- Input/output validation and real-time feedback

---

## 🧰 Tech Stack

| Layer        | Technology                                      |
|--------------|-------------------------------------------------|
| Frontend     | React.js (Vite), Tailwind CSS, Monacco Editor   |
| Backend      | Node.js, Express.js                             |
| Database     | MongoDB (Mongoose)                              |
| Code Runner  | Docker                                          |
| Auth         | JWT + bcrypt                                    |
| File Uploads | Multer                                          |
| Deployment   | Vercel (Frontend), AWS EC2 (Backend)            |

---

## 🚀 Local Development Setup

### 🔧 Prerequisites

- Node.js & npm
- Docker & Docker Compose
- MongoDB (local or cloud)

### 📦 Backend Setup (Dockerized)

```bash
# In the project root
docker-compose up --build

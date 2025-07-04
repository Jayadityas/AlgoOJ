# 🧑‍⚖️ THE ALGO ONLINE JUDGE

AlgoOJ is a full-stack Online Judge (OJ) platform built from scratch that allows users to solve algorithmic problems, write code in multiple languages, run it against custom inputs, and submit to validate against hidden test cases.It is inspired by platforms like LeetCode, HackerRank, and Codeforces, but designed with a lightweight, modern UI and our own customizable problem bank.

## 🌐 Live Demo

- 🔗 Frontend (Vercel): [https://theoj.vercel.app](https://theoj.vercel.app)
- 🔗 Backend (AWS): [https://api.theoj.online](https://api.theoj.online)

## 📸 Screenshots

| Home / Explore Problems | Problem Page |
|-------------------------|--------------|
| ![Image](https://github.com/user-attachments/assets/b5a38579-179d-4034-a9ca-b802059da97e) | ![Image](https://github.com/user-attachments/assets/71d9d61e-458a-475b-bbbb-a1902b0608b9) |

| Code Editor + Submission Panel | Create Problems Panel |
|-------------------------------|----------------|
| ![Image](https://github.com/user-attachments/assets/6d37e88b-89cd-4b4e-ab1e-5b03c0ad5332) | ![Image](https://github.com/user-attachments/assets/da649ed1-eda3-47a6-8fbc-475ebdb9a19d) |

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

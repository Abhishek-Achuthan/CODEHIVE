# CodeHive 🐝  
> **Collaborate. Learn. Build.**  

CodeHive is a **next-generation collaborative coding platform** where developers and mentors can **code together, share knowledge, and run live sessions** — all in one place.  
It bridges the gap between **structured Q&A**, **real-time mentoring**, and **team collaboration tools**.  

---

## ✨ Why CodeHive?
- Traditional coding platforms only focus on *problems*, not *people*.  
- Mentoring and interviews lack structure & integrated tools.  
- Teams need **one place** to code, chat, call, whiteboard, and learn — without juggling 5 apps.  

**CodeHive is that place.** 🚀  

---

## 🔑 Core Vision (Planned Features)
- **Structured Q&A Module** → Ask, answer, vote, save questions.  
- **Realtime Collaboration** → Code editor, chat, whiteboard, screen share.  
- **Mentor Sessions** → Book, schedule, and join guided sessions.  
- **Push to GitHub** → Save session work directly to repos.  
- **Access Control** → Owner/Guest/Viewer roles, moderation tools.  

---

## 🛠 Tech Stack
- **Backend:** Node.js, TypeScript, Express  
- **Architecture:** Clean Architecture (Domain-Driven)  
- **Database:** MongoDB  
- **Validation:** Zod  
- **Dependency Injection:** tsyringe  
- **Realtime:** WebRTC, Socket.IO  

---

## 📂 Current Project Structure
```bash
backend/
│   app.ts
│
├── application/      # use cases & services
├── config/           # environment configs
├── core/             # error handling
├── domain/           # entities & interfaces
├── DTOs/             # data transfer objects
├── infrastructure/   # db, cache, external services
├── presentation/     # controllers & validators
└── shared/           # constants, utils
```

## ⚙️ Getting Started
1. Clone the repository  
   ```bash
   git clone https://github.com/Abhishek-Achuthan/CODEHIVE.git
   cd CODEHIVE/backend
2. Install dependencies
   ```bash
   npm install
4. Run in development mode
   ```bash
   npm run dev
6. Setup environment variables (coming soon)

### 📌 Roadmap

- Authentication (Register/Login)

- Q&A API (CRUD, voting, save lists)

- Session Scheduling & Management

- Realtime Code Collaboration

- Mentor Dashboard & User Dashboard

- Push to GitHub Integration

- Deployment & CI/CD

### 🤝 Contributing

CodeHive is currently in active solo development.
If you’re interested in collaboration, mentorship, or contributing ideas — feel free to open an issue.

### 📣 Status

🚧 Early Development Stage

- Authentication not implemented yet.

- Core backend setup & architecture complete.

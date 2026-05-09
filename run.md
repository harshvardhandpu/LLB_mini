# Manual Startup Commands

Run each of these commands in a **separate** PowerShell window from the project root (`D:\Inter\LLB_mini\legal-document-analyzer`):

### 1. MongoDB Database
```powershell
& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "D:\Inter\LLB_mini\.mongodb-data"
```

### 2. AI Service (Python)
*Uses the `.ai-venv` environment and redirects model downloads to your D: drive project folder.*
```powershell
$env:HF_HOME = "D:\Inter\LLB_mini\legal-document-analyzer\.huggingface-cache"
.\.ai-venv\Scripts\python.exe ai-service-python\app\main.py
```

### 3. Auth Service (Python)
*Uses its own `.venv` inside the auth-service-python folder.*
```powershell
.\auth-service-python\.venv\Scripts\python.exe auth-service-python\app.py
```

### 4. Spring Boot Backend (Java)
```powershell
java -jar backend-springboot\target\legal-document-analyzer-1.0.0.jar
```

### 5. React Frontend (Vite)
```powershell
cd frontend
npm run dev
```

---

### Troubleshooting
- **Compass Connection:** Use `mongodb://localhost:27017` to connect. Look for the `llb_mini` database.
- **Port Conflicts:** If a service fails to start, run `.\stop-all.ps1` first to clear any hanging processes.
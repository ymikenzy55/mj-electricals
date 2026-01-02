# Project Rules for Kiro

## CRITICAL RULES - ALWAYS FOLLOW

### 1. NO MARKDOWN DOCUMENTATION FILES
- **NEVER** create .md files for documentation, summaries, or guides
- Only exception: README.md if explicitly requested
- Communicate results verbally in chat instead

### 2. NO SECRETS IN CODE
- **NEVER** include real API keys, passwords, or credentials in any file
- Always use placeholders like `YOUR_API_KEY_HERE` or `<your-password>`
- Double-check before committing anything
- **NEVER** push .env file to GitHub (it's in .gitignore)
- Only push .env.example with placeholder values

### 3. GIT PUSH POLICY
- **ALWAYS ASK** before pushing to GitHub
- Show what will be pushed first
- Wait for explicit user approval
- Never auto-push without permission

### 4. FOCUS ON CODE ONLY
- Modify only backend/ and frontend/ folders
- No unnecessary documentation
- No summary files
- Just working code

### 5. MINIMAL COMMUNICATION
- Be concise
- No verbose explanations unless asked
- Show, don't tell
- Get straight to the point

### 6. DON'T BREAK EXISTING FUNCTIONALITY
- Before making changes, understand existing code
- Test changes don't break other features
- Only modify what's necessary
- Keep backward compatibility

## What TO Do
✅ Fix bugs in code
✅ Add features to backend/frontend
✅ Test and verify changes work
✅ Ask before major changes
✅ Keep responses short
✅ Use placeholders for secrets
✅ Check .gitignore before pushing

## What NOT To Do
❌ Create MD files
❌ Push secrets to GitHub
❌ Auto-push without asking
❌ Write long explanations
❌ Create documentation files
❌ Break existing functionality
❌ Push .env file

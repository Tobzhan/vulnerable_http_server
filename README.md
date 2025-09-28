# Security Analysis and Fixes – Small HTTP Server

This document describes **known security issues** that were intentionally present in the original version of this server and how they were **remediated** in the fixed version (`server_fixed.js`).

---

## 🔐 Vulnerabilities in the Original Server

### 1. **Hardcoded Secrets in Source Code**
- **Problem:** Sensitive values (e.g., `API_KEY = 'app_sec4'`) were hardcoded directly in the server code.
- **Impact:** If this code is ever committed or pushed to a repository (especially a public one), the secrets are exposed.
- **Risk:** Attackers can access APIs, impersonate users, or access databases using the leaked credentials.

---

### 2. **Secrets Loaded from a Committed File**
- **Problem:** The server loaded secrets from `config/secrets.json`, a file that could be mistakenly committed to Git.
- **Impact:** Secrets become part of version history, even if the file is later deleted.
- **Risk:** Attackers with access to the repo (or its history) can extract sensitive information.

---

### 3. **Internal Information Exposure via Error Messages**
- **Problem:** Errors were returned to clients with full stack traces and potentially sensitive internal details (like database passwords).
- **Example:**
  ```json
  {
    "error": "Intentional failure showing internal details: secret=FAKE_DB_PASSWORD",
    "stack": "Error at server.js:14:..."
  }

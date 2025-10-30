# 📦 Backup Directory

This directory contains manual or automated backups of files from the **cPanel FTP server**.

**Purpose:**

- To safely store mirrored copies of production files.
- Used mainly for recovery or local reference — not for deployment.

**Notes:**

- These files are **not part of the Astro build output**.
- They should **not be uploaded or committed** to production.
- The data here comes from `yathim.or.id` (via cPanel FTP sync).

---

🧠 _Tip:_ You can safely add this folder to `.gitignore` to avoid committing large backup files.

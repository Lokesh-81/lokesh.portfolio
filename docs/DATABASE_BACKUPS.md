# Production Database Backup & Recovery Strategy

This document establishes the official backup and disaster recovery policy for **Poosala Lokesh Portfolio & Developer Studio**.

---

## 1. Supabase PostgreSQL Architecture

### Automated Point-In-Time Recovery (PITR) & WAL Archiving
- **Frequency:** Continuous Write-Ahead Log (WAL) archiving with daily base snapshots.
- **Retention:** 7 to 30 days depending on project tier.
- **Provider Infrastructure:** Managed AWS/GCP underlying physical storage with cross-zone replication.

### Manual On-Demand Database Backup via CLI
To dump the PostgreSQL schema and all relational data:
```bash
# Set Supabase connection string
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xkkwfrwamvictgrhepgg.supabase.co:5432/postgres"

# Execute full backup with custom format
pg_dump "$DATABASE_URL" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --format=custom \
  --file="backup_$(date +%Y%m%d_%H%M%S).dump"
```

### Restoration Runbook
```bash
# Restore entire database from dump
pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --dbname="$DATABASE_URL" \
  "backup_20261024_000000.dump"
```

---

## 2. Google Cloud Firestore Database

- **Project ID:** `ai-studio-plokeshwebdevelo-7d0fb8cd-11b8-4271-9d91-3c0adaa4c5e2`
- **Database:** `(default)`

### Automated Daily Export Job (Google Cloud Scheduler + Cloud Run)
```bash
# Trigger an immediate on-demand export to Google Cloud Storage
gcloud firestore export gs://poosala-lokesh-firestore-backups/$(date +%Y-%m-%d) \
  --project="ai-studio-plokeshwebdevelo-7d0fb8cd-11b8-4271-9d91-3c0adaa4c5e2"
```

### Restoration Procedure
```bash
# Import collection data from a backup snapshot
gcloud firestore import gs://poosala-lokesh-firestore-backups/2026-10-24 \
  --project="ai-studio-plokeshwebdevelo-7d0fb8cd-11b8-4271-9d91-3c0adaa4c5e2"
```

---

## 3. Studio CMS One-Click Application State Snapshot

For instant portability without cloud console access:
1. Open the **Developer Studio CMS** (`/#studio`).
2. Navigate to **Settings** (`SettingsTab`).
3. Under **Data Backup & Export**, click **"Export Full Portfolio JSON Backup"**.
4. A full JSON snapshot containing all experiences, projects, skills, certificates, testimonials, and media records is downloaded directly to your local machine.
5. In case of emergency or local reset, use the snapshot to immediately restore all records.

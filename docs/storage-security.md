# 🔒 Storage Security & Download Token Architecture

## 1. Storage Bucket Isolation

Homies Studio segregates public visual assets from private digital deliverables:

| Bucket Name | Access Level | Contents | Delivery Method |
| :--- | :--- | :--- | :--- |
| `project-media` | **Public** | Cover banners, UI previews, gallery screenshots | Public CDN URLs |
| `project-deliverables` | **Private** | Source code ZIPs, thesis PDFs, PPTs, Verilog RTL files | Expiring Signed URLs (HMAC) |

---

## 2. Zero-Trust Secure Asset Download Protocol

```
Buyer clicks "Download Source Code"
                 │
                 ▼
Client calls POST /api/downloads/generate-signed-url
                 │
                 ▼
Server-Side Verification Pipeline:
  1. Authenticate user JWT
  2. Verify user has an order with status = 'PAID' for this project
  3. Verify download count < max_downloads (10)
  4. Verify token has not expired
                 │
                 ▼
Generate Supabase Storage Signed URL (60-second validity)
                 │
                 ▼
Increment download_count and record IP hash in public.downloads
                 │
                 ▼
Return single-use signed download link to client
```

# MIDEEYE — Security & Production Checklist

## 1. HTTPS & Transport Security

- [x] Strict-Transport-Security header set (`max-age=63072000; includeSubDomains; preload`)
- [ ] Domain added to HSTS preload list: https://hstspreload.org
- [x] All traffic served over HTTPS (enforced by Vercel)
- [x] HTTP → HTTPS redirect active (Vercel default)
- [x] TLS 1.2+ enforced (Vercel/Supabase default)

## 2. Security Headers (added in next.config.js)

- [x] `X-Frame-Options: SAMEORIGIN` — prevents clickjacking
- [x] `X-Content-Type-Options: nosniff`
- [x] `X-XSS-Protection: 1; mode=block`
- [x] `Referrer-Policy: strict-origin-when-cross-origin`
- [x] `Permissions-Policy` — disables camera, mic, geolocation
- [x] `Content-Security-Policy` — restricts script/style/connect sources
- [x] `Strict-Transport-Security` — HSTS 2 years

## 3. Authentication

- [x] Passwords hashed by Supabase Auth (bcrypt)
- [x] JWT tokens used for session management
- [x] Refresh tokens with rotation
- [ ] Email verification required before posting
- [ ] Rate limit auth endpoints (login: 5/min, signup: 3/min)
- [ ] Account lockout after 10 failed login attempts
- [ ] Secure password reset flow (expiring tokens)

## 4. Database Security (Supabase RLS)

- [x] Row Level Security enabled on all tables
- [x] No `anon` role write access to sensitive tables
- [x] `SECURITY DEFINER` functions used only where necessary
- [ ] Audit all RLS policies (run: `SELECT * FROM pg_policies;`)
- [ ] Confirm no tables have `USING (TRUE)` write policies unintentionally
- [ ] Database backups enabled (Supabase auto-backup)
- [ ] Point-in-time recovery enabled on production plan

## 5. Input Validation & Sanitization

- [ ] All user inputs validated server-side (not just client-side)
- [ ] Content length limits enforced (questions: 10,000 chars, answers: 20,000 chars)
- [ ] File upload: type whitelist (JPEG, PNG, WebP only), max size 5MB
- [ ] Image processing: strip EXIF data before storage
- [ ] No raw SQL queries — all via Supabase SDK (parameterized)
- [ ] Sanitize HTML if any rich text is rendered (`DOMPurify`)

## 6. API & Rate Limiting

- [ ] Implement rate limiting per IP for public endpoints
  - Recommended: Upstash Redis + `@upstash/ratelimit`
  - Or: Vercel Edge Middleware rate guard
- [ ] `ask` endpoint: max 10 questions per user per hour
- [ ] Vote endpoint: max 100 votes per user per hour
- [ ] Message endpoint: max 60 messages per user per minute
- [ ] Auth endpoints: 5 attempts per minute per IP
- [ ] Add `Retry-After` header on 429 responses

## 7. Secrets & Environment Variables

- [ ] No secrets committed to git (check with `git log -p | grep -i secret`)
- [ ] `.env.local` in `.gitignore`
- [ ] All production secrets in Vercel Environment Variables (encrypted at rest)
- [ ] Supabase service role key NEVER exposed to client
- [ ] Rotate all keys before public launch
- [ ] Use separate Supabase projects for dev / staging / production

## 8. Logging & Monitoring

- [ ] Error monitoring: **Sentry** (free tier sufficient for beta)
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```
- [ ] Uptime monitoring: **Better Uptime** or **UptimeRobot** (free)
- [ ] Performance monitoring: **Vercel Analytics** (built-in)
- [ ] Database query monitoring: Supabase Dashboard → Logs
- [ ] Set up alerts for:
  - Error rate spike > 5%
  - Response time > 3s (p95)
  - Uptime < 99.5%

## 9. Backup Strategy

| Data             | Backup Method                    | Frequency  | Retention                     |
| ---------------- | -------------------------------- | ---------- | ----------------------------- |
| Database         | Supabase auto-backup             | Daily      | 7 days (free) / 30 days (pro) |
| Storage (images) | Supabase Storage (geo-redundant) | Continuous | Permanent                     |
| Code             | GitHub                           | Every push | Permanent                     |
| Environment vars | Secure password manager          | On change  | Permanent                     |

- [ ] Test backup restore procedure before launch
- [ ] Store a manual DB dump in S3/Backblaze weekly

## 10. Content Security

- [ ] File upload scanned for malware (consider ClamAV or VirusTotal API)
- [ ] Image CDN with origin protection (Supabase Storage CDN enabled)
- [ ] User-generated links not auto-followed by server (no SSRF risk)
- [ ] Report & block system functional
- [ ] Account deletion wipes personal data within 30 days

## 11. Vercel Production Settings

- [ ] Custom domain configured and DNS propagated
- [ ] `www` and apex domain both pointing correctly
- [ ] Edge Network / CDN enabled (default on Vercel)
- [ ] Build output = `standalone` or default Next.js output
- [ ] Node.js version pinned (recommend 20.x)
- [ ] Preview deployments locked to team only (not public)

---

# 30-DAY LAUNCH ROADMAP

## Week 1 — Pre-Launch Hardening (Days 1–7)

| Day | Task                                                        |
| --- | ----------------------------------------------------------- |
| 1   | Audit all RLS policies; run penetration test checklist      |
| 1   | Set up Sentry error monitoring                              |
| 2   | Set up uptime monitoring (UptimeRobot)                      |
| 2   | Generate all app icons (72px → 1024px)                      |
| 3   | Create OG image (1200×630) for social previews              |
| 3   | Submit domain to HSTS preload list                          |
| 4   | Set up custom emails (support@, legal@, privacy@, appeals@) |
| 4   | Configure Resend/Postmark for transactional emails          |
| 5   | Implement rate limiting on auth + post endpoints            |
| 5   | Add email verification requirement                          |
| 6   | Run Lighthouse audit — target 90+ on all categories         |
| 6   | Test PWA install flow on iOS Safari + Android Chrome        |
| 7   | Full regression test of all core flows on mobile            |

## Week 2 — Beta Launch (Days 8–14)

| Day | Task                                                    |
| --- | ------------------------------------------------------- |
| 8   | Deploy to production; announce to private beta list     |
| 8   | Monitor Sentry, Vercel logs, Supabase logs in real time |
| 9   | Gather beta user feedback (use Tally.so free form)      |
| 10  | Fix critical bugs from beta feedback                    |
| 11  | Submit PWA to Google Play (TWA)                         |
| 12  | Submit iOS app to App Store TestFlight                  |
| 13  | First social media post (launch announcement)           |
| 14  | 1-week review: metrics, errors, feedback                |

## Week 3 — Growth & Polish (Days 15–21)

| Day | Task                                                           |
| --- | -------------------------------------------------------------- |
| 15  | Ship high-priority beta feedback fixes                         |
| 16  | Launch social media content plan (see APP_STORE_AND_LAUNCH.md) |
| 17  | Submit app for App Store review                                |
| 18  | Set up Google Search Console + submit sitemap                  |
| 18  | Set up Bing Webmaster Tools                                    |
| 19  | Begin email welcome sequence for new signups                   |
| 20  | Partner outreach: Somali content creators & communities        |
| 21  | Second week review: DAU/MAU, question volume, error rate       |

## Week 4 — Public Launch (Days 22–30)

| Day | Task                                                  |
| --- | ----------------------------------------------------- |
| 22  | Public launch announcement on all social platforms    |
| 23  | App goes live on App Store (if approved)              |
| 23  | App live on Google Play                               |
| 24  | Press outreach to Somali media outlets                |
| 25  | Community AMA: founders answer questions on MIDEEYE   |
| 26  | Monitor and respond to App Store / Play Store reviews |
| 27  | Run performance audit #2 — optimize bottlenecks       |
| 28  | Celebrate first 1,000 users (community post)          |
| 29  | Implement most-requested feature from beta            |
| 30  | Month 1 retrospective + Month 2 roadmap planning      |

---

## KEY METRICS TO TRACK FROM DAY 1

| Metric                 | Tool               | Target (Month 1)          |
| ---------------------- | ------------------ | ------------------------- |
| Daily Active Users     | Vercel Analytics   | 100+                      |
| Questions posted       | Supabase dashboard | 500+                      |
| Answers posted         | Supabase dashboard | 1,500+                    |
| Signup conversion rate | Custom event       | >40% of homepage visitors |
| Day-7 retention        | Custom query       | >20%                      |
| Error rate             | Sentry             | <1% of requests           |
| p95 response time      | Vercel             | <800ms                    |
| PWA installs           | SW analytics       | 50+                       |
| App Store rating       | App Store Connect  | ≥4.5                      |

---

## GOOGLE SEARCH CONSOLE SETUP

1. Go to https://search.google.com/search-console
2. Add property → Domain type → enter `mideeye.com`
3. Verify via DNS TXT record (add in your DNS provider)
4. Submit sitemap: `https://mideeye.com/sitemap.xml`
5. Request indexing for homepage URL
6. Monitor: Coverage → URL Inspection → Core Web Vitals

## BING WEBMASTER TOOLS SETUP

1. Go to https://www.bing.com/webmasters
2. Add site → Auto-import from Google Search Console (easiest)
   OR manually add `https://mideeye.com`
3. Verify via XML file or DNS TXT record
4. Submit sitemap: `https://mideeye.com/sitemap.xml`

## DEEP LINKING (Universal Links / App Links)

### iOS Universal Links

Create `public/.well-known/apple-app-site-association`:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID.com.mideeye.app",
        "paths": ["*"]
      }
    ]
  }
}
```

### Android App Links

Create `public/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.mideeye.app",
      "sha256_cert_fingerprints": ["YOUR_SIGNING_CERT_SHA256"]
    }
  }
]
```

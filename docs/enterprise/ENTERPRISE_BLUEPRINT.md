# MIDEEYE Enterprise Upgrade Blueprint

This document defines the architecture and operating model for evolving MIDEEYE to enterprise-grade quality for a 10M user trajectory.

## 1) Architecture Explanation

### Layered architecture mandate
- `domain`: core business entities, value objects, policies, and repository contracts.
- `application`: use-cases and orchestration logic.
- `infrastructure`: concrete adapters (Supabase now, Django REST later).
- `interface`: transport and UI contracts (web, API DTOs, handlers).

### Rules of engagement
- UI components must not contain business logic.
- Application layer calls domain contracts; domain never imports infra.
- Infrastructure implements domain interfaces only.
- Supabase access remains in infrastructure.
- Cross-cutting concerns (logging, feature flags, analytics) accessed through adapters.

### Dependency direction
`interface -> application -> domain <- infrastructure`

### Why this works for Django migration
- Replace infra adapters with Django REST adapter implementations.
- Keep domain entities and application use-cases unchanged.
- Interface layer swaps data source bindings, not business behavior.

---

## 2) Refactored Folder Structure

```text
/domain
  /posts
    /entities
      Post.ts
    /repositories
      PostRepository.ts

/application
  /posts
    /use-cases
      CreatePostUseCase.ts

/infrastructure
  /supabase
    /posts
      SupabasePostRepository.ts

/interface
  /http
    /dto
      CreatePostRequest.ts

/docs
  /enterprise
    ENTERPRISE_BLUEPRINT.md
    DATABASE_REDESIGN.sql
    RLS_SECURITY_POLICIES.sql
```

### Existing code migration path
- Current `services/*` become temporary adapters.
- New flows should be built with use-cases first.
- Existing pages should progressively switch to application use-cases.

---

## 3) Database Schema Redesign

### Core design decisions
- Keep `questions` table for backward compatibility; treat it as post storage until rename migration.
- Add audit and moderation metadata (`created_by`, `updated_by`, `visibility`, `deleted_at`).
- Add denormalized feed cache table for ranking and read performance.
- Add moderation reports/actions tables for governance workflows.
- Add rate limit event table for anti-spam and abuse controls.

### Indexing strategy highlights
- Composite feed indexes by `(visibility, category, score_hot|score_trending, created_at DESC)`.
- Author timeline index `(user_id, created_at DESC)`.
- Moderation triage index `(status, created_at DESC)`.
- Vote lookup uniqueness and time-based retrieval indexes.

### Vote aggregation strategy
- Store votes as source-of-truth in `votes`.
- Maintain `feed_cache.vote_count` asynchronously or transactionally.
- Ranking scores (`score_hot`, `score_trending`) computed from counters + time decay.

### N+1 prevention strategy
- Use pre-joined read view (`v_posts_with_author`) for feed API.
- Read from feed cache + profile join in one query path.

### Feed materialization
- `feed_cache` stores the exact columns needed for feed rendering/sorting.
- Update cache on new posts, votes, comments, moderation changes.

### Trending algorithm
- Hot score: $(votes+1) / (hours+2)^{1.5}$
- Trending score: weighted engagement with recency decay.

See full SQL in:
- `docs/enterprise/DATABASE_REDESIGN.sql`

---

## 4) Security Policies

### Baseline controls
- Strict RLS on profiles, posts, votes, moderation tables.
- Role-based moderation privileges (`member`, `moderator`, `admin`).
- Owner-or-moderator update semantics for content moderation.

### Input and content safety
- Add `zod` validation layer at interface entry points.
- Store plain text and sanitized markdown HTML only.
- Apply upload restrictions by MIME, size, and bucket policy.

### Anti-abuse and trust signals
- Rate-limit event table for action windows.
- Suspicious activity flags (high-frequency posts/reports).
- Moderation queue with triage statuses.

### CSRF
- Browser-session flows via Supabase session tokens; for future Django endpoints, enforce CSRF and SameSite protections for cookie-based auth.

See policy SQL in:
- `docs/enterprise/RLS_SECURITY_POLICIES.sql`

---

## 5) Performance Strategy

### Frontend performance
- Keep app-router SSR for feed entry points where SEO and first render matter.
- Dynamic imports for heavy components (rich editor, media preview, analytics widgets).
- Use optimized image strategy for all post thumbnails/hero images.

### Data fetching
- Introduce SWR/React Query at interface layer with stale-while-revalidate.
- Cache feed pages by key `(sort, category, cursor)`.
- Optimistic voting and posting states with rollback safeguards.

### Interaction performance
- Debounced search/filter updates.
- Virtualization for very long feeds (phase 2).
- Skeletons for all async views and route transitions.

### Infra/perf envelope targets
- Sub-2s initial load median on average mobile network.
- Keep feed API response under 300ms p95 with cache.
- Keep post creation path under 500ms p95 excluding media upload.

---

## 6) Code Examples Per Layer

### Domain
- `domain/posts/entities/Post.ts`
- `domain/posts/repositories/PostRepository.ts`

### Application
- `application/posts/use-cases/CreatePostUseCase.ts`

### Infrastructure
- `infrastructure/supabase/posts/SupabasePostRepository.ts`

### Interface
- `interface/http/dto/CreatePostRequest.ts`

These examples demonstrate strict boundaries and replacement-ready adapters.

---

## 7) Documentation

### Data flow explanation
1. Interface receives request DTO.
2. Interface validates payload and calls application use-case.
3. Use-case enforces business rules and calls repository contract.
4. Infrastructure adapter executes persistence/query operations.
5. DTO response returned to interface/UI.

### Django migration strategy
- Phase A: keep domain/application untouched.
- Phase B: replace `SupabasePostRepository` with `DjangoPostRepository`.
- Phase C: switch authentication adapter and policy enforcement to Django middleware/services.
- Phase D: deprecate Supabase-specific infra and run parity checks.

### Scale roadmap
- **1K users**: single DB, basic cache, manual moderation.
- **100K users**: feed cache materialization, queue workers, observability baseline.
- **1M users**: read replicas, CDN image strategy, moderation tooling maturity, feature flags.
- **10M users**: sharded workloads or service split, dedicated search index, queue-heavy event processing, full SRE monitoring and incident playbooks.

### Design system 2.0 governance
- Tokenized spacing/type/elevation/motion scales.
- Component acceptance checklist (a11y, keyboard nav, contrast).
- Reduced-motion compliance and semantic HTML enforcement.

### Accessibility (WCAG) baseline checklist
- Semantic landmarks per page.
- Keyboard focus states and tab order.
- ARIA labels for all icon-only actions.
- Contrast checks in CI.
- Screen reader verification for form and feed flows.

---

## Implementation next steps (execution order)
1. Move post creation flow to `CreatePostUseCase` + `PostRepository`.
2. Add zod validation in interface layer.
3. Add `feed_cache` and ranking jobs/functions.
4. Migrate question feed reads to `v_posts_with_author`/cache.
5. Add moderation report flow and admin triage screen shell.
6. Add structured logger and error boundary integration.
7. Add feature flag adapter and analytics abstraction.

This is the enforceable engineering baseline for enterprise-grade delivery.

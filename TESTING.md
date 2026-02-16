# Testing Guide

This project currently relies on lint/build checks and manual QA. There is no dedicated unit or e2e test framework installed yet.

## Quick Checks

```bash
npm run lint
npm run build
```

- `npm run lint` validates ESLint rules and common issues.
- `npm run build` surfaces TypeScript errors and Next.js build problems.

## Manual QA Checklist

### Authentication

- Sign up with a new user.
- Log in with an existing user.
- Protected routes (e.g., dashboard) redirect to login when logged out.
- Log out and confirm session clears.

### Ask / Post Creation

- Create a question, discussion, media post, and link post.
- Confirm image upload shows preview and saved post displays media.
- Confirm link posts require a link and render correctly.
- Verify category selection and tags display in preview.

### Feed / Sorting

- Check sorting switches (Hot, New, Top) update results.
- Verify pagination or infinite scroll behavior if present.
- Confirm vote counts render and update after voting.

### Post Detail / Comments

- Open a post and verify content, media, and link rendering.
- Add a top-level comment and a reply.
- Collapse and expand threaded comments.
- Verify per-comment voting works.

### Communities / Topics

- Join and leave a community.
- Confirm community feed loads and sorting works.

### Profile

- Open profile page and confirm stats render.
- Verify reputation and activity list load correctly.

### Error States

- Test offline or invalid Supabase credentials and confirm error banners.
- Try submitting forms with missing required fields.

## Suggested Future Automation (Optional)

If you want automated tests later:

- Unit tests: add Jest + React Testing Library.
- E2E tests: add Playwright.
- API tests: run against Supabase or mock service layer.

## Reporting Issues

When filing a bug, include:

- Page or flow (URL)
- Steps to reproduce
- Expected vs actual results
- Console errors (if any)
- Screenshot or recording (if visual)

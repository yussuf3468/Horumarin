# Horumarin API Specification

This document defines the API contract that must be maintained when migrating from Supabase to Django REST Framework.

**Version:** 1.0.0  
**Last Updated:** February 2026

---

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** `https://api.horumarin.com`

---

## Authentication

All authenticated endpoints require a bearer token:

```
Authorization: Bearer <access_token>
```

### Supabase (Current)

- Uses Supabase Auth with JWT tokens
- Tokens stored in localStorage
- Auto-refresh handled by Supabase SDK

### Django (Future)

- Use Django REST Framework SimpleJWT
- Same JWT structure for compatibility
- Refresh token endpoint: `POST /api/auth/refresh`

---

## API Endpoints

### Authentication

#### POST /api/auth/signup

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "access": "jwt_token",
  "refresh": "refresh_token"
}
```

**Service Method:** `authService.signUp()`

---

#### POST /api/auth/login

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "access": "jwt_token",
  "refresh": "refresh_token"
}
```

**Service Method:** `authService.login()`

---

#### POST /api/auth/logout

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true
}
```

**Service Method:** `authService.logout()`

---

#### GET /api/auth/me

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Service Method:** `authService.getCurrentUser()`

---

### Users

#### GET /api/users/:id

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "avatarUrl": "https://...",
  "bio": "Lorem ipsum...",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Service Method:** `userService.getUserProfile()`

---

#### PUT /api/users/:id

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "fullName": "John Updated",
  "bio": "New bio...",
  "avatarUrl": "https://..."
}
```

**Response:**

```json
{
  "success": true
}
```

**Service Method:** `userService.updateUserProfile()`

---

#### GET /api/users/:id/stats

**Response:**

```json
{
  "questionsAsked": 10,
  "answersGiven": 25,
  "totalVotes": 150
}
```

**Service Method:** `userService.getUserStats()`

---

### Questions

#### GET /api/questions

**Query Parameters:**

- `category` (optional): Filter by category
- `user` (optional): Filter by user ID
- `search` (optional): Search query
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 20)

**Response:**

```json
{
  "results": [
    {
      "id": "uuid",
      "title": "How to...",
      "content": "I want to know...",
      "category": "tech",
      "viewCount": 100,
      "isAnswered": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "author": {
        "id": "uuid",
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "answerCount": 5,
      "voteSum": 10
    }
  ],
  "count": 100,
  "next": "/api/questions?page=2",
  "previous": null
}
```

**Service Method:** `questionService.getQuestions()`

---

#### POST /api/questions

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "title": "How to learn Django?",
  "content": "I'm new to Django and want to...",
  "category": "tech"
}
```

**Response:**

```json
{
  "id": "uuid",
  "title": "How to learn Django?",
  "content": "I'm new to Django and want to...",
  "category": "tech",
  "viewCount": 0,
  "isAnswered": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "userId": "uuid"
}
```

**Service Method:** `questionService.createQuestion()`

---

#### GET /api/questions/:id

**Response:**

```json
{
  "id": "uuid",
  "title": "How to...",
  "content": "I want to know...",
  "category": "tech",
  "viewCount": 100,
  "isAnswered": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "author": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com"
  },
  "answerCount": 5,
  "voteSum": 10
}
```

**Service Method:** `questionService.getQuestionById()`

---

#### PUT /api/questions/:id

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "title": "Updated title",
  "content": "Updated content",
  "category": "business"
}
```

**Response:**

```json
{
  "success": true
}
```

**Service Method:** `questionService.updateQuestion()`

---

#### DELETE /api/questions/:id

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**
``json
{
"success": true
}

````

**Service Method:** `questionService.deleteQuestion()`

---

### Answers

#### GET /api/questions/:questionId/answers

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "questionId": "uuid",
      "content": "Here's how you do it...",
      "isAccepted": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "author": {
        "id": "uuid",
        "fullName": "Jane Doe",
        "email": "jane@example.com"
      },
      "voteSum": 5
    }
  ]
}
````

**Service Method:** `answerService.getAnswersByQuestionId()`

---

#### POST /api/questions/:questionId/answers

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "content": "Here's the answer to your question..."
}
```

**Response:**

```json
{
  "id": "uuid",
  "questionId": "uuid",
  "userId": "uuid",
  "content": "Here's the answer...",
  "isAccepted": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Service Method:** `answerService.createAnswer()`

---

### Votes

#### POST /api/questions/:id/vote

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "value": 1 // 1 for upvote, -1 for downvote
}
```

**Response:**

```json
{
  "success": true,
  "voteSum": 11
}
```

**Service Method:** `voteService.castVote()`

---

#### POST /api/answers/:id/vote

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "value": 1
}
```

**Response:**

```json
{
  "success": true,
  "voteSum": 6
}
```

**Service Method:** `voteService.castVote()`

---

### Subscriptions

#### POST /api/subscriptions

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true
}
```

**Service Method:** `emailService.subscribeEmail()`

---

## WebSocket (Real-time)

### Questions Feed

**URL:** `ws://api.horumarin.com/ws/questions/`

**Messages:**

```json
{
  "event": "INSERT" | "UPDATE" | "DELETE",
  "payload": {
    "id": "uuid",
    "title": "...",
    ...
  }
}
```

**Service Method:** `realtimeService.subscribeToQuestions()`

---

### Answers Feed

**URL:** `ws://api.horumarin.com/ws/questions/:id/answers/`

**Messages:**

```json
{
  "event": "INSERT" | "UPDATE" | "DELETE",
  "payload": {
    "id": "uuid",
    "content": "...",
    ...
  }
}
```

**Service Method:** `realtimeService.subscribeToAnswers()`

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

### Common Error Codes

| Code             | Status | Description                       |
| ---------------- | ------ | --------------------------------- |
| UNAUTHORIZED     | 401    | Missing or invalid authentication |
| FORBIDDEN        | 403    | Insufficient permissions          |
| NOT_FOUND        | 404    | Resource not found                |
| VALIDATION_ERROR | 400    | Invalid request data              |
| SERVER_ERROR     | 500    | Internal server error             |

---

## Categories

Valid category values:

- `tech` - Tignoolajiyada (Technology)
- `business` - Ganacsiga (Business)
- `education` - Waxbarashada (Education)
- `health` - Caafimaadka (Health)
- `culture` - Dhaqanka (Culture)
- `general` - Guud (General)

---

## Rate Limiting

- **Authenticated:** 100 requests per minute
- **Anonymous:** 20 requests per minute

**Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Response:**

```json
{
  "results": [...],
  "count": 100,
  "next": "/api/questions?page=2",
  "previous": null
}
```

---

## Versioning

API version is included in the URL:

- Current: No version prefix (v1 implied)
- Future: `/api/v2/questions`

Breaking changes will require a new version.

---

## Migration Checklist

When implementing Django endpoints:

- [ ] Match exact request/response format
- [ ] Support same query parameters
- [ ] Return same error codes
- [ ] Maintain same rate limits
- [ ] Support same authentication
- [ ] Test with existing frontend code

---

## Testing

All endpoints should be tested with:

```bash
# Example with curl
curl -X POST https://api.horumarin.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

Or use the service layer directly:

```typescript
import { login } from "@/services/auth.service";

const { user, error } = await login({
  email: "test@example.com",
  password: "password",
});
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are UUIDs
- All text fields support Unicode (Somali characters)
- File uploads (avatars) use multipart/form-data
- Boolean values are lowercase `true`/`false`

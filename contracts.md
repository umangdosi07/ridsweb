# RIDS NGO Website - API Contracts

## Overview
This document outlines the API contracts for the RIDS NGO website backend.

## Authentication
- JWT-based authentication for admin users
- Token stored in localStorage as `admin_token`
- Protected routes require `Authorization: Bearer <token>` header

## API Endpoints

### Auth Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/register` | Create admin (protected) |
| GET | `/api/auth/me` | Get current user |

### Programs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programs` | List all programs |
| GET | `/api/programs/:id` | Get single program |
| POST | `/api/programs` | Create program (admin) |
| PUT | `/api/programs/:id` | Update program (admin) |
| DELETE | `/api/programs/:id` | Delete program (admin) |

### News/Blog
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news` | List all news articles |
| GET | `/api/news/:id` | Get single article |
| POST | `/api/news` | Create article (admin) |
| PUT | `/api/news/:id` | Update article (admin) |
| DELETE | `/api/news/:id` | Delete article (admin) |

### Impact Stories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stories` | List all stories |
| GET | `/api/stories/:id` | Get single story |
| POST | `/api/stories` | Create story (admin) |
| PUT | `/api/stories/:id` | Update story (admin) |
| DELETE | `/api/stories/:id` | Delete story (admin) |

### Gallery
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gallery` | List all images |
| POST | `/api/gallery` | Add image (admin) |
| DELETE | `/api/gallery/:id` | Delete image (admin) |

### Donations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donations` | List all donations (admin) |
| POST | `/api/donations` | Create donation record |
| GET | `/api/donations/stats` | Get donation stats (admin) |

### Contact Inquiries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inquiries` | List all inquiries (admin) |
| POST | `/api/inquiries` | Submit contact form |
| PUT | `/api/inquiries/:id` | Update status (admin) |
| DELETE | `/api/inquiries/:id` | Delete inquiry (admin) |

### Volunteer Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/volunteers` | List all applications (admin) |
| POST | `/api/volunteers` | Submit volunteer form |
| PUT | `/api/volunteers/:id` | Update status (admin) |
| DELETE | `/api/volunteers/:id` | Delete application (admin) |

### Newsletter
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/newsletter` | List subscribers (admin) |
| POST | `/api/newsletter` | Subscribe |
| DELETE | `/api/newsletter/:id` | Unsubscribe (admin) |

## Data Models

### Admin User
```json
{
  "id": "string",
  "email": "string",
  "password": "hashed",
  "name": "string",
  "role": "admin",
  "created_at": "datetime"
}
```

### Program
```json
{
  "id": "string",
  "title": "string",
  "category": "string",
  "description": "string",
  "image": "string (URL)",
  "beneficiaries": "number",
  "status": "active|inactive",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### News Article
```json
{
  "id": "string",
  "title": "string",
  "excerpt": "string",
  "content": "string",
  "category": "string",
  "image": "string (URL)",
  "date": "datetime",
  "status": "published|draft",
  "created_at": "datetime"
}
```

### Impact Story
```json
{
  "id": "string",
  "name": "string",
  "location": "string",
  "story": "string",
  "image": "string (URL)",
  "program": "string",
  "created_at": "datetime"
}
```

### Gallery Image
```json
{
  "id": "string",
  "url": "string",
  "title": "string",
  "category": "string",
  "created_at": "datetime"
}
```

### Donation
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "amount": "number",
  "type": "one-time|monthly",
  "pan": "string (optional)",
  "address": "string (optional)",
  "status": "pending|completed|failed",
  "payment_id": "string (from Razorpay)",
  "created_at": "datetime"
}
```

### Contact Inquiry
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "subject": "string",
  "message": "string",
  "status": "new|replied|closed",
  "created_at": "datetime"
}
```

### Volunteer Application
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "city": "string",
  "interest": "string",
  "availability": "string",
  "experience": "string",
  "message": "string",
  "status": "new|contacted|accepted|rejected",
  "created_at": "datetime"
}
```

### Newsletter Subscriber
```json
{
  "id": "string",
  "email": "string",
  "subscribed_at": "datetime",
  "status": "active|unsubscribed"
}
```

## Frontend Integration Notes

### Mock Data to Replace
- `/src/data/mock.js` contains all mock data
- After backend integration:
  - Fetch programs, news, stories, gallery from API
  - Forms should POST to respective endpoints
  - Admin dashboard should use real API data

### Environment Variables
- Frontend: `REACT_APP_BACKEND_URL` - Backend API base URL

## Payment Integration (Razorpay)
- When keys are provided, integrate at `/api/donations/create-order`
- Webhook endpoint: `/api/donations/webhook`
- Mock UI is ready, just needs payment gateway integration

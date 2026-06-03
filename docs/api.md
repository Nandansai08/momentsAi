# MomentsAI REST API Documentation

This document describes the API endpoints provided by the MomentsAI server. All routes are located under the `/api/*` directory.

---

## 1. Authentication Headers
Endpoints under `/api/*` that require authorization read the user session automatically using Next.js server context cookie headers. Ensure you are signed in before calling these routes, or pass standard Supabase JWT session headers.

---

## 2. API Reference

### POST `/api/moments/generate`
Generates a new emotional milestone website using Claude 3.5 Sonnet (Amazon Bedrock) and stores the record in the Supabase database.

#### Request Body Schema
The request must contain a JSON body with the following parameters:

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `occasion` | `string` | **Yes** | The milestone type (e.g. `birthday`, `anniversary`, `farewell`). |
| `recipient_name` | `string` | **Yes** | The name of the person receiving the website. |
| `sender_name` | `string` | **Yes** | The name of the creator/sender. |
| `relationship` | `string` | No | How the sender knows the recipient (e.g. `best_friend`, `partner`). |
| `event_date` | `string` | No | Date of the milestone (ISO format, `YYYY-MM-DD`). |
| `custom_title` | `string` | No | Overrides the AI-generated page title. |
| `personal_message` | `string` | No | Brief personal note or prompt for the AI. |
| `favorite_memories` | `array[string]`| No | List of key memories to highlight on the page. |
| `special_moments` | `array[string]`| No | Key highlights used to draft the timeline. |
| `theme_slug` | `string` | No | The slug of the chosen template theme (`romantic`, `cosmic`, `minimalist`, `gold`, `cute`). |
| `selected_sections` | `array[string]`| No | List of section IDs to display (e.g. `['letter', 'timeline', 'quotes', 'poem', 'guestbook']`). |
| `effects` | `array[string]`| No | List of animated visual effects (e.g. `['sakura', 'stars', 'confetti']`). |
| `is_password_protected`| `boolean`| No | Locks the moment behind a password screen if true. |
| `password_string` | `string` | No | The password string if protection is enabled. |
| `secret_message` | `string` | No | A message revealed only to visitors inputting the password. |
| `media_urls` | `array[string]`| No | List of Supabase storage public URLs for photos. |
| `music_url` | `string` | No | Path or URL to the background soundtrack. |

#### Sample Request Payload
```json
{
  "occasion": "birthday",
  "recipient_name": "Sarah",
  "sender_name": "Nandan",
  "relationship": "best_friend",
  "event_date": "2026-06-15",
  "personal_message": "Write a heartfelt letter thanking her for being there for the last 5 years.",
  "favorite_memories": [
    "Our roadtrip to Yosemite in 2023",
    "Helping me study for the finals"
  ],
  "theme_slug": "cosmic",
  "selected_sections": ["letter", "timeline", "guestbook"],
  "effects": ["stars"]
}
```

#### Response Payloads

##### Success Response (`200 OK`)
Returns the success status and the unique slug allocated for the moment:
```json
{
  "success": true,
  "slug": "sarah-birthday-gxav3"
}
```

##### Validation Error (`400 Bad Request`)
Returns an error when required inputs are missing:
```json
{
  "error": "Missing required parameters."
}
```

##### Authorization Error (`401 Unauthorized`)
Returned if the request lacks a valid user session:
```json
{
  "error": "Unauthorized. Session missing."
}
```

##### Server Error (`500 Internal Server Error`)
Returned on database insertion failures or AI generation errors:
```json
{
  "error": "Failed to link media assets."
}
```

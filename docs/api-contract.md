# API contract: RSVP and administration

This is the shared contract between `invitation-2` and `invitation-2-api`. All routes are served by the API; the browser never queries guest tables directly.

## Base rules

- JSON requests and responses use UTF-8. The API rejects bodies over 16 KB.
- Public routes accept only an opaque invitation token in the URL. They return only the invitation addressed by that token.
- Administrative routes require a Supabase access token in `Authorization: Bearer <token>`. The API verifies it and checks that the user has a row in `admin_profiles`.
- Responses must not reveal whether another invitation, email address, or administrator exists.
- The API permits the production frontend origin only, configured with `APP_ORIGIN`; local development origin is configured separately.

## Public RSVP

### `GET /v1/rsvp/{accessToken}`

Returns the recipient's own invitation and companions only.

```json
{
  "guest": {
    "fullName": "María López",
    "partySize": 2,
    "rsvpStatus": "pending",
    "dietaryRequirements": null
  },
  "companions": [
    { "id": "uuid", "fullName": "", "rsvpStatus": "pending", "dietaryRequirements": null }
  ]
}
```

The token is never included in a response or log. Invalid, expired, or revoked tokens receive the same `404` response.

### `PUT /v1/rsvp/{accessToken}`

Updates only the RSVP fields for that invitation. The whole response is atomic: either the guest and companions are accepted together or nothing changes.

```json
{
  "rsvpStatus": "confirmed",
  "dietaryRequirements": "Vegetariana",
  "companions": [
    { "id": "uuid", "fullName": "Nombre", "rsvpStatus": "confirmed", "dietaryRequirements": null }
  ]
}
```

Validation:

- `rsvpStatus`: `pending`, `confirmed`, or `declined`.
- `dietaryRequirements`: nullable text with at most 500 characters.
- `companions`: at most the guest's `partySize - 1`; each supplied `id` must belong to this invitation. Names are 1–160 characters.
- The API sets `responded_at` when a response is submitted. It never accepts client-provided timestamps, email, phone, guest IDs, or party size.

Successful updates return `200` and the same safe representation as `GET`. Validation errors return `422`; rate-limited mutations return `429` with `Retry-After`.

## Administration

### `GET /v1/admin/guests`

Authenticated administrator only. Supports bounded pagination and a validated `status` filter. It returns operational fields needed by the dashboard, never access tokens.

### `GET /v1/admin/guests/export`

Authenticated administrator only. Streams a CSV/XLSX export with no access tokens. This replaces the former public list-download workflow.

### `POST /v1/admin/guests`

Authenticated administrator only. Creates an invitation and server-generated opaque access token. Delivery of an access link is a separate, explicitly approved mail operation.

### `PATCH /v1/admin/guests/{id}` and `DELETE /v1/admin/guests/{id}`

Authenticated administrator only. The API validates UUIDs and logs only action, administrator ID, target ID, and outcome.

## Error envelope

```json
{ "error": { "code": "validation_error", "message": "Revisa los datos enviados." } }
```

Public error messages are Spanish and intentionally generic for authorization failures. The API adds a request ID to errors and logs, but never includes guest payloads, tokens, authorization headers, passwords, or Supabase credentials.

# Security and privacy

Guest names, attendance, accompanying people, dietary notes, contact details, and access links are personal data. Collect only what the RSVP needs, validate all input server-side, rate-limit public mutation endpoints, and never log complete request bodies containing guest data in production.

Store secrets outside version control and document required variable names in an `.env.example` without values.

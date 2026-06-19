# Appliance Repair Website Backend

This backend serves the static website and provides an API endpoint for contact form submissions.

## Setup

1. Install dependencies:
   ```bash
   cd "/home/musa/Desktop/VS code projects"
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open the site in your browser:
   ```
   http://localhost:3000/
   ```

## API

- `POST /api/contact` - receive contact form submissions and save them to `data/contacts.json`
- `GET /api/health` - check server heartbeat
- `GET /api/contacts` - list saved contact submissions

## Notes

- The backend stores submissions locally in `data/contacts.json`.
- For production email or CRM integration, connect this endpoint to an email-sending service or database.

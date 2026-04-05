# FEEDPULSE
## AI-Powered Product Feedback Platform

### Installation Guide

- Clone repository
- Create `.env` within the backend according to the `.env.example` | add your own `GEMINI_API_KEY`, `JWT_SECRET`, and if preferred, a different `GEMINI_MODEL`
- Toggle rate limiting on/off by setting the `FEEDBACK_RATE_LIMIT_ENABLED` variable
- Open the base directory in terminal and run `docker-compose up --build`
- Run `npm test` on backend to test endpoints and gemini parsing logic || Import the postman collection included in the backend dir to test the endpoints yourself

### Features

- Guests are free to fill in the product feedback form without logging in
- Rate limiting in the form of 5 maximum submissions per hour per IP
- Simple admin auth with protected routes and redirects
- Dashboard featuring AI reviewed feedback from users/guests with AI assigned priority scores, tags, description, and overall sentiment.
- Intuitive re-analyze feature to make a repeat request to the AI from the dashboard itself
- Multiple filters ( by category, action status, priority) and search bar for easy sorting of feedback
- Feedback can be marked New (default), In Review, Resolved, or deleted entirely

<img width="1917" height="941" alt="image" src="https://github.com/user-attachments/assets/a511cf52-d188-461d-92c2-7f5d7323ba07" />
<img width="1917" height="941" alt="image" src="https://github.com/user-attachments/assets/946333dc-e381-4ba8-b5b9-64a720510b26" />
<img width="1919" height="941" alt="image" src="https://github.com/user-attachments/assets/5acaf16e-180f-4c76-bbed-7c747976b2ed" />

### Stack

- Next.js + Typescript Frontend
- Express + Typescript Server
- MongoDB Database
- Gemini AI @ [https://aistudio.google.com/]

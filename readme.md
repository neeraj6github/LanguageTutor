Ai-ChitChat Application
A modern AI-powered chat application featuring manual and Google sign-up/login, real-time input validation, OTP email verification, and intelligent AI responses using Google Gemini API. The UI is built with Tailwind CSS for a sleek, responsive design.

🚀 Features
Manual Signup/Login: Secure authentication with email/password.

Google OAuth: Quick sign-up and login with Google accounts.

OTP Email Verification: Users receive OTP for email validation during signup.

Real-time Input Validation: Validates emails, passwords, and usernames instantly.

AI Chat: Interactive chat powered by Google Gemini API for smart responses.

Clean UI: Responsive and modern interface styled with Tailwind CSS.



🛠️ Tech Stack & Usage
Technology	Purpose/Usage
React	Frontend UI and state management
React Router	Client-side routing between pages
Firebase Auth	Authentication for manual and Google OAuth
Google OAuth	Quick signup/login with Google accounts
Node.js + Express	Backend API to handle chat requests and Gemini API integration
Axios	HTTP client for API requests
Nodemailer	Sending OTP emails for email verification
Google Gemini API	AI language model for generating chat responses
Tailwind CSS	Styling and responsive UI design
GSAP	Animations and smooth transitions
dotenv	Environment variable management to keep secrets safe

⚙️ Gemini API Integration
Our AI chat responses are powered by Google Gemini API, enabling natural and intelligent replies.

How it works:
User submits a chat message in the frontend.

Frontend sends the message to the backend API.

Backend formats the prompt and sends a POST request to the Gemini API endpoint.

The request includes the prompt and the Gemini API key stored securely in environment variables (.env).

Gemini API returns a plain-text reply.

Backend forwards this reply to the frontend chat UI.

Frontend displays the response, including proper formatting for code blocks.

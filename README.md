AetherBook — Lecture Room Booking System

A role-based lecture room booking system built with React and Supabase. Designed for universities to manage room reservations across three access levels: Admin, Lecturer, and Student.

Live Demo

🔗 https://lecture-room-booking-app.vercel.app/

Features

Admin


Add and manage lecture rooms
Grant access to lecturers and other admins via email
View all permitted accounts and their roles
Full system oversight


Lecturer


Book available lecture rooms
Select date, start time, and end time
View all existing bookings


Student


Read-only access to all room bookings
View room name, date, time, and booking owner


Tech Stack


Frontend — React + Vite
Styling — Tailwind CSS v3
Routing — React Router DOM
Backend & Auth — Supabase (PostgreSQL + Auth)
Deployment — Vercel


Database Structure

TablePurposeallowed_emailsStores emails with assigned roles (admin/lecturer)roomsStores lecture room namesbookingsStores all room bookings with date and time

How Roles Work

Anyone can sign up. On login, the system checks the allowed_emails table:


Email found with role admin → redirected to Admin Dashboard
Email found with role lecturer → redirected to Lecturer Dashboard
Email not in table → treated as a Student (read-only access)


Only admins can grant lecturer or admin privileges.

Getting Started

Prerequisites


Node.js
A Supabase account


Installation

bashgit clone https://github.com/Donmane/Lecture_room_booking_app.git
cd Lecture_room_booking_app
npm install

Environment Variables

Create a .env file in the root directory:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Run Locally

bashnpm run dev

Project Structure

src/
├── components/
├── context/
├── lib/
│   └── supabase.js
├── pages/
│   ├── admin/
│   │   └── AdminDashboard.jsx
│   ├── lecturer/
│   │   └── LecturerDashboard.jsx
│   ├── student/
│   │   └── StudentDashboard.jsx
│   ├── Login.jsx
│   └── Signup.jsx
├── App.jsx
├── main.jsx
└── index.css

Author

Edith-Agoye Daniel Olamide


GitHub: @Donmane
LinkedIn: daniel-edith-agoye



Built as a school group project at Lead City University, Ibadan — treated like a real product.
Content
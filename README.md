 # CivicConnect

### Citizen Complaint & Civic Issue Reporting Portal

CivicConnect is a full-stack web platform that connects citizens with local authorities through a transparent digital complaint management system.

Citizens can report problems such as broken roads, garbage accumulation, water-supply issues, and electricity problems. They can track the progress of their complaints, browse public complaints, and upvote existing issues.

Government officers can review, prioritize, update, and resolve complaints from a dedicated dashboard.

---

## 🚀 Features

### 👤 Citizen

* Create an account and log in securely
* Submit civic complaints
* Select complaint category
* Add title, description, and area/locality
* View personal complaint history
* Track complaint status
* View officer remarks
* Browse public complaints
* Search and filter complaints
* Upvote existing complaints
* Prevent duplicate upvotes
* Receive duplicate complaint warnings
* View complaint priority
* Submit feedback after resolution
* Rate complaint resolution from 1 to 5 stars
* Add optional feedback comments
* Manage profile information
* Upload a profile picture

### 👮 Officer

* Secure officer authentication
* Officer dashboard
* View all citizen complaints
* Search complaints by keyword
* Filter by category
* Filter by area
* Filter by status
* Filter by priority
* View complaint details
* Update complaint status
* Add officer remarks
* Resolve complaints
* View citizen feedback
* Monitor satisfaction results
* Automatically identify high-priority complaints

---

## 📊 Complaint Status

Complaints move through a simple workflow:

```text
Pending
   ↓
In Progress
   ↓
Resolved
```

Officers can update the complaint status and add remarks to keep citizens informed.

---

## ⭐ Priority Scoring

CivicConnect automatically calculates complaint priority using:

```text
Priority Score = Upvotes × Days Since Created
```

| Score | Priority |
| ----: | -------- |
|   0–4 | Low      |
|  5–15 | Medium   |
| 16–30 | High     |
|   30+ | Critical |

For example:

A complaint that is 10 days old with 20 upvotes:

```text
20 × 10 = 200
```

The complaint is therefore classified as:

```text
Critical
```

Priority is calculated dynamically when complaints are fetched, so no scheduled job is required.

---

## 🔍 Duplicate Complaint Detection

Before creating a new complaint, CivicConnect checks for existing complaints with the same:

* Category
* Area/locality
* Active status

If a similar complaint already exists, the citizen can be encouraged to upvote the existing complaint instead of creating a duplicate report.

This helps authorities identify how many citizens are affected by the same issue.

---

## 👍 Upvoting

Citizens can support existing complaints by upvoting them.

Each citizen can upvote a complaint only once.

This prevents duplicate votes and helps officers identify issues affecting larger numbers of people.

---

## ⭐ Citizen Feedback

When an officer marks a complaint as resolved, the complaint becomes eligible for feedback.

The citizen can provide:

* 1–5 star rating
* Optional comment

Officers can use the collected feedback to understand citizen satisfaction.

---

## 🔐 Authentication & Security

CivicConnect uses:

* JWT authentication
* bcrypt password hashing
* Role-based authorization
* Protected API routes
* Citizen-specific complaint access
* Officer-only complaint management
* Duplicate upvote prevention
* Backend validation

Passwords are never stored as plain text.

The citizen ID for complaints is obtained from the verified JWT instead of being trusted from frontend input.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Redux Toolkit
* React Router
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer

### Development

* Git
* GitHub
* VS Code
* MongoDB

---

## 📁 Project Structure

```text
hackathon-fullstack/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/abdulghaffar9/hakathon-2026.git
```

### 2. Enter the project

```bash
cd hakathon-2026
```

---

## 📦 Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 📦 Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
```

### Environment Variables

| Variable        | Description                    |
| --------------- | ------------------------------ |
| `PORT`          | Backend server port            |
| `MONGO_URI`     | MongoDB connection string      |
| `JWT_SECRET`    | Secret used to sign JWT tokens |
| `CLIENT_ORIGIN` | Frontend URL                   |

Never commit your `.env` file to GitHub.

---

## ▶️ Running the Application

### Start the backend

```bash
cd server
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 👮 Creating an Officer Account

For the


# Scrum Poker

A free, real-time Scrum Poker website built with **Node.js**, **Express**, and **Socket.IO**—entirely in memory (no database). Designed to be lightweight, ad-free, and easy to host on free platforms like **Render**. Check it out [here](https://ben-made-scrum-poker.onrender.com)

## Features

- **Real-Time Voting**: Uses Socket.IO websockets, so all users’ estimates update instantly.
- **Fibonacci Estimates**: Cards from 1 to 21, displayed in a simple UI.
- **Reveal & Reset**: Hide everyone’s estimates until reveal time, then reset for the next round.
- **Ephemeral Storage**: No database—room data is stored in memory and deleted when the last user leaves.
- **Min/Max & Average**: On reveal, highlight the lowest/highest estimates and display the average.
- **Confetti**: If all revealed estimates match, a confetti effect appears on-screen.
- **Up to 20 Users**: Each room can hold 20 users, each joining with a 4-digit code.

## Requirements

- **Node.js** (version 10 or higher recommended)
- **npm** (or yarn)
- A free hosting service like [Render](https://render.com/) (optional, if you want to deploy publicly)

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/benj327/scrum-poker.git
   ```
2. **Install Dependencies**:
   ```bash
   cd scrum-poker
   npm install
   ```
3. **Run Locally**:
   ```bash
   npm start
   ```
   The server starts on http://localhost:3000.
   Open that URL in your browser to test the site.

## File Structure
.
├── server.js             - Node/Express/Socket.IO server
├── package.json
├── public/
│   ├── index.html        - Landing page (join form)
│   ├── room.html         - Main Scrum Poker UI
│   ├── client.js         - Socket.IO client-side logic
│   └── styles.css        - Front-end styling
└── README.md

## Usage

### Landing Page (`index.html`)
Enter a 4-digit room code and your name. You can create a new room by using any 4-digit code, or join an existing one.

### Room Page (`room.html`)
Click on a Fibonacci card to select your estimate (hidden to others until **Reveal**).  
**Reveal** shows everyone’s selected card.  
**Reset** clears the estimates so you can start a new round.

### Min/Max & Average
Once revealed, the script calculates the minimum, maximum, and average of all selections.  
- **Minimum** estimate tiles are highlighted (e.g., red border).  
- **Maximum** estimate tiles are highlighted (e.g., green border).  
An average is displayed above the user tiles.  
If **all** revealed estimates match, a short confetti animation plays.

## Deploy your own with Render

**Create an Account**: Sign up or log in at Render.  
**New Web Service**: Link your GitHub repo, choose your main branch, and set the Build Command to `npm install` and the Start Command to `npm start`.  
**Free Tier**: Choose the free plan for hosting. Render will provide a URL (e.g., `your-app.onrender.com`).  
**Access the Site**: Share the URL with your team. They can immediately join your Scrum Poker sessions.




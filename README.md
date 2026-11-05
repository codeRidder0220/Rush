
# 🦉 RUSH ARCADE

### Read it. Remember it. Beat the challenge!

RUSH ARCADE is a memory-based reading game built with Next.js and MongoDB. Players are shown a randomly selected passage or image for a limited time. They must carefully memorize the content before it disappears and then answer questions based on what they remember.

The game challenges players to focus, improve their memory, and make every answer count.

---

##  Game Features

- **Random Passages:** A new passage is selected when starting a new game.
- **Reading Countdown:** Players get a limited amount of time to memorize the content.
- **Multiple Difficulty Levels:** Easy, Medium, Hard, and Very Hard.
- **Text and Image Content:** The game supports reading passages and image-based memory challenges.
- **Session Persistence:** Refreshing the reading screen keeps the same passage and session.
- **Question Challenge:** After reading time ends, the player moves to the question stage.
- **Lives System:** Players have 3 lives. Make every answer count!
- **User Authentication:** Game sessions are associated with the authenticated user.
- **MongoDB Storage:** Game sessions and content are stored in the database.

---

##  How to Play

1. Open RUSH ARCADE and go to the dashboard.
2. Click **START GAME**.
3. A random passage or image is selected.
4. Memorize the content before the countdown reaches zero.
5. The passage disappears when reading time is over.
6. Continue to the questions screen and answer based on your memory.
7. Try to complete the challenge while keeping your lives.

---

##  Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and application routing |
| React | Interactive user interface |
| JavaScript | Application logic |
| Tailwind CSS | Styling and responsive UI |
| MongoDB | Database for content and game sessions |
| Server Actions | Server-side game operations |


---

##  Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB database
- Git

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

Add the environment variables required by your project:

```env
MONGODB_URI=your_mongodb_connection_string
```

If your project uses authentication or other services, add their required environment variables as well.

**Important:** Never upload `.env.local` or secret credentials to GitHub.

### 4. Run the development server

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

##  Game Session Handling

RUSH ARCADE creates a game session when a player starts a new game.

The session stores information such as:

- User
- Selected content
- Game status
- Session start time
- Reading end time

The reading screen stores the active session ID in `sessionStorage`. This allows the same reading session to be restored when the page is refreshed.

Starting a new game from the dashboard clears the previously stored session ID so that a new passage can be selected.

---

##  Content and Difficulty

The game supports different content types:

- Text passages
- Image-based content

Content can be assigned a difficulty level:

- Easy
- Medium
- Hard
- Very Hard

Reading durations are configured according to the selected difficulty in the game logic.

---

##  Security Notes

- Keep database credentials and secret keys in environment variables.
- Do not commit `.env.local` to the repository.
- Game sessions should be accessed only by the authenticated user who owns them.
- Validate user input and session IDs on the server.

---

##  Future Improvements

Possible features for future versions:

- Player scores and leaderboard
- Difficulty-based scoring
- Daily memory challenges
- Player statistics and progress tracking
- More passage and image categories
- Sound effects and animations
- Improved mobile experience

---

##  Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

---

##  License

This project is currently provided for learning and development purposes.

Add a license file if you plan to distribute or open-source the project.

---

**Built with ❤️ using Next.js, React, and MongoDB.**

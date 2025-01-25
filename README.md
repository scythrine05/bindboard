# Bindboard - Real-Time Collaborative Drawing App

Bindboard is a real-time collaborative drawing application that allows multiple users to draw on a shared canvas. It combines a React-based client and a Node.js server with Redis and Socket.IO for seamless real-time collaboration.

---

## Live Demo

Check out the live version of Bindboard here:  
👉 [https://bindboard.rohanworks.com/](https://bindboard.rohanworks.com/)


---


## Features

1. **Real-Time Collaborative Drawing**:
   - Multiple users can draw on the same canvas simultaneously.
   - Synchronized drawing tools, including pencils, erasers, and color pickers.

2. **Room Management**:
   - Create and join drawing rooms.
   - Room owners can assign roles (e.g., allow or revoke write access for users).

3. **User Interaction**:
   - View active users in real time.
   - Assign roles and permissions dynamically.

4. **Drawing Data Persistence**:
   - Redis stores room-specific drawing data.
   - Rooms and data auto-expire after inactivity.

5. **Easy Sharing and Export**:
   - Clear the canvas or export your artwork for sharing.

---

## Technologies Used

- **Frontend**: React (TypeScript), HTML Canvas, CSS, Vite, PrimeReact.
- **Backend**: Node.js, Express, Socket.IO, Redis.
- **Deployment**: Docker, EC2, Nginx.

---

## How to Run Using Docker Compose

1. **Prerequisites**:
   - Ensure Docker and Docker Compose are installed on your system.
   - Clone the repository:
     ```bash
     git clone https://github.com/scythrine05/bindboard.git
     cd bindboard
     ```

2. **Start the Application**:
   - Run the following command to start the client, server, and Redis containers:
     ```bash
     docker-compose up
     ```
   - This will:
     - Start the **React client** on port `3001`.
     - Start the **Node.js server** on port `4000`.
     - Start the **Redis server** on port `6379`.

3. **Access the Application**:
   - Open your browser and navigate to:
     - **Client**: `http://localhost:3001`
     - **Server API**: `http://localhost:4000`

4. **Stop the Application**:
   - To stop the containers, press `Ctrl+C` in the terminal or run:
     ```bash
     docker-compose down
     ```

---

## Contributing

Feel free to open issues or submit pull requests for improvements. Happy collaborating!
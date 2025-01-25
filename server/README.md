# Bindboard Server

Bindboard (server) is the backend for the Bindboard application, providing real-time collaboration, room management, and drawing data persistence.

## Features

- **Room Management**:
  - Create and manage collaborative drawing rooms.
  - Assign room owners and allow them to grant or revoke writing permissions for other users.
  - Automatically delete rooms when all users leave.

- **Real-time Communication**:
  - Synchronize drawing events, user interactions, and role updates across all connected clients using Socket.IO.
  - Provide live updates of active users and their roles in the room.

- **Drawing Data Persistence**:
  - Store and retrieve room-specific drawing data using Redis for fast and efficient data handling.
  - Auto-expire rooms and their data after a defined period of inactivity.

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express**: Web framework for routing and API management.
- **Redis**: In-memory data store for room and drawing data persistence.
- **Socket.IO**: Real-time communication framework for collaborative features.

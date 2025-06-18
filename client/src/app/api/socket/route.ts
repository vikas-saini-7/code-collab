import { createServer } from 'http';
import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

const socketHandler = () => {
  if (process.env.NODE_ENV !== 'production') {
    // In development, set up Socket.io server
    const httpServer = createServer();
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      // Handle joining a room
      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
      });
      
      // Handle code changes
      socket.on('code-change', ({ roomId, fileId, code, sender }) => {
        // Broadcast the code changes to other clients in the same room
        socket.to(roomId).emit('code-update', { fileId, code, sender });
      });
      
      // Handle cursor position
      socket.on('cursor-move', ({ roomId, fileId, position, sender }) => {
        socket.to(roomId).emit('cursor-update', { fileId, position, sender });
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    httpServer.listen(3001, () => {
      console.log('Socket.io server running on port 3001');
    });
  }

  return NextResponse.json({ message: 'Socket server initialized' });
};

export { socketHandler as GET, socketHandler as POST };
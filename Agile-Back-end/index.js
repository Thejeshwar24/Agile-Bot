
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import epicRoutes from './routes/epicRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userGroupRoutes from './routes/userGroupRoutes.js';
import userRoutes from './routes/userRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import ownerRoutes from './routes/ownerRoute.js'


dotenv.config();


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/epics', epicRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/userGroups', userGroupRoutes);
app.use('/api/users', userRoutes);
app.use('/api', assignmentRoutes);



app.use('/api/owners', ownerRoutes);

// Database Connection and Server Start
const port = process.env.PORT || 5002;
const conn = process.env.URI

// mongoose.connect(process.env.MONGODB_URI)
mongoose.connect(conn)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Could not connect to MongoDB...', err);
    });

import express from 'express';
import User from './models/User.js';
import Story from './models/Story.js';
import Task from './models/Task.js';

const router = express.Router();

// Webhook for checking user assignments
router.post('/webhook/checkAssignments', async (req, res) => {
    const { name } = req.body;

    try {
        // Find the user by name
        const user = await User.findOne({ name: name });

        if (!user) {
            return res.status(200).json({
                success: false,
                message: 'No user found with this name.',
                data: null
            });
        }

        // Find stories assigned to the user
        const stories = await Story.find({ assignedUser: user.name });

        // Find tasks assigned to the user
        const tasks = await Task.find({ assignedUser: user.name });

        // Prepare the response
        let response = {
            user: {
                name: user.name
            },
            stories: [],
            tasks: []
        };

        // Add stories to the response
        stories.forEach(story => {
            response.stories.push({
                storyName: story.storyName,
                description: story.description
            });
        });

        // Add tasks to the response
        tasks.forEach(task => {
            const story = stories.find(story => story._id.equals(task.storyId));
            response.tasks.push({
                taskName: task.taskName,
                description: task.description,
                storyName: story ? story.storyName : 'Unknown Story'
            });
        });

        // Check if there are no assignments
        if (response.stories.length === 0 && response.tasks.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No stories or tasks assigned to you.',
                data: response
            });
        }

        // Return the response
        res.status(200).json({
            success: true,
            message: 'Assignments retrieved successfully.',
            data: response
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching data. Please try again.',
            error: err.message
        });
    }
});

export default router;

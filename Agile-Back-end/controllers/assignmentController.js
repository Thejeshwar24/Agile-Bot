import User from '../models/user.js';
import Story from '../models/story.js';
import Task from '../models/task.js';

export const getUserAssignments = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find stories assigned to the user
        const stories = await Story.find({ assignedUser: user.name });

        // Find tasks assigned to the user
        const tasks = await Task.find({ assignedUser: user.name });

        res.status(200).json({
            user: user.name,
            stories,
            tasks,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

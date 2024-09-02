import mongoose from 'mongoose';


const taskSchema = new mongoose.Schema({
    taskName: { type: String, required: true },
    description: String,
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
    userGroup: String,
    assignedUser: String,
    priority: String,
    duration: Number,
    estimationPoints: Number,
    startDate: Date,
    endDate: Date,
});

const Task = mongoose.model('Task', taskSchema);

export default Task;

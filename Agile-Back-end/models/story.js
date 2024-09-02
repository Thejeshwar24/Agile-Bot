import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    storyName: { type: String, required: true },
    description: String,
    epicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Epic' },
    userGroup: String,
    assignedUser: String,
    priority: String,
    duration: Number,
    estimationPoints: Number,
    startDate: Date,
    endDate: Date,
});

const Story = mongoose.model('Story', storySchema);

export default Story;

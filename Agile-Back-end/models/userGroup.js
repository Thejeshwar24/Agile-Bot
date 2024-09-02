import mongoose from 'mongoose';

const userGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const UserGroup = mongoose.model('UserGroup', userGroupSchema);

export default UserGroup;


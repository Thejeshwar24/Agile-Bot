import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'UserGroup' ,required:true},
});

const User = mongoose.model('User', userSchema);

export default User;

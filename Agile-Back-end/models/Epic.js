import mongoose from 'mongoose';

const epicSchema = new mongoose.Schema({
    epicName: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: String, required: true },
    color: { type: String, required: true }, 
  });
  

const Epic = mongoose.model('Epic', epicSchema);

export default Epic;

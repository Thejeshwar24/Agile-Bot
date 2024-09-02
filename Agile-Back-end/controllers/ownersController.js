// controllers/ownerController.js
import Owner from '../models/Owners.js';

export const getOwners = async (req, res) => {
  try {
    const owners = await Owner.find({});
    res.status(200).json(owners);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch owners' });
  }
};

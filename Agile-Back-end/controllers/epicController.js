import Epic from '../models/Epic.js';
import Owner from '../models/Owners.js';

export const createEpic = async (req, res) => {
    try {
        const { epicName, description, owner: ownerId, color } = req.body;

        // Fetch the owner's name using the ownerId
        const owner = await Owner.findById(ownerId);
        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        // Create the epic with the owner's name instead of ID
        const newEpic = new Epic({
            epicName,
            description,
            owner: owner.name, // Store owner name here
            color,
        });

        await newEpic.save();
        res.status(201).json(newEpic);
    } catch (error) {
        console.error('Error creating epic:', error);
        res.status(500).json({ message: 'Error creating epic', error });
    }
};

export const getEpics = async (req, res) => {
    try {
        // Fetch all epics directly
        const epics = await Epic.find();

        // Since the owner's name is already stored in the epic, no need to look up the owner again
        res.status(200).json(epics);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

//by id
export const getEpicById = async (req, res) => {
    try {
        const epic = await Epic.findById(req.params.id);
        if (!epic) return res.status(404).json({ message: 'Epic not found' });
        res.status(200).json(epic);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching epic', error });
    }
};

//update
export const updateEpic = async (req, res) => {
    try {
        const updatedEpic = await Epic.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEpic) return res.status(404).json({ message: 'Epic not found' });
        res.status(200).json(updatedEpic);
    } catch (error) {
        res.status(500).json({ message: 'Error updating epic', error });
    }
};

//delete
export const deleteEpic = async (req, res) => {
    try {
        const deletedEpic = await Epic.findByIdAndDelete(req.params.id);
        if (!deletedEpic) return res.status(404).json({ message: 'Epic not found' });
        res.status(200).json({ message: 'Epic deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting epic', error });
    }
};
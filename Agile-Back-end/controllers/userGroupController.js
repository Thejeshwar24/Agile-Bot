import UserGroup from '../models/userGroup.js';

export const createUserGroup = async (req, res) => {
    try {
        const userGroup = new UserGroup(req.body);
        await userGroup.save();
        res.status(201).send(userGroup);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

export const getUserGroups = async (req, res) => {
    try {
        const userGroups = await UserGroup.find();
        res.status(200).send(userGroups);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

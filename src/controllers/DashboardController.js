import { Rental } from '../models/Rental';
import { User } from '../models/User';

export const getLatestOrders = async (req, res) => {
    const latestOrders = await Rental.find().sort('-dateOrdered').populate('customer').populate('movies').populate('series');
    res.json(latestOrders);
};

export const getLatestMembers = async (req, res) => {
    const latestMembers = await User.find().sort('-joinedAt');
    res.json(latestMembers);
};
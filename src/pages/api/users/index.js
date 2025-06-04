import { connectDB } from '../../../utils/db';
import User from '../../../models/User';
import { getSession } from 'next-auth/react';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await connectDB();
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { role } = req.query;
      const query = role ? { role } : {};
      const users = await User.find(query).select('-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  } else if (req.method === 'POST') {
    if (session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      const { password, ...userData } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      res.status(201).json({ ...user._doc, password: undefined });
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  }
}
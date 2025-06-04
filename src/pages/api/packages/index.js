import { connectDB } from '../../../utils/db';
import Package from '../../../models/Package';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  await connectDB();
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const packages = await Package.find({});
      res.status(200).json(packages);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching packages' });
    }
  } else if (req.method === 'POST') {
    if (session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      const package = await Package.create(req.body);
      res.status(201).json(package);
    } catch (error) {
      res.status(500).json({ error: 'Error creating package' });
    }
  }
}
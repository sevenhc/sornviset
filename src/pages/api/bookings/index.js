import { connectDB } from '../../../utils/db';
import Booking from '../../../models/Booking';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  await connectDB();
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const bookings = await Booking.find({})
        .populate('package')
        .populate('therapist', 'name')
        .sort({ date: -1 });
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching bookings' });
    }
  } else if (req.method === 'POST') {
    try {
      const booking = await Booking.create(req.body);
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: 'Error creating booking' });
    }
  }
}
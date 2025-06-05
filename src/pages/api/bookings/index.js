import { connectDB } from '../../../utils/db';
import Booking from '../../../models/Booking';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await connectDB();

  if (req.method === 'GET') {
    try {
      let query = {};
      
      // If user is a therapist, only show their bookings
      if (session.user.role === 'therapist') {
        query.therapist = session.user.id;
      }

      const bookings = await Booking.find(query)
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
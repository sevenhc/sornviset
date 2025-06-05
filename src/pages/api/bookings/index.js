import { connectDB } from '../../../utils/db';
import Booking from '../../../models/Booking';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
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
          .sort({ date: -1 })
          .lean();

        if (!bookings) {
          return res.status(200).json([]);
        }

        res.status(200).json(bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Error fetching bookings' });
      }
    } else if (req.method === 'POST') {
      try {
        const booking = await Booking.create(req.body);
        res.status(201).json(booking);
      } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Error creating booking' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
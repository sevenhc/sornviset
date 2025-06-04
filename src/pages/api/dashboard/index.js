import { connectDB } from '../../../utils/db';
import Booking from '../../../models/Booking';
import { getSession } from 'next-auth/react';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectDB();

    // Get total bookings
    const totalBookings = await Booking.countDocuments({ status: 'completed' });

    // Get revenue and commission totals
    const bookings = await Booking.find({ status: 'completed' })
      .populate('package');
    
    const totals = bookings.reduce((acc, booking) => ({
      revenue: acc.revenue + booking.package.price,
      commissions: acc.commissions + booking.package.commission
    }), { revenue: 0, commissions: 0 });

    // Get revenue by month
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: 'completed',
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $lookup: {
          from: 'packages',
          localField: 'package',
          foreignField: '_id',
          as: 'package'
        }
      },
      {
        $unwind: '$package'
      },
      {
        $group: {
          _id: { $month: '$date' },
          amount: { $sum: '$package.price' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Get bookings by package
    const bookingsByPackage = await Booking.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $lookup: {
          from: 'packages',
          localField: 'package',
          foreignField: '_id',
          as: 'package'
        }
      },
      {
        $unwind: '$package'
      },
      {
        $group: {
          _id: '$package.name',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      totalBookings,
      totalRevenue: totals.revenue,
      totalCommissions: totals.commissions,
      revenueByMonth: monthlyRevenue.map(item => ({
        month: format(new Date(2024, item._id - 1), 'MMM'),
        amount: item.amount
      })),
      bookingsByPackage: bookingsByPackage.map(item => ({
        package: item._id,
        count: item.count
      }))
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
}
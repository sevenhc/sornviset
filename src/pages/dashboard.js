import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalCommission: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings
      const res = await fetch('/api/bookings');
      const data = await res.json();
      
      // Filter bookings for therapist if user is a therapist
      const filteredBookings = session?.user?.role === 'therapist' 
        ? data.filter(booking => booking.therapist._id === session.user.id)
        : data;

      setBookings(filteredBookings);

      // Calculate stats
      const completedBookings = filteredBookings.filter(b => b.status === 'completed');
      setStats({
        totalBookings: completedBookings.length,
        totalCommission: completedBookings.reduce((sum, booking) => sum + booking.package.commission, 0)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={6}>Dashboard</Heading>
      
      <StatGroup mb={8}>
        <Stat>
          <StatLabel>Total Completed Bookings</StatLabel>
          <StatNumber>{stats.totalBookings}</StatNumber>
        </Stat>
        {session?.user?.role === 'therapist' && (
          <Stat>
            <StatLabel>Total Commission Earned</StatLabel>
            <StatNumber>฿{stats.totalCommission.toLocaleString()}</StatNumber>
          </Stat>
        )}
      </StatGroup>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Customer</Th>
              <Th>Package</Th>
              <Th>Room</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking) => (
              <Tr key={booking._id}>
                <Td>{new Date(booking.date).toLocaleString()}</Td>
                <Td>{booking.customer.name}</Td>
                <Td>{booking.package.name}</Td>
                <Td>{booking.room}</Td>
                <Td>{booking.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
}
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
  Text,
} from '@chakra-ui/react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalCommission: 0
  });

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Invalid data format:', data);
        setBookings([]);
        return;
      }

      setBookings(data);

      // Calculate stats
      const completedBookings = data.filter(b => b.status === 'completed');
      setStats({
        totalBookings: completedBookings.length,
        totalCommission: completedBookings.reduce((sum, booking) => 
          sum + (booking.package?.commission || 0), 0)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setBookings([]);
    }
  };

  if (!session) {
    return null;
  }

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
        {bookings.length > 0 ? (
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
                  <Td>{booking.customer?.name || 'N/A'}</Td>
                  <Td>{booking.package?.name || 'N/A'}</Td>
                  <Td>{booking.room}</Td>
                  <Td>{booking.status}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text textAlign="center" py={4}>No bookings found</Text>
        )}
      </Box>
    </Container>
  );
}
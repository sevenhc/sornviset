import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from '@chakra-ui/react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalCommissions: 0
  });
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: []
  });
  const [bookingsData, setBookingsData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      
      setStats({
        totalBookings: data.totalBookings,
        totalRevenue: data.totalRevenue,
        totalCommissions: data.totalCommissions
      });

      setRevenueData({
        labels: data.revenueByMonth.map(item => item.month),
        datasets: [{
          label: 'Revenue',
          data: data.revenueByMonth.map(item => item.amount),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      });

      setBookingsData({
        labels: data.bookingsByPackage.map(item => item.package),
        datasets: [{
          label: 'Bookings by Package',
          data: data.bookingsByPackage.map(item => item.count),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }]
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
          <StatLabel>Total Bookings</StatLabel>
          <StatNumber>{stats.totalBookings}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Revenue</StatLabel>
          <StatNumber>฿{stats.totalRevenue.toLocaleString()}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Commissions</StatLabel>
          <StatNumber>฿{stats.totalCommissions.toLocaleString()}</StatNumber>
        </Stat>
      </StatGroup>

      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Box p={6} bg="white" borderRadius="lg" shadow="md">
          <Heading size="md" mb={4}>Monthly Revenue</Heading>
          <Line data={revenueData} />
        </Box>
        <Box p={6} bg="white" borderRadius="lg" shadow="md">
          <Heading size="md" mb={4}>Bookings by Package</Heading>
          <Bar data={bookingsData} />
        </Box>
      </Grid>
    </Container>
  );
}
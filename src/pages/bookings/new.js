import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function NewBooking() {
  const [packages, setPackages] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [booking, setBooking] = useState({
    package: '',
    therapist: '',
    room: '',
    customerName: '',
    customerPhone: '',
    date: '',
  });
  
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchPackages();
    fetchTherapists();
  }, []);

  const fetchPackages = async () => {
    const res = await fetch('/api/packages');
    const data = await res.json();
    setPackages(data);
  };

  const fetchTherapists = async () => {
    const res = await fetch('/api/users?role=therapist');
    const data = await res.json();
    setTherapists(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: booking.package,
          therapist: booking.therapist,
          room: booking.room,
          customer: {
            name: booking.customerName,
            phone: booking.customerPhone
          },
          date: booking.date
        }),
      });

      if (res.ok) {
        toast({
          title: 'Booking created successfully',
          status: 'success',
          duration: 3000,
        });
        router.push('/bookings');
      }
    } catch (error) {
      toast({
        title: 'Error creating booking',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Package</FormLabel>
              <Select
                value={booking.package}
                onChange={(e) => setBooking({...booking, package: e.target.value})}
              >
                <option value="">Select package</option>
                {packages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.name} - {pkg.massageType} ({pkg.sessionTime}min)
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Therapist</FormLabel>
              <Select
                value={booking.therapist}
                onChange={(e) => setBooking({...booking, therapist: e.target.value})}
              >
                <option value="">Select therapist</option>
                {therapists.map((therapist) => (
                  <option key={therapist._id} value={therapist._id}>
                    {therapist.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Room</FormLabel>
              <Select
                value={booking.room}
                onChange={(e) => setBooking({...booking, room: e.target.value})}
              >
                <option value="">Select room</option>
                <option value="Room 1">Room 1</option>
                <option value="Room 2">Room 2</option>
                <option value="Room 3">Room 3</option>
                <option value="Room 4">Room 4</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Customer Name</FormLabel>
              <Input
                value={booking.customerName}
                onChange={(e) => setBooking({...booking, customerName: e.target.value})}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Customer Phone</FormLabel>
              <Input
                value={booking.customerPhone}
                onChange={(e) => setBooking({...booking, customerPhone: e.target.value})}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Date and Time</FormLabel>
              <Input
                type="datetime-local"
                value={booking.date}
                onChange={(e) => setBooking({...booking, date: e.target.value})}
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" width="full">
              Create Booking
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}
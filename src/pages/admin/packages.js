import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({
    name: '',
    massageType: '',
    sessionTime: '',
    price: '',
    commission: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const res = await fetch('/api/packages');
    const data = await res.json();
    setPackages(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPackage),
      });
      
      if (res.ok) {
        toast({
          title: 'Package created successfully',
          status: 'success',
          duration: 3000,
        });
        fetchPackages();
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Error creating package',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Button onClick={onOpen} colorScheme="blue" mb={4}>
        Create New Package
      </Button>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Massage Type</Th>
              <Th>Session Time</Th>
              <Th>Price</Th>
              <Th>Commission</Th>
            </Tr>
          </Thead>
          <Tbody>
            {packages.map((pkg) => (
              <Tr key={pkg._id}>
                <Td>{pkg.name}</Td>
                <Td>{pkg.massageType}</Td>
                <Td>{pkg.sessionTime} min</Td>
                <Td>{pkg.price}</Td>
                <Td>{pkg.commission}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Package</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl mb={4}>
                <FormLabel>Package Name</FormLabel>
                <Input
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Massage Type</FormLabel>
                <Select
                  value={newPackage.massageType}
                  onChange={(e) => setNewPackage({...newPackage, massageType: e.target.value})}
                >
                  <option value="">Select type</option>
                  <option value="Thai">Thai</option>
                  <option value="Oil">Oil</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Session Time (minutes)</FormLabel>
                <Select
                  value={newPackage.sessionTime}
                  onChange={(e) => setNewPackage({...newPackage, sessionTime: e.target.value})}
                >
                  <option value="">Select time</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Commission</FormLabel>
                <Input
                  type="number"
                  value={newPackage.commission}
                  onChange={(e) => setNewPackage({...newPackage, commission: e.target.value})}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Create Package
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
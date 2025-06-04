import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
} from '@chakra-ui/react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={4}>
        <Heading>Welcome to Spa Management</Heading>
        {session && (
          <Button onClick={() => signOut()}>Sign Out</Button>
        )}
      </VStack>
    </Container>
  );
}
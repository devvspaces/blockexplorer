import { Box, Button, Container, Flex, Heading, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';


export default function Layout({ children }: { children: React.ReactNode }) {

  const { toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue('dark', 'light');
  return (
    <Box>
      <Container maxW='container.xl' pt={10} pb={5} mb={5}>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Heading as='h3'>
            Ethereum Explorer
          </Heading>

          <Button display={'block'} colorScheme='teal' onClick={toggleColorMode}>
            {bgColor === 'dark' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>
      </Container>
      <Container maxW='container.xl' py={5}>
        {children}
      </Container>
    </Box>
  )
}
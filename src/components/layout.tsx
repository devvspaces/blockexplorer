import { Box, Button, Container, Flex, Heading, Input, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SearchIcon, SunIcon } from '@chakra-ui/icons';
import Link from 'next/link';


export default function Layout({ children }: { children: React.ReactNode }) {

  const { toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue('dark', 'light');
  return (
    <Box>
      <Container maxW='container.xl' pt={10} pb={5} mb={5}>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Heading as='h3'>
            <Link href={'/'}>
            Ethereum Explorer
            </Link>
          </Heading>
          <Button display={'block'} colorScheme='teal' onClick={toggleColorMode}>
            {bgColor === 'dark' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>

        <form action="" >
          <Flex marginX={"auto"} alignItems={'stretch'} justifyContent={"center"} gap={"1rem"} mt={"2rem"}>
            <Input type="text" name="search" id="search" placeholder="Search for a block, transaction, or address" size={"lg"} />
            <Button height={"46px"} colorScheme={"blue"}><SearchIcon /></Button>
          </Flex>
        </form>
      </Container>

      <Container maxW='container.xl' py={5}>
        {children}
      </Container>
    </Box>
  )
}
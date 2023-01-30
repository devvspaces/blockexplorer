import { SearchIcon } from '@chakra-ui/icons'
import { Badge, Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, Heading, Input, Skeleton, Stack, StackDivider, Stat, StatGroup, StatLabel, StatNumber, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/index.module.scss'
import { LastestBlock, Transaction } from '@/interfaces'


export default function Home() {

  const [isBlocksLoaded, setBlocksLoaded] = useState(false)
  const [blocks, setBlocks] = useState<LastestBlock[]>([])

  const [isTxLoaded, setTxLoaded] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {

    const loadTxs = async () => {
      setTxLoaded(false)
      const response = await fetch('/api/newtransactions?limit=30')
      if (!response.ok) {
        setTimeout(loadTxs, 2000)
        console.log("Retrying... in 2 seconds")
        return
      }
      setTransactions(await response.json())
      setTxLoaded(true)
    }


    const loadBlocks = async () => {
      setBlocksLoaded(false)
      const response = await fetch('/api/blocks?limit=10')
      if (!response.ok) {
        setTimeout(loadBlocks, 2000)
        console.log("Retrying... in 2 seconds")
        return
      }
      setBlocks(await response.json())
      setBlocksLoaded(true)
    }

    loadBlocks()
    loadTxs()

  }, [])

  function trimAddress(address: string) {
    return address.slice(0, 10) + "..." + address.slice(-4);
  }

  function showSkeleton(isLoaded: boolean) {
    return (
      <Stack display={isLoaded ? 'none' : 'block'}>
        {
          Array.from({ length: 6 }, (_, index) => {
            return (
              <Skeleton key={index} height='60px' isLoaded={isLoaded} />
            )
          })
        }
      </Stack>

    )
  }

  return (
    <>
      <Head>
        <title>Blockchain Explorer</title>
      </Head>

      <div>

        <form action="">
          <Flex marginX={"auto"} alignItems={'stretch'} justifyContent={"center"} gap={"1rem"}>
            <Input type="text" name="search" id="search" placeholder="Search for a block, transaction, or address" size={"lg"} />
            <Button height={"46px"} colorScheme={"blue"}><SearchIcon /></Button>
          </Flex>
        </form>

        <StatGroup borderWidth={1} borderRadius={5} padding={7} marginY={10} display={'flex'} flexWrap={'wrap'} gap={5}>
          <Stat minW={"200px"} colorScheme="red">
            <StatLabel>Ether Price</StatLabel>
            <StatNumber>345,670 $</StatNumber>
          </Stat>

          <Stat minW={"200px"}>
            <StatLabel>Transactions</StatLabel>
            <StatNumber>45</StatNumber>
          </Stat>

          <Stat minW={"200px"}>
            <StatLabel>Last Finalized Block</StatLabel>
            <StatNumber>45</StatNumber>
          </Stat>

          <Stat minW={"200px"}>
            <StatLabel>Last Safe Block</StatLabel>
            <StatNumber>45</StatNumber>
          </Stat>
        </StatGroup>


        <Flex gap={10} justifyContent={'space-between'}>
          <Card className={styles.cardBox}>
            <CardHeader>
              <Heading size='md'>Lastest Blocks</Heading>
            </CardHeader>
            <Divider />

            <CardBody className={styles.cardBody}>

              {showSkeleton(isBlocksLoaded)}

              <Stack divider={<StackDivider />} spacing='4'>
                {
                  isBlocksLoaded && blocks.map((block, index) => {
                    return (
                      <Flex key={index} justifyContent={'space-between'} alignItems={"center"}>
                        <Box>
                          <Heading size='xs' textTransform='uppercase'>
                            Block No: {block.blockNumber}
                          </Heading>
                          <Text pt='2' fontSize='sm'>
                            {block.transactions} Txns
                          </Text>
                        </Box>
                        <Badge fontSize='0.7em' colorScheme='green' p={1.5}>
                          {block.amount} ETH
                        </Badge>
                      </Flex>
                    )
                  })
                }
              </Stack>
            </CardBody>

            <Divider />

            <CardFooter>
              <Button variant='ghost' colorScheme='blue'>
                See more
              </Button>
            </CardFooter>
          </Card>

          <Card className={styles.cardBox}>
            <CardHeader>
              <Heading size='md'>Lastest Transactions</Heading>
            </CardHeader>
            <Divider />

            <CardBody className={styles.cardBody}>

              {showSkeleton(isTxLoaded)}

              <Stack divider={<StackDivider />} spacing='4'>
                {
                  transactions.map((obj, index) => {
                    return (
                      <Flex key={index} justifyContent={'space-between'} alignItems={"center"}>
                        <Box>
                          <Heading size='xs' textTransform='uppercase'>
                            Tx Hash: <a href="">{trimAddress(obj.txHash)}</a>
                          </Heading>
                          <Text pt='2' fontSize='sm'>
                            {trimAddress(obj.from)} <strong>to</strong> {trimAddress(obj.to)}
                          </Text>
                        </Box>
                        <Badge fontSize='0.7em' colorScheme='green' p={1.5}>
                          {obj.amount} ETH
                        </Badge>
                      </Flex>
                    )
                  })
                }
              </Stack>
            </CardBody>

            <Divider />

            <CardFooter>
              <Button variant='ghost' colorScheme='blue'>
                See all
              </Button>
            </CardFooter>
          </Card>
        </Flex>

      </div>

    </>
  )
}


// export async function getServerSideProps() {

//   const blocks = await getLatestBlocks(10)

//   console.log(blocks)
//   return {
//     props: {}
//   }
// }

import { Badge, Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, Heading, Input, Skeleton, Stack, StackDivider, Stat, StatGroup, StatLabel, StatNumber, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/index.module.scss'
import { Block, LastestBlock, Transaction } from '@interfaces/index'
import { useRouter } from 'next/router'


export default function Home() {

  const router = useRouter()

  const [isBlocksLoaded, setBlocksLoaded] = useState(false)
  const [blocks, setBlocks] = useState<LastestBlock[]>([])

  const [isTxLoaded, setTxLoaded] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [isLastestBlockLoaded, setLastestBlockLoaded] = useState(false)
  const [latestBlock, setLastestBlock] = useState<Block>()

  useEffect(() => {

    const timeouts: any[] = []
    const loadTxs = async () => {
      setTxLoaded(false)
      const response = await fetch('/api/newtransactions?limit=30')
      if (!response.ok) {
        const timeout: any = setTimeout(loadTxs, 2000)
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
        const timeout: any = setTimeout(loadBlocks, 2000)
        timeouts.push(timeout)
        console.log("Retrying... in 2 seconds")
        return
      }
      setBlocks(await response.json())
      setBlocksLoaded(true)
    }

    const lastestBlock = async () => {
      setLastestBlockLoaded(false)
      const response = await fetch('/api/lastestBlock')
      if (!response.ok) {
        const timeout: any = setTimeout(lastestBlock, 2000)
        timeouts.push(timeout)
        console.log("Retrying... in 2 seconds")
        return
      }
      setLastestBlock(await response.json())
      setLastestBlockLoaded(true)
    }

    loadBlocks()
    loadTxs()
    lastestBlock()

    return () => {
      timeouts.forEach(timeout => {
        clearTimeout(timeout)
      })
    }

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

  function showBlockSkeleton(isLoaded: boolean) {
    if (!isLoaded) return (
      <>
        <Stat minW={"200px"} colorScheme="red">
          <StatLabel marginBottom={3}>Lastest Block</StatLabel>
          <Skeleton borderRadius={10} height='60px' isLoaded={isLastestBlockLoaded} />
        </Stat>

        <Stat minW={"200px"}>
          <StatLabel marginBottom={3}>Amount</StatLabel>
          <Skeleton borderRadius={10} height='60px' isLoaded={isLastestBlockLoaded} />
        </Stat>
        <Stat minW={"200px"}>
          <StatLabel marginBottom={3}>Transactions</StatLabel>
          <Skeleton borderRadius={10} height='60px' isLoaded={isLastestBlockLoaded} />
        </Stat>

        <Stat minW={"200px"}>
          <StatLabel marginBottom={3}>Gas Used</StatLabel>
          <Skeleton borderRadius={10} height='60px' isLoaded={isLastestBlockLoaded} />
        </Stat>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Ethereum Blockchain Explorer</title>
      </Head>

      <div>
        <StatGroup borderWidth={1} borderRadius={5} padding={7} marginY={10} display={'flex'} flexWrap={'wrap'} gap={5}>

          {showBlockSkeleton(isLastestBlockLoaded)}

          {
            isLastestBlockLoaded && (
              <>
                <Stat minW={"200px"} colorScheme="red">
                  <StatLabel marginBottom={3}>Lastest Block</StatLabel>
                  {
                    isLastestBlockLoaded && <StatNumber>{latestBlock?.blockNumber}</StatNumber>
                  }
                </Stat>

                <Stat minW={"200px"}>
                  <StatLabel marginBottom={3}>Amount</StatLabel>
                  {
                    isLastestBlockLoaded && <StatNumber>{latestBlock?.amount}</StatNumber>
                  }
                </Stat>
                <Stat minW={"200px"}>
                  <StatLabel marginBottom={3}>Transactions</StatLabel>
                  {
                    isLastestBlockLoaded && <StatNumber>{latestBlock?.transactions}</StatNumber>
                  }
                </Stat>

                <Stat minW={"200px"}>
                  <StatLabel marginBottom={3}>Gas Used</StatLabel>
                  {
                    isLastestBlockLoaded && <StatNumber>{latestBlock?.gasUsed}</StatNumber>
                  }
                </Stat>
              </>
            )
          }
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
                      <Flex
                        key={index}
                        justifyContent={'space-between'}
                        onClick={() => router.push(`/block/${block.blockNumber}`)}
                        cursor='pointer'
                        alignItems={"center"}>
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

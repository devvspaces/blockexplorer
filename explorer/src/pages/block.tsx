import { Box, Card, CardBody, CardHeader, Divider, Heading, Stack, StackDivider, Stat, StatGroup, StatLabel, StatNumber, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/index.module.scss'
import { BlockWithTransactionsData, DynamicObject } from '@/interfaces'
import { dynamicLoader } from '@/common/utils/dynamicLoad'
import { showBlockSkeleton, showSkeleton } from '@/components/skeleton'
import { getBoxes } from '@/components/cardBox'

// TODO:
// 1. Show if block is finalized or not
// 2. Use table for transactions
// 3. Show block and transaction age
// 4. Show block height
// 5. Finalize design touches
// 6. Decode extra data
// 7. Cache response
// 8. Get total difficulty
// 9. Get block reward


// TODO: General
// 1. Search by block number, tx hash, block hash, address
// 2. NFT features
// 3. Manage requests so that it's not too much on free api
// 4. Websocket listen to live home page updates and notifications


export default function Home({ blockNumber }: { blockNumber: number }) {

  const [isBlockLoaded, setBlockLoaded] = useState(false)
  const [block, setBlock] = useState<BlockWithTransactionsData>()

  useEffect(() => {
    const loadBlock = async () => {
      return dynamicLoader(
        `/api/block?number=${blockNumber}`,
        setBlockLoaded,
        setBlock,
      )
    }

    loadBlock()
  }, [blockNumber])

  return (
    <>
      <Head>
        <title>Blockchain Explorer - Block {blockNumber}</title>
      </Head>

      <div>
        <StatGroup borderWidth={1} borderRadius={5} padding={7} marginY={10} display={'flex'} flexWrap={'wrap'} gap={5}>

          {showBlockSkeleton(isBlockLoaded, ["Block Number", "Amount", "Transactions", "Gas Used"])}

          {
            isBlockLoaded && block && (
              <>
                <Stat minW={"200px"} colorScheme="red">
                  <StatLabel marginBottom={3}>Lastest Block</StatLabel>
                  <StatNumber>{block.number}</StatNumber>
                </Stat>

                <Stat minW={"200px"}>
                  <StatLabel marginBottom={3}>Amount</StatLabel>
                  <StatNumber>{block.total}</StatNumber>
                </Stat>

                <Stat minW={"200px"}>
                  <StatLabel marginBottom={3}>Transactions</StatLabel>
                  <StatNumber>{block.transactionCount}</StatNumber>
                </Stat>

                <Stat minW={"200px"}>
                  <StatLabel marginBottom={3}>Gas Used</StatLabel>
                  <StatNumber>{block.gasUsed}</StatNumber>
                </Stat>
              </>
            )
          }
        </StatGroup>

        <Box my={"4rem"}>
          {showSkeleton(isBlockLoaded, 4)}
          {
            block && getBoxes({
              hash: block.hash,
              "Parent Hash": block.parentHash,
              timestamp: (new Date(block.timestamp)).toISOString(),
              date: (new Date(block.timestamp)).toDateString(),
              nonce: block.nonce,
              difficulty: block.difficulty,
              "Gas Limit": block.gasLimit,
              miner: block.miner,
              "Extra Data": block.extraData,
              "Base Fee Per Gas": block.baseFeePerGas || 0
            })
          }
        </Box>

        <Card className={styles.cardBox}>
          <CardHeader>
            <Heading size='md'>Transactions</Heading>
          </CardHeader>
          <Divider />

          <CardBody className={styles.cardBody}>

            {showSkeleton(isBlockLoaded)}

            <Stack divider={<StackDivider/>} spacing='4'>
              {
                block?.transactions.map((obj, index) => {
                  return (
                    <Box key={index}>
                      <Heading size='md'>
                        Hash<br/><a href="#">{obj.hash}</a>
                      </Heading>

                      <Box pt='2'>
                        <Text fontSize='sm' fontWeight={"semibold"}>From:</Text>
                        <Text fontSize='sm'>{obj.from}</Text>
                      </Box>

                      <Box pt='2'>
                        <Text fontSize='sm' fontWeight={"semibold"}>To:</Text>
                        <Text fontSize='sm'>{obj.to}</Text>
                      </Box>
                    </Box>
                  )
                })
              }
            </Stack>
          </CardBody>
        </Card>

      </div>

    </>
  )
}


export async function getServerSideProps({ query }: { query: DynamicObject }) {
  return {
    props: {
      blockNumber: query.block.toString()
    }
  }
}

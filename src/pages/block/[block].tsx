import { Box, Card, CardBody, CardHeader, Divider, Flex, Heading, Stack, StackDivider, Stat, StatGroup, StatLabel, StatNumber, Text, useColorModeValue } from '@chakra-ui/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '@styles/index.module.scss'
import { dynamicLoader } from '@common/utils/dynamicLoad'
import { showBlockSkeleton, showSkeleton } from '@components/skeleton'
import { getBoxes } from '@components/cardBox'
import { BlockWithTransactionsData } from '@interfaces/index'
import { GetServerSideProps } from 'next'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import { hex_to_ascii } from '@common/utils/string'
import { trimAddress } from '@common/utils'
import { readableTimestamp } from '@common/utils/date'


export default function Page({ blockNumber }: { blockNumber: number }) {

  const [isBlockLoaded, setBlockLoaded] = useState(false)
  const [block, setBlock] = useState<BlockWithTransactionsData>()
  const [dateNow, setDateNow] = useState<number>(new Date().getTime());

  useEffect(() => {
    const loadBlock = async () => {
      return dynamicLoader(
        `/api/block?number=${blockNumber}`,
        setBlockLoaded,
        setBlock,
      )
    }

    loadBlock()

    const interval = setInterval(() => {
      setDateNow(new Date().getTime())
    }, 1000);

    return () => clearInterval(interval);
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
                  <StatLabel marginBottom={3}>Block</StatLabel>
                  <StatNumber>{block.number}</StatNumber>
                </Stat>

                <Stat minW={"200px"}>
                  <StatLabel marginBottom={3}>Amount (ETH)</StatLabel>
                  <StatNumber>{block.total}</StatNumber>
                </Stat>

                <Stat minW={"200px"}>
                  <StatLabel marginBottom={3}>Transactions</StatLabel>
                  <StatNumber>{block.transactionCount}</StatNumber>
                </Stat>

                <Stat minW={"200px"}>
                  <StatLabel marginBottom={3}>Gas Used</StatLabel>
                  <StatNumber>{block.gasUsed.toLocaleString()}</StatNumber>
                </Stat>
              </>
            )
          }
        </StatGroup>

        <Box
          my={"4rem"}
          gap={10}
          bg={useColorModeValue('gray.50', 'gray.900')}
          rounded='xl'
          padding={4}
        >
          {showSkeleton(isBlockLoaded, 4)}

          {
            (isBlockLoaded && block) && (
              <>
                {
                  getBoxes({
                    status: block.finalized ? "Finalized" : "Unfinalized",
                    elapse: `${readableTimestamp(dateNow - (block.timestamp * 1000))} ago`,
                    timestamp: (new Date(block.timestamp * 1000)).toUTCString(),
                  })
                }
                <Divider mb={4} />
                {
                  getBoxes({
                    difficulty: block.difficulty,
                    "Gas Limit": block.gasLimit.toLocaleString(),
                    miner: block.miner,
                    "Extra Data": hex_to_ascii(block.extraData),
                    "Base Fee Per Gas": `${block.baseFeePerGas || 0} ETH`
                  })
                }<Divider mb={4} />
                {
                  getBoxes({
                    hash: block.hash,
                    "Parent Hash": block.parentHash,
                    nonce: block.nonce,
                  })
                }
              </>
            )
          }
        </Box>

        <Box>

          <Heading size='md' mb={6}>Transactions</Heading>

          {showSkeleton(isBlockLoaded, 1)}

          {
            isBlockLoaded && (
              <TableContainer
                border={'1px'}
                rounded={'xl'}
                borderColor={'gray.600'}
              >
                <Table variant='striped'>
                  <TableCaption>Block Transactions</TableCaption>
                  <Thead>
                    <Tr>
                      <Th py={6}>Hash</Th>
                      <Th>From</Th>
                      <Th>To</Th>
                      <Th>Value</Th>
                      <Th>Confirmations</Th>
                    </Tr>
                  </Thead>
                  <Tbody>

                    {
                      block && block.transactions.map((obj, index) => {
                        return (
                          <Tr key={index}>
                            <Td>{trimAddress(obj.hash)}</Td>
                            <Td>{trimAddress(obj.from || "")}</Td>
                            <Td>{trimAddress(obj.to || "")}</Td>
                            <Td>{obj.amount} {obj.currency}</Td>
                            <Td>{obj.confirmations}</Td>
                          </Tr>
                        )
                      })
                    }
                  </Tbody>
                </Table>
              </TableContainer>
            )
          }
        </Box>

      </div>

    </>
  )
}


export const getServerSideProps: GetServerSideProps<{
  blockNumber: string
}> = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    }
  }
  const { block } = params
  return {
    props: {
      blockNumber: block as string
    }
  }
}

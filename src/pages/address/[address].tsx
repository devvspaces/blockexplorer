import { Box, Card, CardBody, CardHeader, Divider, Image, Flex, Heading, Stack, StackDivider, Stat, StatGroup, StatLabel, StatNumber, Text, useColorModeValue, HStack } from '@chakra-ui/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { dynamicLoader } from '@common/utils/dynamicLoad'
import { showBlockSkeleton, showSkeleton } from '@components/skeleton'
import { AddressData } from '@interfaces/index'
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
import { getETHPrice } from '@common/utils/eth'


export default function Page({ address }: { address: string }) {

  const [isAddressLoaded, setAddressLoaded] = useState(false)
  const [addressData, setAddressData] = useState<AddressData>()
  const [ethPrice, setEthPrice] = useState(0)

  useEffect(() => {
    const loadBlock = async () => {
      return dynamicLoader(
        `/api/address?address=${address}`,
        setAddressLoaded,
        setAddressData,
      )
    }

    const loadETHPrice = async () => {
      setEthPrice(await getETHPrice())
    }

    loadBlock()
    loadETHPrice()
  }, [address])

  return (
    <>
      <Head>
        <title>Blockchain Explorer - Address {address}</title>
      </Head>

      <div>

        <Heading size='md' mb={3}>Address</Heading>
        <Text mb={6}>{address}</Text>

        <StatGroup borderWidth={1} borderRadius={5} padding={7} marginY={10} display={'flex'} flexWrap={'wrap'} gap={5}>

          {showBlockSkeleton(isAddressLoaded, ["ETH Balance", "ETH Value"])}

          {
            isAddressLoaded && addressData && (
              <>
                <Stat minW={"200px"}>
                  <StatLabel marginBottom={3}>ETH Balance</StatLabel>
                  <StatNumber>{addressData.balance.toLocaleString()}</StatNumber>
                </Stat>

                <Stat minW={"200px"}>
                  <StatLabel marginBottom={3}>ETH Value</StatLabel>
                  <StatNumber>${(parseFloat(addressData.balance) * ethPrice).toLocaleString()}</StatNumber>
                </Stat>

                {/* <Stat minW={"200px"}>
                  <StatLabel marginBottom={3}>Transactions</StatLabel>
                  <StatNumber>{addressData.transactions.length.toLocaleString()}</StatNumber>
                </Stat> */}
              </>
            )
          }
        </StatGroup>

        <Box>

          <Heading size='md' mb={6}>Token Holdings</Heading>

          {showSkeleton(isAddressLoaded, 1)}

          {
            isAddressLoaded && (
              <TableContainer
                border={'1px'}
                rounded={'xl'}
                borderColor={'gray.600'}
              >
                <Table variant='striped'>
                  <TableCaption>Token Holdings</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Symbol</Th>
                      <Th>Balance</Th>
                      <Th>Contract Address</Th>
                    </Tr>
                  </Thead>
                  <Tbody>

                    {
                      addressData && addressData.tokens.map((obj, index) => {
                        return (
                          <Tr key={index}>
                            <Td>
                              <HStack>
                                {
                                  obj.logo ? (
                                    <Image src={obj.logo} boxSize="30px" alt={obj.name} />
                                  ) : (
                                    <Image src={'/empty-token.webp'} boxSize="30px" alt={obj.name} />
                                  )
                                }
                                <Text>{obj.name}</Text>
                              </HStack>
                            </Td>
                            <Td>{obj.symbol}</Td>
                            <Td>{obj.balance}</Td>
                            <Td>{obj.contractAddress}</Td>
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

        {/* <Box mt={'3rem'}>

          <Heading size='md' mb={6}>Transactions</Heading>

          {showSkeleton(isAddressLoaded, 1)}

          {
            isAddressLoaded && (
              <TableContainer
                border={'1px'}
                rounded={'xl'}
                borderColor={'gray.600'}
              >
                <Table variant='striped'>
                  <TableCaption>Transactions</TableCaption>
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
                      addressData && addressData.transactions.map((obj, index) => {
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
        </Box> */}

      </div>

    </>
  )
}


export const getServerSideProps: GetServerSideProps<{
  address: string
}> = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    }
  }
  const { address } = params as { address: string };
  return {
    props: {
      address
    }
  }
}

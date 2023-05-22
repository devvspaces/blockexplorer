import { Box, Divider, Heading, useColorModeValue } from '@chakra-ui/react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { dynamicLoader } from '@common/utils/dynamicLoad'
import { showSkeleton } from '@components/skeleton'
import { getBoxes } from '@components/cardBox'
import { TxType } from '@interfaces/index'
import { GetServerSideProps } from 'next'
import { readableTimestamp } from '@common/utils/date'


export default function Page({ hash }: { hash: number }) {

  const [isTxLoaded, setTxLoaded] = useState(false)
  const [tx, setTx] = useState<TxType>()
  const [dateNow, setDateNow] = useState<number>(new Date().getTime());

  useEffect(() => {
    const load = async () => {
      return dynamicLoader(
        `/api/tx?hash=${hash}`,
        setTxLoaded,
        setTx,
      )
    }

    load()

    const interval = setInterval(() => {
      setDateNow(new Date().getTime())
    }, 1000);

    return () => clearInterval(interval);
  }, [hash])

  return (
    <>
      <Head>
        <title>Blockchain Explorer - Transaction {hash}</title>
      </Head>

      <div>

        <Heading size={'lg'} mb={8}>
          Transaction Details
        </Heading>

        <Box
          gap={10}
          bg={useColorModeValue('gray.50', 'gray.900')}
          rounded='xl'
          padding={4}
        >
          {showSkeleton(isTxLoaded, 4)}

          {
            (isTxLoaded && tx) && (
              <>
                {
                  getBoxes({
                    "Transaction Hash": tx.hash,
                    block: tx.blockNumber,
                    confirmations: tx.confirmations,
                  })
                }
                <Divider mb={4} />
                {
                  getBoxes({
                    status: tx.finalized ? "Finalized" : "Unfinalized",
                    elapse: `${readableTimestamp(dateNow - (tx.timestamp * 1000))} ago`,
                    timestamp: (new Date((tx.timestamp || 0) * 1000)).toUTCString(),
                  })
                }
                <Divider mb={4} />
                {
                  getBoxes({
                    from: tx.from,
                    to: tx.to,
                    "Contract Address": tx.contractAddress,
                  })
                }
                <Divider mb={4} />
                {
                  getBoxes({
                    value: `${tx.amount} ${tx.currency}`,
                    "Transaction Fee": `${tx.txFeeFormat.eth} ETH`,
                    "Gas price": `${tx.gasPriceFormat.gwei} Gwei (${tx.gasPriceFormat.eth} ETH)`,
                    "Gas Limit & Usage": `${tx.gasLimit} / ${tx.gasUsed} (${tx.gasUsedPercent}%)`,
                  })
                }
                <Divider mb={4} />
                {
                  getBoxes({
                    "Txn type": `${tx.type} ${tx.typeFormat && `(${tx.typeFormat})`}`,
                    nonce: tx.nonce,
                    "Position in block": tx.transactionIndex,
                  })
                }
              </>
            )
          }
        </Box>

      </div>

    </>
  )
}


export const getServerSideProps: GetServerSideProps<{
  hash: string
}> = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    }
  }
  const { hash } = params
  return {
    props: {
      hash: hash as string
    }
  }
}

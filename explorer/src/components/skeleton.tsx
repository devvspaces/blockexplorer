import { Skeleton, Stack, Stat, StatLabel } from "@chakra-ui/react"

/**
 * 
 * @param isLoaded if to show skeleton or not
 * @param amount amount of skeleton to show
 * @returns 
 */
export function showSkeleton(isLoaded: boolean, amount = 6) {
  return (
    <Stack display={isLoaded ? 'none' : 'block'}>
      {
        Array.from({ length: amount }, (_, index) => {
          return (
            <Skeleton key={index} height='60px' isLoaded={isLoaded} />
          )
        })
      }
    </Stack>
  )
}

/**
 * Shows blocks of stat
 * @param isLoaded if block is loaded or not
 * @param blocks names of each block
 */
export function showBlockSkeleton(isLoaded: boolean, blocks: string[]) {
    if (!isLoaded) return (
      <>
        {
          blocks.map((block, index) => (
            <Stat key={index} minW={"200px"}>
              <StatLabel marginBottom={3}>{block}</StatLabel>
              <Skeleton borderRadius={10} height='60px' isLoaded={false} />
            </Stat>
          ))
        }
      </>
    )
  }
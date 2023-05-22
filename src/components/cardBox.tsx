import { DynamicObject } from "@interfaces/index";
import { Box, Text } from "@chakra-ui/react";
import { capitalizeString } from "@common/utils/string";

export const getBoxes = (data: DynamicObject) => {
  return Object.keys(data).map((key, index) => {
    return (
      <Box pb='1rem' key={index}>
        <Text fontSize='md' fontWeight={"semibold"}>{capitalizeString(key)}:</Text>
        <Text fontSize='md'>{data[key]}</Text>
      </Box>
    )
  })
}
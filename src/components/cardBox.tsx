import { DynamicObject } from "@/interfaces";
import { Box, Text } from "@chakra-ui/react";

export const getBoxes = (data: DynamicObject) => {
  return Object.keys(data).map((key, index) => {
    return (
      <Box pt='2' key={index}>
        <Text fontSize='sm' fontWeight={"semibold"}>{key}:</Text>
        <Text fontSize='sm'>{data[key]}</Text>
      </Box>
    )
  })
}
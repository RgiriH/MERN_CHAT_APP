import { VStack, Box } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
    return (
      <VStack spacing={4} align="stretch" marginTop="10px">
        <Box h="70px" bg="#DCDCDC" borderRadius="10px" margin="5px"></Box>
        <Box h="70px" bg="#DCDCDC" borderRadius="10px" margin="5px"></Box>
        <Box h="70px" bg="#DCDCDC" borderRadius="10px" margin="5px"></Box>
        <Box h="70px" bg="#DCDCDC" borderRadius="10px" margin="5px"></Box>
        <Box h="70px" bg="#DCDCDC" borderRadius="10px" margin="5px"></Box>
        <Box h="70px" bg="#DCDCDC" borderRadius="10px" margin="5px"></Box>
        <Box h="70px" bg="#DCDCDC" borderRadius="10px" margin="5px"></Box>
      </VStack>
    );
}

export default ChatLoading 
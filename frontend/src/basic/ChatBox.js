import React, { useContext } from "react";
import { chartContext } from "../context/chartProvider.js";
import {Box} from "@chakra-ui/layout"
import SingleChat from "./SingleChat.js";
export const ChatBox = ({ setChatChanged }) => {
  const { user, selectedChat } = useContext(chartContext);
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDirection="column"
      padding="3"
      borderRadius="10px"
      borderWidth="5px"
      w={{ base: "100%", md: "68%" }}
      backgroundColor="white"
      alignItems="center"
    >
      <SingleChat fun = {setChatChanged}></SingleChat>
    </Box>
  );
};

export default ChatBox;
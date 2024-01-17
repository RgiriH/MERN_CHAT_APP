import React from "react";
import { useState } from "react";
import { chartContext } from "../context/chartProvider";
import { useContext } from "react";
import SideDrawer from "../basic/SideDrawer";
import MyChat from "../basic/MyChat";
import ChatBox from "../basic/ChatBox";
import {Box} from "@chakra-ui/layout"
const Chat = () => {

  const {user} = useContext(chartContext)
  const [chatChanged, setChatChanged] = useState(false)
  
    return (
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          padding="10px"
          w="100%"
          h="91.5vh"
        >
          {user && <MyChat chatChanged={ chatChanged} />}
          {user && <ChatBox setChatChanged = {setChatChanged} />}
        </Box>
      </div>
    );
}

export default Chat
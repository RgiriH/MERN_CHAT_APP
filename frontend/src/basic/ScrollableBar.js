import React, { useState, useEffect , useContext} from "react";
import ScrollableFeed from "react-scrollable-feed";
import { Box } from "@chakra-ui/layout"
import { Tooltip , Avatar , Text} from "@chakra-ui/react";

import { chartContext } from "../context/chartProvider";


const ScrollableBarComponent = ({ messages }) => {
   
  const {user} = useContext(chartContext)
  const isSameSender = (m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined
      ) &&
      messages[i].sender._id !== userId
    )
  };

  const isLastMessage = ( i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    )
  };




  return (
    <ScrollableFeed
      
    >
      {messages && messages.map((m , i) => { 
        return (
          <Text
            display="flex"
            key={m._id}
            marginRight={m._id === user._id ? "100%" : "0%"}
            marginBottom={4}
            padding="2px"
            alignItems="center"
            alignContent="center"
            textAlign="center"
          >
            {isSameSender(m, i, user._id) || isLastMessage(i, user._id) ? (
              <Tooltip label={m?.sender?.name}>
                <Avatar
                  mt="7px"
                  mr={1}
                  width="35px"
                  height="35px"
                  name={m?.sender?.name}
                  src={m?.sender?.pic}
                  cursor="pointer"
                  alignSelf="center"
                  padding="2px"
                  marginBottom={1}
                />
              </Tooltip>
            ) : (
              <>
                {m.sender._id !== user._id && (
                  <Box width="35px" height="35px"></Box>
                )}
              </>
            )}
            <Text
              backgroundColor={
                m.sender._id !== user._id ? "#F0E68C" : "#FFC72C"
              }
              padding="7px"
              borderRadius={10}
              textAlign="center"
              minWidth="40px"
              minHeight="40px"
              maxWidth="80%"
              marginLeft={m.sender._id === user._id ? "auto" : "none"}
            >
              {m.content}
            </Text>
          </Text>
        );
      })}
    </ScrollableFeed>
  )
};

export default ScrollableBarComponent;
import React, {useState , useEffect} from "react";
import { useContext } from "react";
import { chartContext } from "../context/chartProvider";
import { useToast } from "@chakra-ui/react"
import axios from "axios";
import { Box } from "@chakra-ui/layout"
import { Text, Button , Stack , Avatar} from "@chakra-ui/react"
import {AddIcon} from "@chakra-ui/icons"
import ChatLoading from "../components/authentication/ChatLoding";
import GroupChatModel from "./GroupChatModel";

export const MyChat = ({chatChanged}) => {
   
    const [loggedUser, setLoggedUser] = useState()
   const { user, setSelectedChat, selectedChat, chats, setChats } =
       useContext(chartContext);
    
    const toast = useToast()

    const fetchChat = async() => {
        try {
            const config = {
              headers: {
                Authorization: `Bearer ${user?.jwtToken}`,
              },
            };
            const { data } = await axios.get("/api/chat", config);
            
          setChats(data)
          
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("user")))
        fetchChat()
    }, [chatChanged])

    const findUser = (arr) => {
       return arr?.find(user1 => user1._id !== user._id)
    }

    return (
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        background="white"
        borderRadius="5px"
        padding="3px"
        width={{ base: "100%", md: "31%" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          padding="3px"
          width="100%"
          alignItems="center"
          fontFamily="work sans"
          fontSize={{ base: "28px", md: "20px" }}
          borderWidth=".5px"
        >
          <Text>My Chats</Text>
          <GroupChatModel fun = {chatChanged}>
            <Button rightIcon={<AddIcon></AddIcon>}>New Group Chat</Button>
          </GroupChatModel>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          p={"3"}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          overflowY="hidden"
        >
          {chats.length > 0 ? (
            
            <Stack overflowY="auto">
              {chats?.map((chat) => {
                
                return (
                  <Box
                    key={chat._id}
                    padding="5px"
                    display="flex"
                    h="70px"
                    bg={selectedChat === chat ? "#9933" : "#DCDCDC"}
                    borderRadius="10px"
                    marginTop="10px"
                    justifyContent="space-around"
                    _hover={{ background: "#9933" }}
                    cursor="pointer"
                    onClick={() => {
                      setSelectedChat(chat)
                    }}
                  >
                    <Avatar
                      name={chat?.chatName}
                      src={chat.isGroupChat ? "" : findUser(chat.users)?.pic}
                      alignSelf="center"
                    />
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      width="70%"
                    >
                      <Text fontWeight="bolder" fontFamily="serif">
                        {chat?.isGroupChat ? chat?.chatName : findUser(chat.users)?.name}
                      </Text>
                      <Text
                        fontWeight="100"
                        whiteSpace="nowrap"
                        overflow="hidden"
                      >
                      last message : {chat?.latestMessage?.content || "No message has started yet"}
                      </Text>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading></ChatLoading>
          )}
        </Box>
      </Box>
    );
}

export default MyChat;
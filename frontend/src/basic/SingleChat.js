import React, { useContext , useState , useEffect} from "react";
import { chartContext } from "../context/chartProvider";
import { Box } from "@chakra-ui/layout"
import {ArrowBackIcon} from "@chakra-ui/icons"
import { Text, IconButton, Spinner, FormControl , Input } from "@chakra-ui/react"
import ProfileModel from "./ProfileModel.js"
import GroupChangeModel from "./GroupChangeComponent";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios"
import ScrollableBarComponent from "./ScrollableBar";
import io from "socket.io-client"


const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

const SingleChat = ({ fun }) => {
  
  const { user, selectedChat, setSelectedChat } = useContext(chartContext);
  const [groupName, setGroupName] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sendMessageLoading, setSendMessageLoading] = useState("");
  const [socketConnected, setSocketConnected] = useState(false)
 
  
  useEffect(() => { setGroupName(selectedChat?.chatName) }, [selectedChat])
  
    
  const findUser = (arr) => {
      return arr?.find((user1) => user1._id !== user._id);
  };
  
  const getAllChats = async () => {
    
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.jwtToken}`,
        }
      }
     const { data } = await axios.get(
       `/api/message/${selectedChat._id}`,
       config
     );
      
      setMessages(data)
      setLoading(false);
      socket.emit("join chat", selectedChat._id)
      fun(pre => !pre)
    } catch (error) {
      setLoading(false);
      alert("internal error")
    }
    

  }

  useEffect(() => {
    getAllChats()
    selectedChatCompare = selectedChat;
  }, [selectedChat])
  
  const sendMessage = async (e) => {
    
    if (e.key === "Enter" && newMessage !== "") {
      setSendMessageLoading(true)
      try {
        const config = {
          headers: {
            "Content-type": "application/Json",
            Authorization: `Bearer ${user?.jwtToken}`,
          }
        }
        setNewMessage("");
        const { data } = await axios.post("/api/message", {
          content: newMessage,
          chatId : selectedChat._id
        }, config)
        
        setMessages((pre) => [...pre, data]);
        setSendMessageLoading(false)
        socket.emit("new message",data);
        fun(pre => !pre)
      }
      catch (error) {
        alert("internal Error")
        setSendMessageLoading(false)
      }
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on("connected", () => {
      setSocketConnected(true)
    });
    
  }, [])

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {

      if (!selectedChatCompare || selectedChatCompare._id != newMessage.chat._id) {
         //notifiy
      }
      
      else {
        setMessages([...messages, newMessage])
        fun(pre => !pre)
     }

    });
  })

 
  const typingHandler = async(e) => {
    setNewMessage(e.target.value) 
    
    
  }
   
    return (
      <>
        {selectedChat ? (
          <>
            <Text
              fontSize={{ base: "28px", md: "36px" }}
              padding="3px"
              width="100%"
              fontFamily="sans-serif"
              display="flex"
              alignItems="center"
              justifyContent={{ base: "space-between" }}
              alignContent={"center"}
              marginBottom="7px"
            >
              <IconButton
                display={{ base: "flex", md: "none" }}
                onClick={() => setSelectedChat(null)}
              >
                <ArrowBackIcon></ArrowBackIcon>
              </IconButton>
              {!selectedChat.isGroupChat ? (
                <>
                  {findUser(selectedChat.users).name}
                  <ProfileModel
                    user={findUser(selectedChat.users)}
                  ></ProfileModel>
                </>
              ) : (
                <>
                  {groupName?.toUpperCase()}
                  <GroupChangeModel fun={fun} changeGroupName={setGroupName}>
                    <IconButton d="flex" icon={<ViewIcon />}></IconButton>
                  </GroupChangeModel>
                </>
              )}
            </Text>
            <Box
              display="flex"
              flexDirection="column"
              padding={1}
              w={"100%"}
              h={"100%"}
              backgroundColor="#E8E8E8"
              overflowX={"hidden"}
              borderRadius={"6px"}
            >
              {loading ? (
                <Spinner
                  size={"xl"}
                  w={20}
                  h={20}
                  margin="auto"
                  alignSelf="center"
                ></Spinner>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  overflowY="scroll"
                  scrollbar-width="none"
                  width="100%"
                  height="100%"
                  padding="5px"
                  paddingBottom="10px"
                  borderRadius="5px"
                  
                  marginBottom="3px"
                >
                  <ScrollableBarComponent
                    messages={messages}
                    ></ScrollableBarComponent>
                    {sendMessageLoading ? <Spinner></Spinner> : <></>}
                </Box>
              )}

              <FormControl onKeyDown={sendMessage}>
                <Input
                  variant="filled"
                  placeholder="type the message here..."
                  value={newMessage}
                  onChange={typingHandler}
                />
              </FormControl>
            </Box>
          </>
        ) : (
          <Box
            fontSize="1.5rem"
            fontFamily="sans-serif"
            Height="100%"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            //marginTop="40%"
          >
            Click on any Chats to Start Chating...
          </Box>
        )}
      </>
    );
}

export default SingleChat
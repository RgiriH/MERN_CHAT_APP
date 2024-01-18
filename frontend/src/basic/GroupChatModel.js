import React , {useState , useContext} from 'react'
import { Box } from "@chakra-ui/layout"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  VStack,
  HStack,
  Avatar,
  Text
} from "@chakra-ui/react";
import {CloseIcon} from "@chakra-ui/icons"
import axios from 'axios';
import {chartContext} from "../context/chartProvider.js"

const GroupChatModel = ({ children , fun}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupName, setGroupName] = useState("");
    const [member, setMember] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [finalList, setfinalList] = useState([]);
    const { user, setSelectedChat, chats, setChats } = useContext(chartContext);
    const [loading , setLoading] = useState(false)
    const getUser = async () => {
      setGroupMembers([]);
      setLoading(true)
        if (!member) return;
        
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.jwtToken}`,
                },
            };
             
            const { data } = await axios.get(
                `/api/user?search=${member}`,
                config
            );
          setGroupMembers(data)
          setLoading(false)

        } catch (error) {
          alert("internal error accured")
          setLoading(false)
        }
    

    }


    const addMembers = (Member) => {
        if (!finalList.find((val) => val._id === Member._id)) {
              setfinalList((pre) => [Member , ...pre])
        } 
       
    }


    const removeMembers = (Member) => {
        setfinalList((pre) => pre.filter(({_id}) => {
          return _id !== Member._id
      }))
    };

  const creatGroup = async () => {
      
      if (!groupName) {
        alert("Group name is required")
        return;
      }
      if (finalList.length < 2) {
        alert("need atleast two users to creat group");
        return;
      }
      setLoading(true)
      try {
        const config = {
          headers: {
            "Content-type": "application/Json",
            Authorization: `Bearer ${user?.jwtToken}`,
          },
        };

        let { data } = await axios.post("/api/chat/group", {
          name: groupName,
          users : JSON.stringify(finalList?.map(u => u._id))
        }, config)
        
   
          setChats((pre) => [data[0] , ...pre])
          setSelectedChat(data[0])
          handleClose()
        
      } catch (error) {
        alert("server error accured")
      }
    setLoading(false)
    }
  
  const handleClose = () => {
    setGroupMembers([])
    setGroupName("")
    setfinalList([])
    setMember("")
    onClose()
  }

    return (
      <Box paddingBottom="4px" onClick={onOpen}>
        {children}
        <Modal isOpen={isOpen} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Creat New Group</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack>
                <Box
                  display={finalList.length > 0 ? "flex" : "none"}
                  width="100%"
                  maxHeight="50px"
                  overflowY="auto"
                  flexDirection="row"
                  padding="10px"
                >
                  {finalList &&
                    finalList.map((Member) => {
                      return (
                        <Box
                          key={Member._id}
                          display="flex"
                          flexDirection="row"
                          marginRight="5px"
                          backgroundColor="#696969"
                          borderRadius="5px"
                          padding="2px 5px 5px 5px"
                          alignContent="center"
                          textAlign="center"
                          maxWidth="100%"
                        >
                          <Text
                            marginBottom="5px"
                            marginRight="5px"
                            minWidth="100px"
                          >
                            {Member.name}
                          </Text>
                          <Button
                            height="25px"
                            width="20px"
                            color="red"
                            background="#bebebe"
                            onClick={() => removeMembers(Member)}
                           
                          >
                            <CloseIcon />
                          </Button>
                        </Box>
                      );
                    })}
                </Box>
                <Input
                  placeholder="enter chat name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <HStack width="100%">
                  <Input
                    placeholder="search user"
                    value={member}
                    onChange={(e) => setMember(e.target.value)}
                  />
                  <Button onClick={getUser} isLoading = {loading} loadingText = "Searching">search</Button>
                </HStack>

                <Box overflowY="auto" maxHeight="150px" width="100%">
                  {groupMembers &&
                    groupMembers.map((node) => {
                      return (
                        <Box
                          onClick={() => addMembers(node)}
                          padding="10px"
                          key={node._id}
                          width="100%"
                          maxHeight ="100px"
                          display="flex"
                          justifyContent="space-between"
                          overflow="hidden"
                          alignContent="center"
                          borderRadius="5px"
                          bg="#DCDCDC"
                          marginTop="10px"
                          _hover={{ background: "#9933" }}
                          cursor="pointer"
                        >
                          <Avatar
                            src={node?.pic}
                            name={node?.name}
                            alignContent="center"
                          ></Avatar>
                          <Box
                            display="flex"
                            flexDirection="column"
                            flexBasis="70%"
                            alignContent="center"
                          >
                            <Text
                              textAlign="center"
                              fontFamily="sans-serif"
                              fontWeight="600"
                            >
                              Name : {node?.name}
                            </Text>
                            <Text textAlign="center" fontFamily="serif">
                              Email : {node?.email}
                            </Text>
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={creatGroup}
                isLoading={loading}
                loadingText = "Creating"
              >
                Creat Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
    
}

export default GroupChatModel
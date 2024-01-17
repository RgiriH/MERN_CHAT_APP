import React, { useEffect, useState, useContext } from "react";
import { Box } from "@chakra-ui/layout";
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
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { chartContext } from "../context/chartProvider.js";
import ProfileModel from "./ProfileModel.js";
import ConformWindow from "./ConformWindow.js";


const GroupChangeModel = ({ children, fun, changeGroupName }) => {
  const { user, setSelectedChat, chats, setChats , selectedChat } = useContext(chartContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [member, setMember] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [finalList, setfinalList] = useState(
    []
  );

  useEffect(() => {
      setfinalList(selectedChat.users)
  }, [selectedChat])
  
  const [loading, setLoading] = useState(false);

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

      const { data } = await axios.get(`/api/user?search=${member}`, config);
      setGroupMembers(data);
    } catch (error) {
      alert("internal error accured");
    }
    setLoading(false)
  };

  const addMembers = async (Member) => {
    setLoading(true)
    if (!finalList.find((val) => val._id === Member._id)) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.jwtToken}`,
          },
        };

        const { data } = await axios.put(
          `/api/chat/add`,
          {
            groupId: selectedChat._id,
            userId: Member._id,
          },
          config
        );

        if (data) {
          setfinalList((pre) => [Member, ...pre]);
          fun(pre => !pre)
        }
        setLoading(false)
      } catch (error) {
        alert("internal error accured");
      }
    } else {
      alert("user already present");
      setLoading(false);
    }
  };

  const removeMembers = async (Member) => {
    setLoading(true)
    try {
      const config = {
        headers: {
          "Content-type": "application/Json",
          Authorization: `Bearer ${user?.jwtToken}`,
        },
      };

      let { data } = await axios.put(
        "/api/chat/remove",
        {
          groupId: selectedChat._id,
          userId: Member._id,
        },
        config
      );

      setfinalList((pre) =>
        pre.filter(({ _id }) => {
          return _id !== Member._id;
        })
       
      );
       fun((pre) => !pre);
      setLoading(false)
    } catch (error) {
      alert("server error accured");
     setLoading(false)
    }
  };

  const leaveGroup = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          "Content-type": "application/Json",
          Authorization: `Bearer ${user?.jwtToken}`,
        },
      };

      let { data } = await axios.put(
        "/api/chat/remove",
        {
          groupId: selectedChat._id,
          userId: user._id,
        },
        config
      );
      setLoading(false)
      fun((pre) => !pre);
      setSelectedChat("");
      onClose();
    } catch (error) {
      alert("server error accured");
      setLoading(false);
    }
  };

  const changeGroupNameFun = async () => {
    if (!groupName) {
      alert("provide new Group name to change");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/Json",
          Authorization: `Bearer ${user?.jwtToken}`,
        },
      };

      let { data } = await axios.put(
        "/api/chat/rename",
        {
          id: selectedChat._id,
          newName: groupName,
        },
        config
      );

      if (data) changeGroupName(groupName);
      fun(pre => !pre)
      handleClose();
    } catch (error) {
      alert("server error accured");
    }
  };

  const handleClose = () => {
    setGroupName("")
    setMember("")
    setGroupMembers([])
      onClose()
  }

  const changeAdmin = async (Member) => {
   const config = {
     headers: {
       "Content-type": "application/Json",
       Authorization: `Bearer ${user?.jwtToken}`,
     },
   };
    setLoading(true)
    try {
       const { data } = await axios.put(
         "/api/chat/changeAdmin",
         {
           groupId: selectedChat._id,
           newAdminId: Member._id,
         },
         config
       );
      if (data) {
        fun(pre => !pre);
        setSelectedChat(data[0])
        
      }
    } catch (error) {
      alert(error.message)
      
    }
    setLoading(false)
  }
  return (
    <Box paddingBottom="4px" onClick={onOpen}>
      {children}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Group Info -Admin(
            {selectedChat.groupAdmin._id === user._id ? "you" : selectedChat.groupAdmin.name})
          </ModalHeader>
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
                {selectedChat && 
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
                        <ProfileModel user={Member} flag={selectedChat.groupAdmin._id === user._id ?
                          true : false}
                          fun={changeAdmin}
                          val={Member}
                          loading = {loading}
                        >
                          <Text
                            marginBottom="5px"
                            marginRight="5px"
                            maxWidth="100%"
                            cursor="pointer"
                            minWidth="100px"
                          >
                            {user?._id === Member._id ? "You" : Member.name}
                          </Text>
                        </ProfileModel>
                        {selectedChat?.groupAdmin._id === user._id && user?._id !== Member._id ?(
                          <ConformWindow
                            fun={removeMembers}
                            val={Member}
                            loading={loading}
                            title={`conform to remove ${Member.name}`}
                          >
                            <Button
                              height="25px"
                              width="20px"
                              color="red"
                              background="#bebebe"
                              marginBottom="2px"
                            >
                              <CloseIcon />
                            </Button>
                          </ConformWindow>
                        ) : (
                          <></>
                        )}
                      </Box>
                    );
                  })}
              </Box>

              {selectedChat?.groupAdmin._id === user._id && (
                <HStack w="100%">
                  <Input
                    placeholder="change the name of group"
                    value={groupName}
                    _disabled={selectedChat?.groupAdmin._id === user._id}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  {groupName &&
                  <ConformWindow
                    fun={changeGroupNameFun}
                    loading={loading}
                    title = {`conform to change Group name to "${groupName}"`}
                  >
                    <Button
                      colorScheme="blue"
                      w="100%"
                    >
                      change Name
                    </Button>
                  </ConformWindow>
              }
                </HStack>
              )}
              {selectedChat?.groupAdmin._id === user._id && (
                <HStack width="100%">
                  <Input
                    placeholder="search user to add to group"
                    value={member}
                    onChange={(e) => setMember(e.target.value)}
                    
                  />
                  <Button
                    onClick={getUser}
                    isLoading = {loading}
                    
                  >
                    search
                  </Button>
                </HStack>
              )}

              <Box overflowY="auto" maxHeight="150px" width="100%">
                {groupMembers &&
                  groupMembers.map((node) => {
                    return (
                      <ConformWindow
                        fun={addMembers}
                        val={node}
                        loading={loading}
                        title={`conform to add ${node.name}`}
                      >
                        <Box
                          padding="10px"
                          key={node._id}
                          width="100%"
                          height="60px"
                          display="flex"
                          justifyContent="space-between"
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
                            marginBottom="5px"
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
                      </ConformWindow>
                    );
                  })}
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <ConformWindow
              fun={leaveGroup}
              loading={loading}
              title={"conform to leave the Group"}
            >
              {selectedChat?.groupAdmin._id !== user._id ?
                (<Button colorScheme="red" mr={3}>
                Leave Group
                </Button>) : (
                  <Box fontWeight = "600" fontSize=".7rem" color="red">make other group member has admin to leave the group</Box>
              )
              }
            </ConformWindow>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default GroupChangeModel;

import React, { useState, useContext } from "react";
import axios from 'axios'
import { Box } from '@chakra-ui/layout'
import {
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
} from "@chakra-ui/react";
import {
    BellIcon,
    ChevronDownIcon
} from "@chakra-ui/icons"
import {useNavigate} from "react-router-dom"
import { chartContext } from "../context/chartProvider";
import ProfileModel from "./ProfileModel.js";
import ChatLoading from "../components/authentication/ChatLoding";
import UserList from "../components/UserList";

export const SideDrawer = () => {

    const toast = useToast();

    const [search, setSearch] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)
  
  const navigate = useNavigate()
  const { user, setSelectedChat , chats , setChats } = useContext(chartContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  let tosty = null

  const handelSearch = async() => {
    if (!search) {
      if (!tosty) {
         tosty = toast({
           title: "",
           description: "Enter the name or email to search",
           status: "warning",
           duration: 5000,
           isClosable: true,
           position: "top",
         });
      }
    
      setTimeout(() => {tosty = null},5000)
    }

    try {
      setSearchData([])
      setLoading(true)
      const config = {
        headers: {
          Authorization : `Bearer ${user?.jwtToken}`
        }
      }

      const { data } = await axios.get(`/api/user?search=${search}`, config)
      
      setSearchData(data)
      
      setLoading(false)
    } catch (error) {
        toast({
          title: "",
          description: "Error accured",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      setLoading(false)
    }

  }

  const CreatChat = async(userId) => {
    setLoadingChat(true)
    try {

       const config = {
         headers: {
           "Content-type" :"application/Json",
           Authorization: `Bearer ${user?.jwtToken}`,
         },
       };
      const { data } = await axios.post("/api/chat", { userId }, config)
      setSelectedChat(data)
      setLoadingChat(false)
      if(!chats.find((user) => user._id === data?._id))setChats((pre) => [data ,...pre ])
      onClose()
      
    } catch (error) {
      toast({
        title: "",
        description: "Error accured",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoadingChat(false);
    }
  }
  
  const handleLogout = () => {
    setSelectedChat(null)
    setChats([])
    localStorage.removeItem("user")
    navigate("/")
  }
    return (
      <>
        <Box
          p="5px 10px 5px 10px"
          display="flex"
          justifyContent="space-between"
          backgroundColor="white"
          borderWidth="2px"
        >
          <Tooltip hasArrow label="Search for users" bg="red.600">
            <Button variant="ghost" onClick={onOpen}>
              <i class="fa-solid fa-magnifying-glass"></i>
              <Text
                p="5px"
                display={{ base: "none", md: "inline-flex" }}
                textAlign="center"
                paddingBottom="7px"
                marginLeft="2px"
                
              >
                Search
              </Text>
            </Button>
          </Tooltip>
          <Text fontSize="2rem" color="#ccc">
            TALK-A-TIVE
          </Text>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Menu>
              <MenuButton as={Button} background="none">
                <BellIcon fontSize="2xl" />
              </MenuButton>
              <MenuList marginTop="7px">
                <MenuItem>Download</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} background="none">
                <ChevronDownIcon fontSize="2xl" />
                <Avatar
                  name={`${user?.name}`}
                  src={`${user?.pic}`}
                  size="sm"
                ></Avatar>
              </MenuButton>
              <MenuList marginTop="7px">
                <ProfileModel user={user}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModel>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </Box>
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent >
            <DrawerCloseButton />
            <DrawerHeader>Search for users</DrawerHeader>

            <DrawerBody>
              <Box height="100%" overflowX="hidden">
                <Box display="flex" justifyContent="space-between">
                  <Input
                    placeholder="Type here..."
                    marginRight="2px"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button onClick={handelSearch} isLoading = {loading}>search</Button>
                </Box>
                {loading ? (
                  <ChatLoading />
                ) : (
                  <Box height="100%" overflowX="auto" marginTop={"3px"}>
                    {searchData?.map((users) => {
                      return (
                        <UserList
                          key={users._id}
                          user={users}
                          handelFunction={() => CreatChat(users._id)}
                        />
                      );
                    })}
                  </Box>
                )}
              </Box>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
}

export default SideDrawer;
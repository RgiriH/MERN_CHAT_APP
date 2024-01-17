import React, { useEffect } from "react";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import {
    Container,
    Box,
    Text
} from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const user = (localStorage.getItem("user"))
        if (user) {
            navigate("/Chat")
        }
    }, [])
    
    return (
        <Container maxW='xl' centerContent>
            <Box
                d="flex"
                justifyContent="center"
                textAlign="center"
                p={3}
                w="100%"
                m="40px 0px 15px 0px"
                bg="white"
                borderRadius="15px"

            >
                <Text
                    fontSize="4xl"   
                >Talk-A-Tive</Text>
            </Box>  
            <Box
                bg="white"
                w="100%"
                borderRadius="lg"
                p = "3"
            >

                <Tabs variant='soft-rounded'>
                    <TabList
                        d="flex"
                        justifyContent="space-around"
                        mb = "1em"
                    >
                        <Tab
                        w = "50%">Login</Tab>
                        <Tab
                        w = "50%">SignUp</Tab>
                   </TabList>
                  <TabPanels>
                     <TabPanel>
                        <Login/>
                     </TabPanel>
                     <TabPanel>
                         <SignUp/>
                     </TabPanel>
                 </TabPanels>
                </Tabs>

            </Box>
       </Container>
   )
}

export default Home
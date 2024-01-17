import React from "react";
import { useState } from "react";
import {
    VStack,
    FormControl,
    Input,
    FormLabel,
    InputGroup,
    InputRightElement,
    Button,
    useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading , setLoading] = useState(false)

     const toast = useToast()
  const Navigate = useNavigate()
  
    const handelSubmit = async() => {
      if (!email || !password ) {
        toast({
          title: "Please Fill All Required Fileds",
          description: "all required fields are not provied",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });

        setLoading(false);
        return;
      }

      try {
      
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        {
         
          email,
          password,
        
        },
        config
      );
       toast({
         title: "TALK-A-TIVE",
         description: `Well Come ${data?.name} to TALK-A-TIVE`,
         status: "success",
         duration: 5000,
         isClosable: true,
         position: "top",
       });
     
      
      localStorage.setItem("user", JSON.stringify(data));
       Navigate("/Chat")
      
    }
    catch (e) {
      toast({
        title: "Error Accured",
        description: "internal Error",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      console.log(e)
     
    }
    
    setLoading(false)

    }

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="first-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="5m"
              bg="white"
              onClick={() => setShowPassword((pre) => !pre)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button colorScheme="blue" w="100%" mt="10px" onClick={handelSubmit} isLoading = {loading}>
        Login
      </Button>
          <Button variant="solid" colorScheme="red" w="100%" mt="10px" onClick={() => {
              setEmail("guest@example.com")
              setPassword("123456")
          }
      }>
        Get Guest User Credentials
      </Button>
    </VStack>
  );
    
}

export default Login
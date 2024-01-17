import React from "react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import {
   
    VStack,

    FormControl,
    Input,
    FormLabel,
    InputGroup,
    InputRightElement,
    Button,
    
} from "@chakra-ui/react";
import axios from "axios"
import { useNavigate } from "react-router-dom";


const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [conformPassword, setConformPassword] = useState("");
    const [pic, setPic] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConformPassword, setShowConformPassword] = useState(false);
    const [loading , setLoading ] = useState(false)
    
  const toast = useToast();
  const Navigate = useNavigate();

  const setFile = async (pick) => {
    setLoading(true);

    if (pick === undefined) {
      toast({
        title: "Account created.",
        description: "Profile Pick is Not selected",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      setLoading(false);
      return;
    }

    if (true) {
      const data = new FormData();
      data.append("file", pick);
      data.append("upload_preset", "MERN-chat-app");
      data.append("cloud_name", "drbzawoxp");

      
        fetch("https://api.cloudinary.com/v1_1/drbzawoxp/image/upload", {
          method: "post",
          body: data,
        }).then(res => res.json())
          .then(data => {
            setPic(data.url.toString())
            console.log(data.url.toString());
            setLoading(false)
          }).catch((e) => {
        console.log(e)
      })

       

     
    } else {
      
      toast({
        title: "Image type is not supported",
        description: "Profile Pick is Not selected",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      setLoading(false);
      return;
    }
    setTimeout(() => {
        setLoading(false);
    },2000)
   
  };
  const handelSubmit = async() => {
      setLoading(true)
      if (!name || !email || !password || !conformPassword) {
        toast({
          title: "Please Fill All Required Fileds",
          description: "all required fields are not provied",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });

        setLoading(false);
        return
      }
     else if (password !== conformPassword) {
           toast({
             title: "Please Fill All Required Fileds",
             description: "Passwors and Conformed Password is Not Matching",
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
        "/api/user",
        {
          name,
          email,
          password,
          pic,
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
     
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
       Navigate("/Chat")
      
    }
    catch (e) {
      toast({
        title: "Error Accured",
        description: "Error accured",
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
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
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
      <FormControl id="conform-password" isRequired>
        <FormLabel>Conform Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Conform password"
            type={showConformPassword ? "text" : "password"}
            onChange={(e) => setConformPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="5m"
              bg="white" 
              onClick={() => setShowConformPassword((pre) => !pre)}
            >
              {showConformPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Profile Pick</FormLabel>
        <Input
          type="file"
          accept="image/*"
          p="1"
          onChange={(e) => setFile(e.target.files[0])}
          
        />
      </FormControl>
      <Button colorScheme="blue" w="100%" mt="10px" onClick={handelSubmit}
      isLoading = {loading}>
        Sing Up
      </Button>
    </VStack>
  );
};

export default SignUp;

import React, { useContext} from 'react'
import { Spinner, useDisclosure } from "@chakra-ui/react"
import { ViewIcon, } from "@chakra-ui/icons"
import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
    Text,
  Avatar,
  
} from "@chakra-ui/react";
import { chartContext } from '../context/chartProvider';


const ProfileModel = ({user , children , flag , fun , val , loading}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {user : User} = useContext(chartContext)
  const handleChick = async() => {
    await fun(val)
    onClose()
  }
    return (
      <div>
        {children ? (
          <span onClick={onOpen}>{children}</span>
        ) : (
          <span onClick={onOpen}>
            <IconButton d="flex" icon={<ViewIcon />}></IconButton>
          </span>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent width="300px" maxHeight="300px">
            <ModalHeader>Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody margin="auto">
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Avatar
                  size="2xl"
                  display="flex"
                  alignContent="center"
                  margin="auto"
                  height="50px"
                  width="50px"
                  src={user?.pic}
                />
                <Text
                  textAlign="center"
                  //fontSize="5xl"
                  fontWeight="bolder"
                  fontFamily="rubiclines"
                  color="#8B0000"
                  // width="100%"
                  // height="50px"
                  //width="50px"
                >
                  {user?.name}
                </Text>
                <Text
                  textAlign="center"
                  //fontSize="2xl"
                  fontFamily="revert-layer"
                  color="#696969"
                >
                  {user?.email}
                </Text>
              </Box>
            </ModalBody>

            <ModalFooter>
              {flag && (
                <Button
                  colorScheme="blue"
                  width="80px"
                  fontSize=".7rem"
                  onClick={handleChick}
                  isLoading={loading}
                  isDisabled={user?._id === User._id ? true : false}
                  spinner={<Spinner size={8} color="white" />}
                >
                  make admin
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
}

export default ProfileModel
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Button,
  Box
} from "@chakra-ui/react";

const ConformWindow = ({ children  , loading , fun , val,title}) => {
const { isOpen, onOpen, onClose } = useDisclosure();    
    
const funHandler = async() => {
    await fun(val)
    onClose()
}
    return (
      <Box>
        <span onClick={onOpen}>{children}</span>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody >
              <Box display="flex" alignContent="center" justifyContent="center">
                {loading && (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size = "xl"
                    //marginLeft="auto"
                  />
                )}
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={funHandler}>
                conform
              </Button>
              <Button variant="red" onClick={onClose}>
                cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
}

export default ConformWindow
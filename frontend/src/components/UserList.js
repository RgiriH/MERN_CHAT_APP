import React from "react";
import { Box, Avatar, Text} from "@chakra-ui/react";

const UserList = ({ user , handelFunction}) => {
    return (
      <Box
        padding="5px"
        display="flex"
        overflow="hidden"
        bg="#DCDCDC"
        borderRadius="10px"
        marginTop="10px"
        justifyContent="space-around"
            _hover={{ background: "#9933" }}
            onClick={handelFunction}
            cursor="pointer"
      >
        <Avatar name={user?.name} src={user?.pic} alignSelf="center" />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          width="70%"
        >
          <Text fontWeight="bolder" fontFamily="serif">
            Name : {user?.name}
          </Text>
          <Text fontWeight="100">Email : {user?.email}</Text>
        </Box>
      </Box>
    );
}

export default UserList
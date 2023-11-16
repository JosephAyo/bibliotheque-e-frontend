import { Box, Flex, Image, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { GiBookshelf } from 'react-icons/gi';

const BookCard = () => {
  const cardBackgroundColor = useColorModeValue('#f6f6f6', 'gray.600');
  const authorColor = useColorModeValue('#999', '#BBB');

  return (
    <Box width="155px" height="220px" backgroundColor={cardBackgroundColor} borderRadius="18px">
      <Box position="relative">
        <Image
          src="https://picsum.photos/500"
          alt="Picture of the author"
          fill
          style={{
            objectFit: 'cover',
            borderRadius: '16px 16px 0 0',
            height: '144px',
            width: '100%'
          }}
        />
      </Box>
      <VStack
        marginTop="9px"
        padding="12px"
        paddingTop="0px"
        spacing="8px"
        width="100%"
        alignItems="flex-start">
        <Flex gap="8px" flexDirection="column">
          <Text textStyle="subtitle-1">Book title: blah blah</Text>
          <Text textStyle="subtitle-2-medium" color={authorColor}>
            Book author
          </Text>
        </Flex>
        <Flex alignItems="center" color="primary.default" gap="4px">
          <GiBookshelf size={14} />
          <Text textStyle="subtitle-2">4</Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default BookCard;

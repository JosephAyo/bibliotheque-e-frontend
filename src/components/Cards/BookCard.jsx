import {
  Box,
  Flex,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import React from 'react';
import { GiBookshelf } from 'react-icons/gi';

const bookDetails = {
  title: 'Book title: blah blah',
  author: 'Book author',
  summary:
    'Velit velit ullamco ullamco id ullamco ullamco. Veniam ad adipisicing laborum non culpa anim enim pariatur esse excepteur sit. Fugiat aliquip esse incididunt do tempor qui. Adipisicing officia minim non et esse et consectetur. Velit velit ullamco ullamco id ullamco ullamco. Veniam ad adipisicing laborum non culpa anim enim pariatur esse excepteur sit. Fugiat aliquip esse incididunt do tempor qui. Adipisicing officia minim non et esse et consectetur Velit velit ullamco ullamco id ullamco ullamco. Veniam ad adipisicing laborum non culpa anim enim pariatur esse excepteur sit. Fugiat aliquip esse incididunt do tempor qui. Adipisicing officia minim non et esse et consectetur. Velit velit ullamco ullamco id ullamco ullamco. Veniam ad adipisicing laborum non culpa anim enim pariatur esse excepteur sit. Fugiat aliquip esse incididunt do tempor qui. Adipisicing officia minim non et esse et consectetur Velit velit ullamco ullamco id ullamco ullamco. Veniam ad adipisicing laborum non culpa anim enim pariatur esse excepteur sit. Fugiat aliquip esse incididunt do tempor qui. Adipisicing officia minim non et esse et consectetur. Velit velit ullamco ullamco id ullamco ullamco. Veniam ad adipisicing laborum non culpa anim enim pariatur esse excepteur sit. Fugiat aliquip esse incididunt do tempor qui. Adipisicing officia minim non et esse et consectetur Velit velit ullamco ullamco id ullamco ullamco. Veniam ad adipisicing laborum non culpa anim enim pariatur esse excepteur sit. Fugiat aliquip esse incididunt do tempor qui. Adipisicing officia minim non et esse et consectetur. Velit velit ullamco ullamco id ullamco ullamco. Veniam ad adipisicing laborum non culpa anim enim pariatur esse excepteur sit. Fugiat aliquip esse incididunt do tempor qui. Adipisicing officia minim non et esse et consectetur Velit velit ullamco ullamco id ullamco ullamco. Veniam ad adipisicing laborum non culpa anim enim pariatur esse excepteur sit. Fugiat aliquip esse incididunt do tempor qui. Adipisicing officia minim non et esse et consectetur. Velit velit ullamco ullamco id ullamco ullamco. Veniam ad adipisicing laborum non culpa anim enim pariatur esse excepteur sit. Fugiat aliquip esse incididunt do tempor qui. Adipisicing officia minim non et esse et consectetur'
};
const BookCard = () => {
  const cardBackgroundColor = useColorModeValue('#f6f6f6', 'gray.600');
  const authorColor = useColorModeValue('#999', '#BBB');

  return (
    <Popover placement="right-start">
      <PopoverTrigger>
        <Box
          width="155px"
          height="220px"
          backgroundColor={cardBackgroundColor}
          borderRadius="18px"
          cursor="pointer">
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
              <Text textStyle="subtitle-1">{bookDetails.title}</Text>
              <Text textStyle="subtitle-2-medium" color={authorColor}>
                {bookDetails.author}
              </Text>
            </Flex>
            <Flex alignItems="center" color="primary.default" gap="4px">
              <GiBookshelf size={14} />
              <Text textStyle="subtitle-2">4</Text>
            </Flex>
          </VStack>
        </Box>
      </PopoverTrigger>
      <PopoverContent backgroundColor={cardBackgroundColor} width='400px'>
        <PopoverArrow backgroundColor={cardBackgroundColor} />
        <PopoverCloseButton />
        <PopoverHeader>
          <strong>{bookDetails.title}</strong> <br />
          <Text textStyle="subtitle-1-medium">{bookDetails.author}</Text>
        </PopoverHeader>
        <PopoverBody>
          <Text noOfLines={20}>{bookDetails.summary}</Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default BookCard;

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
import { GiBookshelf } from 'react-icons/gi';
import { FaEyeSlash } from "react-icons/fa";

const BookCard = ({
  title,
  author_name,
  description,
  public_shelf_quantity,
  private_shelf_quantity
}) => {
  const cardBackgroundColor = useColorModeValue('#f6f6f6', 'gray.600');
  const authorColor = useColorModeValue('#999', '#BBB');
  const countsColor = useColorModeValue('primaryLight.default', 'primaryDark.default');

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
              <Text textStyle="subtitle-1" noOfLines={1}>
                {title}
              </Text>
              <Text textStyle="subtitle-2-medium" noOfLines={1} color={authorColor}>
                {author_name}
              </Text>
            </Flex>
            <Flex width="100%" justifyContent="space-between">
              <Flex alignItems="center" color={countsColor} gap="4px">
                <GiBookshelf size={14} />
                <Text textStyle="subtitle-2">
                  {new Intl.NumberFormat(undefined, {
                    notation: 'compact'
                  }).format(public_shelf_quantity)}
                </Text>
              </Flex>
              {Number.isNaN(parseFloat(private_shelf_quantity)) ? (
                ''
              ) : (
                <Flex alignItems="center" color={countsColor} gap="4px">
                  <FaEyeSlash size={14} />
                  <Text textStyle="subtitle-2">
                    {new Intl.NumberFormat(undefined, {
                      notation: 'compact'
                    }).format(private_shelf_quantity)}
                  </Text>
                </Flex>
              )}
            </Flex>
          </VStack>
        </Box>
      </PopoverTrigger>
      <PopoverContent backgroundColor={cardBackgroundColor} width="400px">
        <PopoverArrow backgroundColor={cardBackgroundColor} />
        <PopoverCloseButton />
        <PopoverHeader>
          <strong>{title}</strong> <br />
          <Text textStyle="subtitle-1-medium">{author_name}</Text>
        </PopoverHeader>
        <PopoverBody>
          <Text noOfLines={20}>{description}</Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default BookCard;

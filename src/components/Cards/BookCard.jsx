import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { GiBookshelf } from 'react-icons/gi';
import { FaEyeSlash } from 'react-icons/fa';

const BookCard = ({
  details,
  isBorrower,
  isProprietor,
  onClickBorrow,
  onClickEdit,
  isBorrowing
}) => {
  const cardBackgroundColor = useColorModeValue('#f6f6f6', 'gray.600');
  const authorColor = useColorModeValue('#999', '#BBB');
  const countsColor = useColorModeValue('primaryLight.default', 'primaryDark.default');
  const { title, author_name, description, public_shelf_quantity, private_shelf_quantity } =
    details;

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
        <PopoverBody
          maxHeight="400px"
          overflowY="scroll"
          sx={{
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#000000aa',
              borderRadius: '24px'
            },
            '&': {
              scrollbarWidth: 'thin',
              scrollbarColor: '#000000aa transparent'
            }
          }}>
          <Text>{description}</Text>
        </PopoverBody>
        <PopoverFooter
          border="0"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}>
          <ButtonGroup width="100%" size="sm" justifyContent="end">
            {isBorrower ? (
              <Button variant="primary_action" onClick={onClickBorrow} isLoading={isBorrowing}>
                Borrow
              </Button>
            ) : (
              ''
            )}
            {isProprietor ? (
              <Button variant="primary_action" onClick={() => onClickEdit(details)}>
                Edit
              </Button>
            ) : (
              ''
            )}
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default BookCard;

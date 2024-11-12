import useUserRoles from '@/hooks/useUserRoles';
import { DUE_STATUSES } from '@/utils/constants';
import { getDueIndicatorColor, iff } from '@/utils/helpers';
import { Badge, Center, CloseButton, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';

const ReminderBanner = ({ status }) => {
  const cardBackgroundColor = useColorModeValue('#f6f6f6', 'gray.600');
  const { isBorrower } = useUserRoles();

  const [dismissed, setDismissed] = useState(false);
  const dueColor = getDueIndicatorColor(status);

  return isBorrower && !dismissed ? (
    <Center
      position="fixed"
      bottom={0}
      flexDirection="column"
      width="893px"
      maxWidth="inherit"
      height="100px"
      borderRadius="18px"
      padding="20px"
      backgroundColor={cardBackgroundColor}
      borderWidth="2px">
      <Text textStyle="body-medium" textTransform="uppercase">
        Your borrowed book is&nbsp;
        <Badge colorScheme={dueColor} variant="solid" textStyle="body" fontSize="md">
          {iff(
            status === DUE_STATUSES.DUE_SOON,
            'due soon',
            status === DUE_STATUSES.LATE ? 'late' : ''
          )}
        </Badge>
      </Text>
      <CloseButton top="10px" right="10px" position="absolute" onClick={() => setDismissed(true)} />
    </Center>
  ) : (
    ''
  );
};

export default ReminderBanner;

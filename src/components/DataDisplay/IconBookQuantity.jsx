import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const IconBookQuantity = ({ quantity, icon ,containerProps}) => {
  const countsColor = useColorModeValue('primaryLight.default', 'primaryDark.default');
  return Number.isNaN(parseFloat(quantity)) ? (
    ''
  ) : (
    <Flex alignItems="center" color={countsColor} gap="2px" {...containerProps}>
      {icon}
      <Text textStyle="subtitle-2">
        {new Intl.NumberFormat(undefined, {
          notation: 'compact'
        }).format(quantity)}
      </Text>
    </Flex>
  );
};

export default IconBookQuantity;

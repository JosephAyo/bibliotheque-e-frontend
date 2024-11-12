import { IconButton, Tooltip } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaLink, FaCheckCircle } from 'react-icons/fa';

const CopyLinkButton = ({ link }) => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setClicked(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [clicked]);

  const handleLinkCopy = () => {
    setClicked(true);
    navigator.clipboard.writeText(link);
  };

  return (
    <Tooltip
      label={clicked ? 'Copied' : 'Copy link'}
      aria-label="copy book link"
      placement="top"
      fontSize="12px">
      <IconButton
        variant="solid"
        aria-label="Done"
        fontSize="12px"
        size="sm"
        icon={clicked ? <FaCheckCircle /> : <FaLink />}
        minWidth="fit-content"
        height="fit-content"
        padding="5px"
        onClick={handleLinkCopy}
        disabled={!clicked}
      />
    </Tooltip>
  );
};

export default CopyLinkButton;

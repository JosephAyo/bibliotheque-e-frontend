import { IconButton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaCaretUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return isVisible ? (
    <IconButton
      variant="secondary_action"
      position="fixed"
      bottom="20px"
      transform="translate(1000%, 0%)"
      onClick={scrollToTop}
      icon={<FaCaretUp />}
      opacity={0.6}
      _hover={{
        opacity: 1
      }}
    />
  ) : (
    ''
  );
};
export default ScrollToTopButton;

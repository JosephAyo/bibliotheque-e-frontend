import { toast } from 'react-toastify';

export const successToast = ({ message, ...rest }) =>
  toast.success(message, {
    position: 'top-right',
    // className: 'custom__toast',
    // bodyClassName: 'custom__toast--body',
    ...rest
  });

export const errorToast = ({ message, ...rest }) =>
  toast.error(message, {
    position: 'top-right',
    // className: 'custom__toast',
    // bodyClassName: 'custom__toast--body',
    ...rest
  });

import { Bounce, toast } from 'react-toastify';

export const showSuccessMessage = ({
  message,
  duration = 3000,
  position = 'top-right'
}) => {
  toast.success(message, {
    position: position,
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce
  });
};

export const showErrorMessage = ({
  message,
  duration = 3000,
  position = 'top-right'
}) => {
  toast.error(message, {
    position: position,
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce
  });
};

export const showInfoMessage = ({
  message,
  duration = 3000,
  position = 'top-right'
}) => {
  toast.info(message, {
    position: position,
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce
  });
};

export const showWarningMessage = ({
  message,
  duration = 3000,
  position = 'top-right'
}) => {
  toast.warn(message, {
    position: position,
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce
  });
};

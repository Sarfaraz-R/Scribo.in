// utils/toastUtils.js
import { toast } from 'react-hot-toast';

const baseStyle = {
  background: '#0d1117',
  color: '#fff',
  border: '1px solid rgba(249,115,22,0.4)',
};

export const showSuccess = (message) => {
  toast.success(message, { style: baseStyle });
};

export const showError = (error) => {
  const message =
    error?.response?.data?.message ||   // common backend format
    error?.response?.data?.error ||     // alternative format
    error?.message ||                   // fallback
    "Something went wrong";

  toast.error(message, { style: baseStyle });
};

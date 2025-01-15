import toast from 'react-hot-toast';

export function successToast(data) {
    toast.success(data, {
        icon: '✅',
      });
}

export function errorToast(data) {
    toast.error(data, {
        icon: '❌',
      });
    }

// react toastify alert
import 'react-toastify/scss/main.scss';
import { toast, ToastContainer } from "react-toastify";

// toast
export const SuccessAlert = (message) => {
    if (message) {

        toast.success(`${message}!  ✅`, {
            position: toast.POSITION.TOP_RIGHT
        });

    } else {
        
        toast.success("Successful ! ✅ 👏", {
            position: toast.POSITION.TOP_RIGHT
        });

    }
}

export const ValidationAlert = (message) => {
    toast.error(`${message}! 🛑`, {
        position: toast.POSITION.TOP_RIGHT
    });
}

export const ErrorAlert = (error) => {
    toast.error(`${error?.message}! 😞`, {
        position: toast.POSITION.TOP_RIGHT
    });
}

export const AlertContainer = () => ( <ToastContainer autoClose={5000}/> )
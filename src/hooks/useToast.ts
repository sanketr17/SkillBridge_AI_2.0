import { toast } from "react-hot-toast";

export const useToast = () => {
  return {
    success: (message: string) => toast.success(message, {
      style: {
        background: "#1e293b",
        color: "#f8fafc",
        border: "1px solid #334155"
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#1e293b"
      }
    }),
    error: (message: string) => toast.error(message, {
      style: {
        background: "#1e293b",
        color: "#f8fafc",
        border: "1px solid #334155"
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#1e293b"
      }
    }),
    info: (message: string) => toast(message, {
      style: {
        background: "#1e293b",
        color: "#f8fafc",
        border: "1px solid #334155"
      },
      icon: "ℹ️"
    }),
    loading: (message: string) => toast.loading(message, {
      style: {
        background: "#1e293b",
        color: "#f8fafc",
        border: "1px solid #334155"
      }
    }),
    dismiss: (id?: string) => toast.dismiss(id)
  };
};

export default useToast;

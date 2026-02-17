import toast from "react-hot-toast";

/**
 * Custom toast notification hook
 * Provides consistent styling and messaging across the app
 */

export const useToast = () => {
  return {
    success: (message: string) => {
      toast.success(message, {
        duration: 3000,
        position: "top-center",
        style: {
          background: "hsl(var(--surface))",
          color: "hsl(var(--foreground))",
          border: "2px solid hsl(var(--primary))",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          fontWeight: "500",
          maxWidth: "500px",
        },
        iconTheme: {
          primary: "hsl(var(--primary))",
          secondary: "hsl(var(--surface))",
        },
      });
    },

    error: (message: string) => {
      toast.error(message, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "hsl(var(--surface))",
          color: "hsl(var(--foreground))",
          border: "2px solid hsl(var(--danger))",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          fontWeight: "500",
          maxWidth: "500px",
        },
        iconTheme: {
          primary: "hsl(var(--danger))",
          secondary: "hsl(var(--surface))",
        },
      });
    },

    info: (message: string) => {
      toast(message, {
        duration: 3000,
        position: "top-center",
        icon: "ℹ️",
        style: {
          background: "hsl(var(--surface))",
          color: "hsl(var(--foreground))",
          border: "2px solid hsl(var(--border))",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          fontWeight: "500",
          maxWidth: "500px",
        },
      });
    },

    loading: (message: string) => {
      return toast.loading(message, {
        position: "top-center",
        style: {
          background: "hsl(var(--surface))",
          color: "hsl(var(--foreground))",
          border: "2px solid hsl(var(--border))",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          fontWeight: "500",
          maxWidth: "500px",
        },
      });
    },

    dismiss: (toastId?: string) => {
      toast.dismiss(toastId);
    },
  };
};

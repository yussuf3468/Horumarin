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
        position: "bottom-right",
        style: {
          background: "hsl(var(--surface))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          padding: "16px",
          borderRadius: "12px",
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
        position: "bottom-right",
        style: {
          background: "hsl(var(--surface))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--danger-border))",
          padding: "16px",
          borderRadius: "12px",
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
        position: "bottom-right",
        icon: "ℹ️",
        style: {
          background: "hsl(var(--surface))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          padding: "16px",
          borderRadius: "12px",
        },
      });
    },

    loading: (message: string) => {
      return toast.loading(message, {
        position: "bottom-right",
        style: {
          background: "hsl(var(--surface))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          padding: "16px",
          borderRadius: "12px",
        },
      });
    },

    dismiss: (toastId?: string) => {
      toast.dismiss(toastId);
    },
  };
};

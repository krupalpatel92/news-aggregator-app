import { notification } from "ant-design-vue";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotificationConfig {
  message: string;
  description?: string;
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

const defaultDuration = 3; // 5 seconds

export const showNotification = (
  type: NotificationType,
  message: string,
  description?: string,
  duration: number = defaultDuration
) => {
  const config: NotificationConfig = {
    message,
    description,
    duration,
    placement: "topRight",
  };

  notification[type](config);
};

export const toast = {
  success: (message: string) => showNotification("success", message),
  error: (message: string) => showNotification("error", message),
  info: (message: string) => showNotification("info", message),
  warning: (message: string) => showNotification("warning", message),
};

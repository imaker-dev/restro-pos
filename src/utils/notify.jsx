import toast from "react-hot-toast";
import AppNotification from "../components/AppNotification";

export const notify = ({
  title,
  message,
  type = "info",
  actionLabel,
  onAction,
  duration = 5000, // default
  position = "top-right",
}) => {
  toast.custom(
    (t) => (
      <AppNotification
        t={t}
        title={title}
        message={message}
        type={type}
        actionLabel={actionLabel}
        onAction={onAction}
      />
    ),
    {
      position,
      duration,
    },
  );
};

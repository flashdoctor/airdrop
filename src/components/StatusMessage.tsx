import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

type StatusType = "success" | "error" | "info" | null;

interface StatusMessageProps {
  type: StatusType;
  message: string;
}

const StatusMessage = ({ type, message }: StatusMessageProps) => {
  if (!type) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />,
  };

  const classes = {
    success: "status-success",
    error: "status-error",
    info: "status-info",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className={`${classes[type]} flex items-center gap-3 mt-4`}
      >
        {icons[type]}
        <span className="text-sm font-medium">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusMessage;
export type { StatusType };

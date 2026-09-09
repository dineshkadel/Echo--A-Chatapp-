// Moved to components/ui/dismissable-alert — re-exported here for backward compatibility.
// ActionMessage type is kept local for the admin feature.
import type { ActionMessage } from "../../types/User";
import { DismissableAlert } from "@/components/ui/dismissable-alert";

interface ActionAlertProps {
    message: ActionMessage | null;
    onDismiss: () => void;
}

export function ActionAlert({ message, onDismiss }: ActionAlertProps) {
    if (!message) return null;
    return (
        <DismissableAlert
            type={message.type}
            message={message.text}
            onDismiss={onDismiss}
        />
    );
}
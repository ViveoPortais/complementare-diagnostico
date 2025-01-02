import { Loading } from "./Loading";

interface LoadingOverlayProps {
    isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
            <Loading size={60} customClass="important-color-text" />
        </div>
    );
}

import { createContext, useContext, useRef } from "react";

/* eslint-disable react-refresh/only-export-components */
type ToastContextType = {
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const toastRef = useRef<HTMLDivElement>(null);
    
    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        if (!toastRef.current) return;
        toastRef.current.classList.remove('hidden');
        toastRef.current.innerHTML = `<div class="alert ${"alert-" + type}">
            ${type === "error" ? '<i class="iconify mingcute--alert-line text-2xl text-white"></i>' : ''}
            ${type === "success" ? '<i class="iconify mingcute--check-circle-line text-2xl text-white"></i>' : ''}
            ${type === "info" ? '<i class="iconify mingcute--information-line text-2xl text-white"></i>' : ''}
            <span class="text-white">${message}</span>
        </div>`;
        setTimeout(() => {
            if (!toastRef.current) return;
            toastRef.current.classList.add('hidden');
        }, 3000);
    };

    return <ToastContext.Provider value={{ showToast }}>
        <div className="toast toast-top toast-end z-20" ref={toastRef}>
        </div>
        {children}
    </ToastContext.Provider>;
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export default ToastProvider;
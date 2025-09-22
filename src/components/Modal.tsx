"use client";

type ModalProps ={
    isOpen : boolean;
    title: string;
    content: React.ReactNode;
    onCancel : () => void;
    onConfirm : ()=> void;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
};

export default function Modal({
        isOpen,
        title,
        content,
        onCancel,
        onConfirm,
        confirmText = "Confirm",
        cancelText = "Cancel",
        confirmColor = "bg-blue-600"
}: ModalProps){
    if(!isOpen) return null;

    return(
        <div className="fixed inset-0 flex items-center justify-center bg-grey bg-opacity-50 z-50">
            <div className="bg-gray-100 p-6 rounder shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-black">{title}</h2>
                <div className="mb-6 text-black">{content}</div>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel}
                    className="px-4 py-2 rounder bg-gray-700 hover:hover:bg-red-700"
                    >
                        {cancelText}
                    </button>
                    <button onClick={onConfirm}
                    className={`px-4 py-2 rounded text-white hover:bg-blue-700 ${confirmColor}`}
                    > {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

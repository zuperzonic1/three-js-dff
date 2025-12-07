import { useState, useEffect } from 'react';

const LoadingSpinner = ({ isLoading, message = "Loading..." }) => {
    if (!isLoading) return null;

    return (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center">
            <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-8 text-center space-y-4 border border-purple-500/30 shadow-xl">
                <div className="w-12 h-12 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-white font-medium">{message}</div>
                <div className="text-slate-400 text-sm">Please wait while we process your files...</div>
            </div>
        </div>
    );
};

const ErrorToast = ({ error, onClose }) => {
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, onClose]);

    if (!error) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-slate-800/80 backdrop-blur-md text-white px-6 py-3 rounded-lg shadow-lg border border-red-500/30 flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-300">{error}</span>
                <button 
                    onClick={onClose}
                    className="ml-3 hover:bg-red-500/20 rounded p-1 transition-colors"
                >
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const SuccessToast = ({ message, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-slate-800/80 backdrop-blur-md text-white px-6 py-3 rounded-lg shadow-lg border border-green-500/30 flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-300">{message}</span>
                <button 
                    onClick={onClose}
                    className="ml-3 hover:bg-green-500/20 rounded p-1 transition-colors"
                >
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export { LoadingSpinner, ErrorToast, SuccessToast };

import { useState, useEffect } from 'react';

const LoadingSpinner = ({ isLoading, message = "Loading..." }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-slate-800/90 rounded-xl p-6 text-center space-y-4">
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
            <div className="bg-red-600/90 text-white px-6 py-3 rounded-lg shadow-lg border border-red-500 flex items-center space-x-3">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
                <button 
                    onClick={onClose}
                    className="ml-3 hover:bg-red-700/50 rounded p-1"
                >
                    ✕
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
            <div className="bg-green-600/90 text-white px-6 py-3 rounded-lg shadow-lg border border-green-500 flex items-center space-x-3">
                <span className="text-lg">✅</span>
                <span>{message}</span>
                <button 
                    onClick={onClose}
                    className="ml-3 hover:bg-green-700/50 rounded p-1"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export { LoadingSpinner, ErrorToast, SuccessToast };

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Buffer } from 'buffer';
import FileUpload from './FileUpload';
import ControlPanel from './ControlPanel';
import ViewerCanvas from './ViewerCanvas';
import HelpPanel from './HelpPanel';
import ErrorBoundary from './ErrorBoundary';
import { ErrorToast, SuccessToast } from './Notifications';

const ModelViewer = () => {
    window.Buffer = Buffer;

    const [modelData, setModelData] = useState(null);
    const [textureData, setTextureData] = useState(null);
    const [renderReady, setRenderReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [resetTrigger, setResetTrigger] = useState(0);


    const handleReloadModel = useCallback(() => {
        setRenderReady(false);
        setModelData(null);
        setTextureData(null);
        setResetTrigger(prev => prev + 1); // Trigger FileUpload reset
        setSuccess("Viewer reset successfully");
    }, []);

    const handleErrorClose = useCallback(() => setError(null), []);
    const handleSuccessClose = useCallback(() => setSuccess(null), []);

    // Memoize heavy data to prevent unnecessary re-renders
    const memoizedModelData = useMemo(() => modelData, [modelData]);
    const memoizedTextureData = useMemo(() => textureData, [textureData]);

    // Automatically load model when both files are uploaded
    useEffect(() => {
        if (modelData && textureData && !renderReady) {
            setRenderReady(true);
            setSuccess("Model loaded automatically");
        }
    }, [modelData, textureData, renderReady]);

    useEffect(() => {
        console.log("Render Ready state changed:", renderReady);
    }, [renderReady]);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Header for mobile */}
            <div className="lg:hidden bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/20 p-4 flex justify-center">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-slate-900/90 rounded-full blur-sm"></div>
                    <img src="/DFFinity-logo.png" alt="DFFinity Logo" className="h-14 relative z-10" />
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-96 lg:min-h-screen bg-slate-800/30 backdrop-blur-sm border-r border-purple-500/20">
                <div className="p-6">
                    {/* Logo/Title for desktop */}
                    <div className="hidden lg:block mb-8 text-center">
                        <div className="relative mb-4 inline-block">
                            <div className="absolute inset-0 bg-slate-900/90 rounded-full blur-sm"></div>
                            <img src="/DFFinity-logo.png" alt="DFFinity Logo" className="h-24 relative z-10" />
                        </div>
                        <p className="text-slate-400 text-sm">
                            Professional DFF/TXD File Visualization
                        </p>
                    </div>

                    {/* File Upload Section */}
                    <FileUpload 
                        setModelData={setModelData} 
                        setTextureData={setTextureData} 
                        setIsLoading={setIsLoading}
                        resetTrigger={resetTrigger}
                    />

                    {/* Control Panel */}
                    <ControlPanel
                        onReloadClick={handleReloadModel}
                        isLoading={isLoading}
                        modelData={modelData}
                        textureData={textureData}
                    />
                </div>
            </div>

            {/* Main Content Area - Unified Viewer */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1">
                    <ErrorBoundary>
                        <ViewerCanvas 
                            renderReady={renderReady} 
                            modelData={memoizedModelData} 
                            textureData={memoizedTextureData}
                            isLoading={isLoading}
                        />
                    </ErrorBoundary>
                </div>
            </div>

            {/* Notifications */}
            <ErrorToast error={error} onClose={handleErrorClose} />
            <SuccessToast message={success} onClose={handleSuccessClose} />
            
            {/* Help Panel */}
            <HelpPanel />
        </div>
    );
};

export default ModelViewer;

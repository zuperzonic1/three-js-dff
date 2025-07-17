import { useState, useEffect, useCallback, useMemo } from 'react';
import { Buffer } from 'buffer';
import FileUpload from './FileUpload';
import ControlPanel from './ControlPanel';
import ViewerCanvas from './ViewerCanvas';
import HelpPanel from './HelpPanel';
import ErrorBoundary from './ErrorBoundary';
import { LoadingSpinner, ErrorToast, SuccessToast } from './Notifications';

const ModelViewer = () => {
    window.Buffer = Buffer;

    const [modelData, setModelData] = useState(null);
    const [textureData, setTextureData] = useState(null);
    const [renderReady, setRenderReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleRenderClick = useCallback(() => {
        if (modelData && textureData) {
            setRenderReady(true);
            setSuccess("Model loaded successfully! 🎉");
        } else {
            setError("Please upload both .dff and .txd files.");
        }
    }, [modelData, textureData]);

    const handleReloadModel = useCallback(() => {
        setRenderReady(false);
        setModelData(null);
        setTextureData(null);
        setSuccess("Viewer reset successfully!");
    }, []);

    const handleErrorClose = useCallback(() => setError(null), []);
    const handleSuccessClose = useCallback(() => setSuccess(null), []);

    // Memoize heavy data to prevent unnecessary re-renders
    const memoizedModelData = useMemo(() => modelData, [modelData]);
    const memoizedTextureData = useMemo(() => textureData, [textureData]);

    useEffect(() => {
        console.log("Render Ready state changed:", renderReady);
    }, [renderReady]);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Header for mobile */}
            <div className="lg:hidden bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/20 p-4 flex justify-center">
                <img src="/DFFinity-logo.png" alt="DFFinity Logo" className="h-14 mx-auto" />
            </div>

            {/* Sidebar */}
            <div className="lg:w-96 lg:min-h-screen bg-slate-800/30 backdrop-blur-sm border-r border-purple-500/20">
                <div className="p-6">
                    {/* Logo/Title for desktop */}
                    <div className="hidden lg:block mb-8 text-center">
                        <img src="/DFFinity-logo.png" alt="DFFinity Logo" className="h-24 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm">
                            Upload and visualize DFF/TXD files
                        </p>
                    </div>

                    {/* File Upload Section */}
                    <FileUpload 
                        setModelData={setModelData} 
                        setTextureData={setTextureData} 
                        setIsLoading={setIsLoading} 
                    />

                    {/* Control Panel */}
                    <ControlPanel
                        onRenderClick={handleRenderClick}
                        onReloadClick={handleReloadModel}
                        isLoading={isLoading}
                        modelData={modelData}
                        textureData={textureData}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Viewer Canvas */}
                <div className="flex-1">
                    <ErrorBoundary>
                        <ViewerCanvas 
                            renderReady={renderReady} 
                            modelData={memoizedModelData} 
                            textureData={memoizedTextureData} 
                        />
                    </ErrorBoundary>
                </div>

            </div>

            {/* Notifications */}
            <LoadingSpinner isLoading={isLoading} message="Processing files..." />
            <ErrorToast error={error} onClose={handleErrorClose} />
            <SuccessToast message={success} onClose={handleSuccessClose} />
            
            {/* Help Panel */}
            <HelpPanel />
        </div>
    );
};

export default ModelViewer;

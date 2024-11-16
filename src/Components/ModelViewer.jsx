import { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import FileUpload from './FileUpload';
import ControlPanel from './ControlPanel';
import ViewerCanvas from './ViewerCanvas';

const ModelViewer = () => {
    window.Buffer = Buffer;

    const [modelData, setModelData] = useState(null);
    const [textureData, setTextureData] = useState(null);
    const [renderReady, setRenderReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRenderClick = () => {
        if (modelData && textureData) {
            setRenderReady(true);
        } else {
            alert("Please upload both .dff and .txd files.");
        }
    };

    const handleReloadModel = () => {
        setRenderReady(false);
        setModelData(null);
        setTextureData(null);
    };

    useEffect(() => {
        console.log("Render Ready state changed:", renderReady);
    }, [renderReady]);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-dark-bg text-white p-4 md:p-8">
            <ControlPanel
                onRenderClick={handleRenderClick}
                onReloadClick={handleReloadModel}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setModelData={setModelData}
                setTextureData={setTextureData}
            />
            <div className="flex-1 mt-4 md:mt-0 md:ml-8">
                <ViewerCanvas renderReady={renderReady} modelData={modelData} textureData={textureData} />
            </div>
        </div>
    );
};

export default ModelViewer;

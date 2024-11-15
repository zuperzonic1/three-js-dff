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
        <div className="flex min-h-screen bg-gray-900 text-white">
            <ControlPanel
                onRenderClick={handleRenderClick}
                onReloadClick={handleReloadModel}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setModelData={setModelData}
                setTextureData={setTextureData}
            />
            <ViewerCanvas renderReady={renderReady} modelData={modelData} textureData={textureData} />
        </div>
    );
};

export default ModelViewer;

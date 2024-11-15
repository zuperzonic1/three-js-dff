import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TxdParser, DffParser } from 'rw-parser';
import { Buffer } from 'buffer';
import Model from './Model';

const ModelViewer = () => {
    window.Buffer = Buffer;

    const [modelData, setModelData] = useState(null);
    const [textureData, setTextureData] = useState(null);
    const [renderReady, setRenderReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDffUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = () => {
            const buffer = new Buffer(reader.result);
            const dffParser = new DffParser(buffer);
            const parsedModelData = dffParser.parse();
            setModelData(parsedModelData);
            setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleTxdUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = () => {
            const buffer = new Buffer(reader.result);
            const txdParser = new TxdParser(buffer);
            const parsedTxdData = txdParser.parse();

            const textureNative = parsedTxdData.textureDictionary.textureNatives[0];
            const textureMipmap = textureNative.mipmaps[0];
            const width = textureNative.width;
            const height = textureNative.height;

            setTextureData({
                data: new Uint8Array(textureMipmap),
                width,
                height,
            });
            setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
    };

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
            {/* Sidebar UI Panel */}
            <div className="w-1/5 p-4 bg-gray-800 space-y-4 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">3D Model Viewer</h1>
                
                <div className="w-full mb-2">
                    <label className="block text-sm font-semibold text-gray-300 mb-1">Upload DFF File</label>
                    <input
                        type="file"
                        accept=".dff"
                        onChange={handleDffUpload}
                        className="w-full text-sm text-gray-300 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                </div>
                
                <div className="w-full mb-4">
                    <label className="block text-sm font-semibold text-gray-300 mb-1">Upload TXD File</label>
                    <input
                        type="file"
                        accept=".txd"
                        onChange={handleTxdUpload}
                        className="w-full text-sm text-gray-300 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                </div>
                
                <button
                    onClick={handleRenderClick}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                    Load Model
                </button>
                
                <button
                    onClick={handleReloadModel}
                    className="w-full px-4 py-2 mt-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
                >
                    Reload Model
                </button>
                
                {isLoading && <p className="text-sm text-gray-400 mt-2">Loading...</p>}
            </div>

            {/* 3D Model Viewer */}
            <div className="w-4/5 h-screen flex items-center justify-center">
                {renderReady && modelData && (
                    <Canvas
                        style={{ width: "100%", height: "100%" }}
                        camera={{ position: [0, 1, 10] }}
                    >
                        <ambientLight />
                        <pointLight position={[10, 10, 10]} />
                        <Model modelData={modelData} textureData={textureData} />
                        <OrbitControls enablePan={false} />
                    </Canvas>
                )}
            </div>
        </div>
    );
};

export default ModelViewer;

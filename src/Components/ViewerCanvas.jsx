import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useState, useRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import Model from './Model';
import MultiModel from './MultiModel';
import ModelControls from './ModelControls';
import { LoadingSpinner } from './Notifications';

const ViewerCanvas = memo(({ renderReady, modelData, textureData, isLoading }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [wireframe, setWireframe] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#1a1f36');
    const [webglSupported, setWebglSupported] = useState(true);
    const [webglError, setWebglError] = useState(null);
    const controlsRef = useRef();
    const modelRef = useRef();

    const handleCameraReset = () => {
        try {
            if (controlsRef.current && controlsRef.current.reset) {
                controlsRef.current.reset();
            }
            // Also reset the model rotation
            if (modelRef.current && modelRef.current.resetRotation) {
                modelRef.current.resetRotation();
            }
            // Stop animation when resetting
            setIsAnimating(false);
        } catch (error) {
            console.error('Error resetting camera:', error);
            // Fallback: just stop animation
            setIsAnimating(false);
        }
    };

    const handleAnimationToggle = () => {
        setIsAnimating(!isAnimating);
    };

    const handleBackgroundColorChange = (color) => {
        setBackgroundColor(color);
    };

    // Always use MultiModel to render all geometries (even single DFF files can have multiple parts)
    const shouldUseMultiModel = modelData && (
        (modelData.clump && modelData.clump.geometryList && modelData.clump.geometryList.geometries) ||
        (modelData.geometryList && modelData.geometryList.geometries) ||
        (modelData.geometries)
    );

    // Check WebGL support on component mount
    useEffect(() => {
        const checkWebGLSupport = () => {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                
                if (!gl) {
                    setWebglSupported(false);
                    setWebglError('WebGL is not supported by your browser or graphics card.');
                    return false;
                }

                return true;
            } catch (error) {
                setWebglSupported(false);
                setWebglError(`WebGL initialization failed: ${error.message}`);
                return false;
            }
        };

        checkWebGLSupport();
    }, []);

    const handleCanvasError = (error) => {
        console.error('Canvas error:', error);
        setWebglSupported(false);
        setWebglError('Failed to create WebGL context. This may be due to hardware limitations or browser restrictions.');
    };

    // WebGL Error Fallback Component
    const WebGLErrorFallback = () => (
        <div className="h-full w-full flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md mx-auto p-6">
                <div className="relative">
                    <div className="w-32 h-32 mx-auto border-4 border-red-500/20 rounded-full flex items-center justify-center">
                        <div className="w-20 h-20 border-4 border-red-500/40 rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">
                        WebGL Not Available
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {webglError || 'Your browser or graphics card does not support WebGL, which is required for 3D rendering.'}
                    </p>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 text-left">
                    <h4 className="text-sm font-semibold text-white mb-2">Possible Solutions:</h4>
                    <ul className="text-xs text-slate-400 space-y-1">
                        <li>• Enable hardware acceleration in your browser</li>
                        <li>• Update your graphics drivers</li>
                        <li>• Try a different browser (Chrome, Firefox, Edge)</li>
                        <li>• Restart your browser</li>
                        <li>• Check if WebGL is blocked by browser extensions</li>
                    </ul>
                </div>

                <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
                    <a 
                        href="https://get.webgl.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline"
                    >
                        Test WebGL Support
                    </a>
                    <span>•</span>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="text-purple-400 hover:text-purple-300 underline"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full w-full relative">
            {/* Loading Spinner */}
            <LoadingSpinner isLoading={isLoading} message="Processing files..." />
            
            {!webglSupported ? (
                <WebGLErrorFallback />
            ) : renderReady && modelData ? (
                <div className="h-full w-full">
                    {/* Model Controls */}
                    <ModelControls 
                        onCameraReset={handleCameraReset}
                        onAnimationToggle={handleAnimationToggle}
                        isAnimating={isAnimating}
                        wireframe={wireframe}
                        onWireframeToggle={() => setWireframe(!wireframe)}
                        backgroundColor={backgroundColor}
                        onBackgroundColorChange={handleBackgroundColorChange}
                    />
                <Canvas
                    camera={{ position: [0, 5, 8], fov: 60 }}
                    onError={handleCanvasError}
                    gl={{ 
                        antialias: true, 
                        alpha: true,
                        powerPreference: "high-performance",
                        toneMapping: THREE.ACESFilmicToneMapping,
                        toneMappingExposure: 1.2,
                        clearColor: backgroundColor
                    }}
                >
                    <color attach="background" args={[backgroundColor]} />
                    {/* Improved Lighting */}
                    <ambientLight intensity={0.4} />
                    <directionalLight 
                        position={[5, 10, 10]} 
                        intensity={1.2} 
                        castShadow 
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                    />
                    <pointLight position={[-10, 5, -10]} intensity={0.3} color="#ff6b6b" />
                    <pointLight position={[10, 5, 10]} intensity={0.3} color="#4ecdc4" />
                    
                    
                    {/* Model - Always use MultiModel to render all geometries */}
                    {shouldUseMultiModel ? (
                        <MultiModel 
                            ref={modelRef}
                            modelData={modelData} 
                            textureData={textureData} 
                            isAnimating={isAnimating}
                            wireframe={wireframe}
                        />
                    ) : (
                        <Model 
                            ref={modelRef}
                            modelData={modelData} 
                            textureData={textureData} 
                            isAnimating={isAnimating}
                            wireframe={wireframe}
                        />
                    )}
                    
                    {/* Controls */}
                    <OrbitControls 
                        ref={controlsRef}
                        enablePan={true} 
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={1}
                        maxDistance={50}
                        dampingFactor={0.05}
                        enableDamping={true}
                    />

                </Canvas>
            </div>
        ) : (
            <div className="h-full w-full flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="relative">
                        <div className="w-32 h-32 mx-auto border-4 border-purple-500/20 rounded-full flex items-center justify-center">
                            <div className="w-20 h-20 border-4 border-purple-500/40 rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 border-4 border-purple-500/10 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">
                            Model Viewer Ready
                        </h3>
                        <p className="text-slate-400 max-w-md">
                            Upload your DFF and TXD files, then click Load Model to begin visualization
                        </p>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
});

ViewerCanvas.displayName = 'ViewerCanvas';

ViewerCanvas.propTypes = {
    renderReady: PropTypes.bool.isRequired,
    modelData: PropTypes.object,
    textureData: PropTypes.object,
    isLoading: PropTypes.bool,
};

export default ViewerCanvas;

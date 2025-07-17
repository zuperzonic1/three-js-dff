import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from 'three';
import { useState, useRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import Model from './Model';
import ModelControls from './ModelControls';

const ViewerCanvas = memo(({ renderReady, modelData, textureData }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [wireframe, setWireframe] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [webglSupported, setWebglSupported] = useState(true);
    const [webglError, setWebglError] = useState(null);
    const controlsRef = useRef();
    const modelRef = useRef();

    const handleCameraReset = () => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
        // Also reset the model rotation
        if (modelRef.current) {
            modelRef.current.resetRotation();
        }
        // Stop animation when resetting
        setIsAnimating(false);
    };

    const handleAnimationToggle = () => {
        setIsAnimating(!isAnimating);
    };

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
                                <span className="text-2xl">⚠️</span>
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
                        showStats={showStats}
                        onStatsToggle={() => setShowStats(!showStats)}
                    />
                <Canvas
                    className="bg-gradient-to-br from-slate-900/50 to-purple-900/50"
                    camera={{ position: [0, 5, 8], fov: 60 }}
                    onError={handleCanvasError}
                    gl={{ 
                        antialias: true, 
                        alpha: true,
                        powerPreference: "high-performance",
                        toneMapping: THREE.ACESFilmicToneMapping,
                        toneMappingExposure: 1.2
                    }}
                >
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
                    
                    {/* Grid Helper */}
                    <gridHelper args={[20, 20, '#444444', '#444444']} />
                    
                    {/* Model */}
                    <Model 
                        ref={modelRef}
                        modelData={modelData} 
                        textureData={textureData} 
                        isAnimating={isAnimating}
                        wireframe={wireframe}
                    />
                    
                    {/* Controls */}
                    <OrbitControls 
                        ref={controlsRef}
                        enablePan={true} 
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={1}
                        maxDistance={50}
                        maxPolarAngle={Math.PI}
                        dampingFactor={0.05}
                        enableDamping={true}
                    />

                    {/* Stats */}
                    {showStats && <Stats />}
                </Canvas>
            </div>
        ) : (
            <div className="h-full w-full flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="relative">
                        <div className="w-32 h-32 mx-auto border-4 border-purple-500/20 rounded-full flex items-center justify-center">
                            <div className="w-20 h-20 border-4 border-purple-500/40 rounded-full flex items-center justify-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">🎨</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 border-4 border-purple-500/10 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">
                            Ready to Render
                        </h3>
                        <p className="text-slate-400 max-w-md">
                            Upload your DFF and TXD files, then click &quot;Load Model&quot; to begin visualization
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
};

export default ViewerCanvas;

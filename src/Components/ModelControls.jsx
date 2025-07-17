const ModelControls = ({ 
    onCameraReset, 
    onAnimationToggle, 
    isAnimating, 
    wireframe, 
    onWireframeToggle, 
    showStats, 
    onStatsToggle 
}) => {
    return (
        <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-md rounded-lg p-3 space-y-2 z-10">
            <div className="flex flex-col space-y-2">
                {/* Camera Reset */}
                <button
                    onClick={onCameraReset}
                    className="px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-all"
                    title="Reset Camera"
                >
                    🎯 Reset View
                </button>

                {/* Animation Toggle */}
                <button
                    onClick={onAnimationToggle}
                    className={`px-3 py-2 text-sm rounded transition-all ${
                        isAnimating 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    title="Toggle Animation"
                >
                    {isAnimating ? '⏸️ Stop' : '▶️ Rotate'}
                </button>

                {/* Wireframe Toggle */}
                <button
                    onClick={onWireframeToggle}
                    className={`px-3 py-2 text-sm rounded transition-all ${
                        wireframe 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-slate-600 hover:bg-slate-700 text-white'
                    }`}
                    title="Toggle Wireframe"
                >
                    📐 Wireframe
                </button>

                {/* Stats Toggle */}
                <button
                    onClick={onStatsToggle}
                    className={`px-3 py-2 text-sm rounded transition-all ${
                        showStats 
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                            : 'bg-slate-600 hover:bg-slate-700 text-white'
                    }`}
                    title="Show Statistics"
                >
                    📊 Stats
                </button>
            </div>

            {/* Stats Panel */}
            {showStats && (
                <div className="mt-3 pt-3 border-t border-slate-600 text-xs text-slate-300">
                    <div className="space-y-1">
                        <div>Camera: Three.js</div>
                        <div>Renderer: WebGL</div>
                        <div>Model: GTA DFF</div>
                        <div>Format: San Andreas</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelControls;

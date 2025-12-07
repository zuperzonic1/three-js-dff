import PropTypes from 'prop-types';

const ModelControls = ({ 
    onCameraReset, 
    onAnimationToggle, 
    isAnimating, 
    wireframe, 
    onWireframeToggle 
}) => {
    return (
        <div className="absolute top-4 right-4 bg-slate-800/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 space-y-3 z-10">
            <div className="flex flex-col space-y-2">
                {/* Camera Reset */}
                <button
                    onClick={onCameraReset}
                    className="w-full px-4 py-2.5 bg-purple-600/80 hover:bg-purple-600 text-white text-sm rounded border border-purple-500/20 transition-all font-medium backdrop-blur-sm"
                    title="Reset Camera"
                >
                    Reset View
                </button>

                {/* Animation Toggle */}
                <button
                    onClick={onAnimationToggle}
                    className={`w-full px-4 py-2.5 text-sm rounded border transition-all font-medium backdrop-blur-sm ${
                        isAnimating 
                            ? 'bg-red-600/80 hover:bg-red-600 border-red-500/20 text-white' 
                            : 'bg-slate-600/80 hover:bg-slate-600 border-slate-500/20 text-white'
                    }`}
                    title="Toggle Animation"
                >
                    {isAnimating ? 'Stop Rotation' : 'Start Rotation'}
                </button>

                {/* Wireframe Toggle */}
                <button
                    onClick={onWireframeToggle}
                    className={`w-full px-4 py-2.5 text-sm rounded border transition-all font-medium backdrop-blur-sm ${
                        wireframe 
                            ? 'bg-blue-600/80 hover:bg-blue-600 border-blue-500/20 text-white' 
                            : 'bg-slate-600/80 hover:bg-slate-600 border-slate-500/20 text-white'
                    }`}
                    title="Toggle Wireframe"
                >
                    {wireframe ? 'Solid View' : 'Wireframe'}
                </button>
            </div>
        </div>
    );
};

ModelControls.propTypes = {
    onCameraReset: PropTypes.func.isRequired,
    onAnimationToggle: PropTypes.func.isRequired,
    isAnimating: PropTypes.bool.isRequired,
    wireframe: PropTypes.bool.isRequired,
    onWireframeToggle: PropTypes.func.isRequired,
};

export default ModelControls;

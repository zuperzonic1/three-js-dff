const ControlPanel = ({ onRenderClick, onReloadClick, isLoading, modelData, textureData }) => (
    <div className="space-y-6 mt-6">
        {/* Action Buttons */}
        <div className="space-y-3">
            <button
                onClick={onRenderClick}
                disabled={!modelData || !textureData || isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 
                         text-white font-semibold rounded-lg 
                         hover:from-purple-600 hover:to-pink-600 
                         disabled:opacity-50 disabled:cursor-not-allowed 
                         disabled:from-slate-600 disabled:to-slate-600
                         transition-all duration-200 
                         flex items-center justify-center space-x-2"
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                    </>
                ) : (
                    <span>🚀 Load Model</span>
                )}
            </button>
            
            <button
                onClick={onReloadClick}
                className="w-full py-3 px-4 bg-slate-600 text-white font-semibold rounded-lg 
                         hover:bg-slate-500 transition-all duration-200
                         flex items-center justify-center space-x-2"
            >
                <span>🔄 Reset Viewer</span>
            </button>
        </div>

        {/* File Status */}
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
            <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <span>📊</span>
                <span>File Status</span>
            </h4>
            <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-slate-300">DFF Model:</span>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${modelData ? 'bg-green-400' : 'bg-slate-600'}`}></div>
                        <span className={modelData ? 'text-green-400' : 'text-slate-500'}>
                            {modelData ? 'Loaded' : 'Not loaded'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-300">TXD Texture:</span>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${textureData ? 'bg-green-400' : 'bg-slate-600'}`}></div>
                        <span className={textureData ? 'text-green-400' : 'text-slate-500'}>
                            {textureData ? 'Loaded' : 'Not loaded'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ControlPanel;

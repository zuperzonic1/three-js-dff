import PropTypes from 'prop-types';

const ControlPanel = ({ onReloadClick, isLoading, modelData, textureData }) => (
    <div className="space-y-6 mt-6">
        {/* Action Buttons */}
        <div className="space-y-3">
            <div className="w-full py-3 px-4 text-center">
                {isLoading ? (
                    <div className="flex items-center justify-center space-x-2 text-purple-400">
                        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-medium">Loading...</span>
                    </div>
                ) : modelData && textureData ? (
                    <div className="flex items-center justify-center space-x-2 text-green-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="font-medium">Auto-Loaded</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center space-x-2 text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <span>Upload both files to auto-load</span>
                    </div>
                )}
            </div>
            
            <button
                onClick={onReloadClick}
                className="w-full py-3 px-4 bg-slate-600 text-white font-semibold rounded-lg 
                         hover:bg-slate-500 transition-all duration-200
                         flex items-center justify-center space-x-2"
            >
                <span>Reset Viewer</span>
            </button>
        </div>

        {/* File Status */}
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
            <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
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

ControlPanel.propTypes = {
    onReloadClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    modelData: PropTypes.object,
    textureData: PropTypes.object,
};

export default ControlPanel;

import PropTypes from 'prop-types';

const MergeControls = ({ canMerge, isProcessing, onMerge, onClear, status, buttonText = 'Merge Models' }) => {
    return (
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="space-y-4">
                {status && (
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                        <div className="flex items-center space-x-2">
                            {isProcessing && (
                                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            )}
                            <span className="text-sm text-slate-300">{status}</span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                        onClick={onMerge}
                        disabled={!canMerge || isProcessing}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <span>{buttonText}</span>
                        )}
                    </button>

                    <button
                        onClick={onClear}
                        disabled={isProcessing}
                        className="py-3 px-6 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 disabled:opacity-50 transition-all duration-200"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};

MergeControls.propTypes = {
    canMerge: PropTypes.bool.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    onMerge: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    status: PropTypes.string,
    buttonText: PropTypes.string
};

export default MergeControls;

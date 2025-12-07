import PropTypes from 'prop-types';

const MergedModelPreview = ({ model, textures, dffCount, txdCount }) => {
    const getGeometryCount = () => {
        if (!model || !model.clump || !model.clump.geometryList) return 0;
        return model.clump.geometryList.geometryCount || model.clump.geometryList.geometries?.length || 0;
    };

    const getTextureCount = () => {
        return textures?.textureCount || 0;
    };

    return (
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="text-white font-semibold">Merge Complete</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-400">{dffCount}</div>
                        <div className="text-xs text-slate-400">DFF Files</div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-pink-400">{txdCount}</div>
                        <div className="text-xs text-slate-400">TXD Files</div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-400">{getGeometryCount()}</div>
                        <div className="text-xs text-slate-400">Geometries</div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-400">{getTextureCount()}</div>
                        <div className="text-xs text-slate-400">Textures</div>
                    </div>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600">
                    <h4 className="text-white font-medium mb-2">Merge Summary</h4>
                    <div className="text-sm text-slate-300 space-y-1">
                        <div>✓ Combined {dffCount} DFF model files into a single scene</div>
                        <div>✓ Merged {txdCount} TXD texture files</div>
                        <div>✓ Generated {getGeometryCount()} combined geometries</div>
                        <div>✓ Models positioned with spacing to avoid overlap</div>
                    </div>
                </div>

                <div className="text-xs text-slate-500">
                    The merged model is ready to be loaded in the viewer. Each original DFF model has been positioned with a 5-unit offset to prevent overlapping.
                </div>
            </div>
        </div>
    );
};

MergedModelPreview.propTypes = {
    model: PropTypes.object,
    textures: PropTypes.object,
    dffCount: PropTypes.number.isRequired,
    txdCount: PropTypes.number.isRequired
};

export default MergedModelPreview;

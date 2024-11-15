import FileUpload from './FileUpload';

const ControlPanel = ({ onRenderClick, onReloadClick, isLoading, setIsLoading, setModelData, setTextureData }) => (
    <div className="w-1/5 p-6 bg-dark-panel space-y-4 flex flex-col items-center rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-neon-orange mb-4">DFF Viewer</h1>
        
        <FileUpload setModelData={setModelData} setTextureData={setTextureData} setIsLoading={setIsLoading} />
        
        <button
            onClick={onRenderClick}
            className="w-full px-4 py-2 bg-neon-orange text-black font-semibold rounded-lg hover:bg-orange-500 transition-colors duration-200"
        >
            Load Model
        </button>
        
        <button
            onClick={onReloadClick}
            className="w-full px-4 py-2 mt-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
            Reload Model
        </button>
        
        {isLoading && <p className="text-sm text-gray-400 mt-2">Loading...</p>}
    </div>
);

export default ControlPanel;

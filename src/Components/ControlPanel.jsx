import FileUpload from './FileUpload';

const ControlPanel = ({ onRenderClick, onReloadClick, isLoading, setIsLoading, setModelData, setTextureData }) => (
    <div className="w-1/5 p-4 bg-gray-800 space-y-4 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">3D Model Viewer</h1>
        <FileUpload setModelData={setModelData} setTextureData={setTextureData} setIsLoading={setIsLoading} />
        
        <button
            onClick={onRenderClick}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        >
            Load Model
        </button>
        
        <button
            onClick={onReloadClick}
            className="w-full px-4 py-2 mt-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
        >
            Reload Model
        </button>
        
        {isLoading && <p className="text-sm text-gray-400 mt-2">Loading...</p>}
    </div>
);

export default ControlPanel;

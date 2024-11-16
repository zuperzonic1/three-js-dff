import FileUpload from './FileUpload';

const ControlPanel = ({ onRenderClick, onReloadClick, isLoading, setIsLoading, setModelData, setTextureData }) => (
    <div className="w-full md:w-1/3 lg:w-1/4 p-4 md:p-6 bg-dark-panel space-y-4 flex flex-col items-center rounded-lg shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold text-[#FF8C42] mb-4 text-center">3D Model Viewer</h1>
        
        <FileUpload setModelData={setModelData} setTextureData={setTextureData} setIsLoading={setIsLoading} />
        
        <button
            onClick={onRenderClick}
            className="w-full px-4 py-2 mt-4 bg-[#FF6D00] text-black font-semibold rounded-lg hover:bg-[#FF5700] transition-colors duration-200"
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

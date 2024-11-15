import { TxdParser, DffParser } from 'rw-parser';

const FileUpload = ({ setModelData, setTextureData, setIsLoading }) => {
    const handleDffUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = () => {
            const buffer = new Buffer(reader.result);
            const dffParser = new DffParser(buffer);
            const parsedModelData = dffParser.parse();
            setModelData(parsedModelData);
            setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleTxdUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = () => {
            const buffer = new Buffer(reader.result);
            const txdParser = new TxdParser(buffer);
            const parsedTxdData = txdParser.parse();

            const textureNative = parsedTxdData.textureDictionary.textureNatives[0];
            const textureMipmap = textureNative.mipmaps[0];
            const width = textureNative.width;
            const height = textureNative.height;

            setTextureData({
                data: new Uint8Array(textureMipmap),
                width,
                height,
            });
            setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <div className="w-full mb-2">
                <label className="block text-sm font-semibold text-gray-300 mb-1">Upload DFF File</label>
                <input
                    type="file"
                    accept=".dff"
                    onChange={handleDffUpload}
                    className="w-full text-sm text-gray-300 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
            </div>
            <div className="w-full mb-4">
                <label className="block text-sm font-semibold text-gray-300 mb-1">Upload TXD File</label>
                <input
                    type="file"
                    accept=".txd"
                    onChange={handleTxdUpload}
                    className="w-full text-sm text-gray-300 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
            </div>
        </div>
    );
};

export default FileUpload;

import { useState, useEffect } from 'react';
import { TxdParser, DffParser } from 'rw-parser';
import { Buffer } from 'buffer';
import outputData from '../assets/output.json';

const FileUpload = ({ setModelData, setTextureData, setIsLoading }) => {
    const [selectedDff, setSelectedDff] = useState(null);
    const [selectedTxd, setSelectedTxd] = useState(null);
    const [options, setOptions] = useState([]);
    const [isDffUploaded, setIsDffUploaded] = useState(false);
    const [isTxdUploaded, setIsTxdUploaded] = useState(false);

    useEffect(() => {
        const dropdownOptions = outputData.map(item => ({
            id: item.ID,
            model: item.Model,
        }));
        setOptions(dropdownOptions);
    }, []);

    const handleUpload = async (file, type) => {
        if (!file) return;

        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = () => {
            const buffer = new Buffer(reader.result);
            if (type === 'dff') {
                const dffParser = new DffParser(buffer);
                const parsedModelData = dffParser.parse();
                setModelData(parsedModelData);
                setIsDffUploaded(true);
            } else if (type === 'txd') {
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
                setIsTxdUploaded(true);
            }
            setIsLoading(false);
        };

        reader.onerror = () => {
            setIsLoading(false);
            console.error("Error reading file");
        };

        reader.readAsArrayBuffer(file);
    };

    const downloadFile = (type) => {
        const selected = type === 'dff' ? selectedDff : selectedTxd;
        if (!selected) return;

        const fileName = `${selected}.${type}`;
        const filePath = `/gtasa-skins/${fileName}`;

        const link = document.createElement('a');
        link.href = filePath;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const useFile = (type) => {
        const selected = type === 'dff' ? selectedDff : selectedTxd;
        if (!selected) return;

        const fileName = `${selected}.${type}`;
        const filePath = `/gtasa-skins/${fileName}`;

        fetch(filePath)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], fileName, { type: type === 'dff' ? 'application/octet-stream' : 'image/txd' });
                handleUpload(file, type);
            })
            .catch(error => console.error("Error fetching file:", error));
    };

    return (
        <div className="bg-dark-panel p-4 md:p-6 rounded-lg shadow-lg text-white w-full">
            {/* DFF File Section */}
            <div className="w-full mb-4">
                <label className="block text-sm font-semibold text-[#FF8C42] mb-1">Upload DFF File</label>
                <input
                    type="file"
                    accept=".dff"
                    onChange={(e) => handleUpload(e.target.files[0], 'dff')}
                    className="w-full text-sm file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-dark-bg file:text-[#FF8C42] hover:file:bg-gray-700"
                />
                <div className="flex flex-col sm:flex-row items-center mt-2 space-y-2 sm:space-y-0 sm:space-x-2">
                    <select
                        className="w-full sm:w-auto text-sm bg-dark-bg text-[#FF8C42] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                        onChange={(e) => setSelectedDff(e.target.value)}
                        value={selectedDff || ''}
                    >
                        <option value="" disabled>Select DFF to Download</option>
                        {options.map(option => (
                            <option key={option.id} value={option.model}>
                                {option.id} - {option.model}
                            </option>
                        ))}
                    </select>
                    <div className="flex w-full sm:w-auto space-x-2">
                        <button
                            className="p-2 w-full sm:w-auto bg-[#FF8C42] text-black font-semibold rounded hover:bg-[#FF6D00]"
                            onClick={() => downloadFile('dff')}
                            disabled={!selectedDff}
                        >
                            Download
                        </button>
                        <button
                            className="p-2 w-full sm:w-auto bg-[#FF8C42] text-black font-semibold rounded hover:bg-[#FF6D00]"
                            onClick={() => useFile('dff')}
                            disabled={!selectedDff}
                        >
                            Use File
                        </button>
                    </div>
                </div>
            </div>

            {/* TXD File Section */}
            <div className="w-full mb-4">
                <label className="block text-sm font-semibold text-[#FF8C42] mb-1">Upload TXD File</label>
                <input
                    type="file"
                    accept=".txd"
                    onChange={(e) => handleUpload(e.target.files[0], 'txd')}
                    className="w-full text-sm file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-dark-bg file:text-[#FF8C42] hover:file:bg-gray-700"
                />
                <div className="flex flex-col sm:flex-row items-center mt-2 space-y-2 sm:space-y-0 sm:space-x-2">
                    <select
                        className="w-full sm:w-auto text-sm bg-dark-bg text-[#FF8C42] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                        onChange={(e) => setSelectedTxd(e.target.value)}
                        value={selectedTxd || ''}
                    >
                        <option value="" disabled>Select TXD to Download</option>
                        {options.map(option => (
                            <option key={option.id} value={option.model}>
                                {option.id} - {option.model}
                            </option>
                        ))}
                    </select>
                    <div className="flex w-full sm:w-auto space-x-2">
                        <button
                            className="p-2 w-full sm:w-auto bg-[#FF8C42] text-black font-semibold rounded hover:bg-[#FF6D00]"
                            onClick={() => downloadFile('txd')}
                            disabled={!selectedTxd}
                        >
                            Download
                        </button>
                        <button
                            className="p-2 w-full sm:w-auto bg-[#FF8C42] text-black font-semibold rounded hover:bg-[#FF6D00]"
                            onClick={() => useFile('txd')}
                            disabled={!selectedTxd}
                        >
                            Use File
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;

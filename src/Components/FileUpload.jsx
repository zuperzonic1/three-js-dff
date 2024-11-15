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
        // Populate dropdown options from output.json
        const dropdownOptions = outputData.map(item => ({
            id: item.ID,
            model: item.Model,
        }));
        setOptions(dropdownOptions);
    }, []);

    // Unified upload handler to minimize redundant code
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

    // Download selected file
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

    // Use selected file and treat it as an upload
    const useFile = (type) => {
        const selected = type === 'dff' ? selectedDff : selectedTxd;
        if (!selected) return;

        const fileName = `${selected}.${type}`;
        const filePath = `/gtasa-skins/${fileName}`;

        fetch(filePath)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], fileName, { type: type === 'dff' ? 'application/octet-stream' : 'image/txd' });
                handleUpload(file, type); // Use the same upload handler for consistent processing
            })
            .catch(error => console.error("Error fetching file:", error));
    };

    return (
        <div>
            {/* DFF File Section */}
            <div className="w-full mb-2">
                <label className="block text-sm font-semibold text-gray-300 mb-1">Upload DFF File</label>
                <input
                    type="file"
                    accept=".dff"
                    onChange={(e) => handleUpload(e.target.files[0], 'dff')}
                    className="w-full text-sm text-gray-300 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
                <div className="flex items-center mt-2">
                    <select
                        className="text-sm bg-gray-700 text-white rounded p-2"
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
                    <button
                        className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 rounded"
                        onClick={() => downloadFile('dff')}
                        disabled={!selectedDff}
                    >
                        Download
                    </button>
                    <button
                        className="ml-2 p-2 bg-green-600 hover:bg-green-700 rounded"
                        onClick={() => useFile('dff')}
                        disabled={!selectedDff}
                    >
                        Use File
                    </button>
                </div>
            </div>

            {/* TXD File Section */}
            <div className="w-full mb-4">
                <label className="block text-sm font-semibold text-gray-300 mb-1">Upload TXD File</label>
                <input
                    type="file"
                    accept=".txd"
                    onChange={(e) => handleUpload(e.target.files[0], 'txd')}
                    className="w-full text-sm text-gray-300 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
                <div className="flex items-center mt-2">
                    <select
                        className="text-sm bg-gray-700 text-white rounded p-2"
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
                    <button
                        className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 rounded"
                        onClick={() => downloadFile('txd')}
                        disabled={!selectedTxd}
                    >
                        Download
                    </button>
                    <button
                        className="ml-2 p-2 bg-green-600 hover:bg-green-700 rounded"
                        onClick={() => useFile('txd')}
                        disabled={!selectedTxd}
                    >
                        Use File
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;

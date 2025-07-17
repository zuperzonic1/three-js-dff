import { useState, memo } from 'react';
import { TxdParser, DffParser } from 'rw-parser';
import { Buffer } from 'buffer';
import PropTypes from 'prop-types';

const FileUpload = memo(({ setModelData, setTextureData, setIsLoading }) => {
    const [isDffDragOver, setIsDffDragOver] = useState(false);
    const [isTxdDragOver, setIsTxdDragOver] = useState(false);
    const [selectedDffFile, setSelectedDffFile] = useState(null);
    const [selectedTxdFile, setSelectedTxdFile] = useState(null);

    const handleUpload = async (file, type) => {
        if (!file) return;

        // Set the selected file name
        if (type === 'dff') {
            setSelectedDffFile(file);
        } else if (type === 'txd') {
            setSelectedTxdFile(file);
        }

        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = () => {
            const buffer = new Buffer(reader.result);
            if (type === 'dff') {
                try {
                    const dffParser = new DffParser(buffer);
                    const parsedModelData = dffParser.parse();
                    console.log('Parsed DFF Model Data:', parsedModelData);
                    if (!parsedModelData) {
                        console.error('DFF parsing returned null or undefined.');
                    }
                    setModelData(parsedModelData);
                } catch (err) {
                    console.error('Error parsing DFF file:', err);
                }
            } else if (type === 'txd') {
                try {
                    const txdParser = new TxdParser(buffer);
                    const parsedTxdData = txdParser.parse();

                    const textureNative = parsedTxdData.textureDictionary.textureNatives[0];
                    const textureMipmap = textureNative.mipmaps[0];
                    const width = textureNative.width;
                    const height = textureNative.height;

                    console.log('Parsed TXD Texture Data:', {
                        data: new Uint8Array(textureMipmap),
                        width,
                        height,
                    });

                    setTextureData({
                        data: new Uint8Array(textureMipmap),
                        width,
                        height,
                    });
                } catch (err) {
                    console.error('Error parsing TXD file:', err);
                }
            }
            setIsLoading(false);
        };

        reader.onerror = () => {
            setIsLoading(false);
            console.error("Error reading file");
        };

        reader.readAsArrayBuffer(file);
    };

    const handleDffDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDffDragOver) {
            console.log('DFF drag over activated');
            setIsDffDragOver(true);
        }
    };

    const handleDffDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Only set to false if we're actually leaving the drop zone
        if (e.currentTarget && !e.currentTarget.contains(e.relatedTarget)) {
            console.log('DFF drag leave activated');
            setIsDffDragOver(false);
        }
    };

    const handleDffDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDffDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        const file = files[0];
        if (file) {
            const extension = file.name.split('.').pop().toLowerCase();
            if (extension === 'dff') {
                handleUpload(file, 'dff');
            } else {
                alert('Please drop a .dff file');
            }
        }
    };

    const handleTxdDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isTxdDragOver) {
            console.log('TXD drag over activated');
            setIsTxdDragOver(true);
        }
    };

    const handleTxdDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Only set to false if we're actually leaving the drop zone
        if (e.currentTarget && !e.currentTarget.contains(e.relatedTarget)) {
            console.log('TXD drag leave activated');
            setIsTxdDragOver(false);
        }
    };

    const handleTxdDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsTxdDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        const file = files[0];
        if (file) {
            const extension = file.name.split('.').pop().toLowerCase();
            if (extension === 'txd') {
                handleUpload(file, 'txd');
            } else {
                alert('Please drop a .txd file');
            }
        }
    };


    return (
        <div className="space-y-6">
            {/* DFF File Section */}
            <div
                className={`bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border transition-all duration-200 relative ${
                    isDffDragOver 
                        ? 'border-purple-400 border-2 bg-purple-500/20 shadow-xl shadow-purple-500/30 scale-[1.02] ring-2 ring-purple-500/50' 
                        : 'border-purple-500/20 hover:border-purple-500/40'
                }`}
                onDragOver={handleDffDragOver}
                onDragLeave={handleDffDragLeave}
                onDrop={handleDffDrop}
                onDragEnter={handleDffDragOver}
                role="button"
                tabIndex="0"
            >
                <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <h3 className="text-white font-semibold">DFF Model File</h3>
                </div>
                <div className="space-y-3">
                    <div className="relative">
                        <input
                            type="file"
                            accept=".dff"
                            onChange={(e) => handleUpload(e.target.files[0], 'dff')}
                            className="w-full text-sm text-slate-300 
                                     file:mr-4 file:py-2 file:px-4 
                                     file:rounded-lg file:border-0 
                                     file:text-sm file:font-medium 
                                     file:bg-purple-500/20 file:text-purple-300 
                                     hover:file:bg-purple-500/30 
                                     file:cursor-pointer cursor-pointer
                                     border border-slate-600 rounded-lg bg-slate-800/50"
                        />
                    </div>
                    {selectedDffFile && (
                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                <span className="text-sm text-slate-300">Selected file:</span>
                                <span className="text-sm text-green-400 font-medium">{selectedDffFile.name}</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                Size: {(selectedDffFile.size / 1024).toFixed(1)} KB
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* TXD File Section */}
            <div
                className={`bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border transition-all duration-200 relative ${
                    isTxdDragOver 
                        ? 'border-pink-400 border-2 bg-pink-500/20 shadow-xl shadow-pink-500/30 scale-[1.02] ring-2 ring-pink-500/50' 
                        : 'border-purple-500/20 hover:border-pink-500/40'
                }`}
                onDragOver={handleTxdDragOver}
                onDragLeave={handleTxdDragLeave}
                onDrop={handleTxdDrop}
                onDragEnter={handleTxdDragOver}
                role="button"
                tabIndex="0"
            >
                <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <h3 className="text-white font-semibold">TXD Texture File</h3>
                </div>
                <div className="space-y-3">
                    <div className="relative">
                        <input
                            type="file"
                            accept=".txd"
                            onChange={(e) => handleUpload(e.target.files[0], 'txd')}
                            className="w-full text-sm text-slate-300 
                                     file:mr-4 file:py-2 file:px-4 
                                     file:rounded-lg file:border-0 
                                     file:text-sm file:font-medium 
                                     file:bg-pink-500/20 file:text-pink-300 
                                     hover:file:bg-pink-500/30 
                                     file:cursor-pointer cursor-pointer
                                     border border-slate-600 rounded-lg bg-slate-800/50"
                        />
                    </div>
                    {selectedTxdFile && (
                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                <span className="text-sm text-slate-300">Selected file:</span>
                                <span className="text-sm text-green-400 font-medium">{selectedTxdFile.name}</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                Size: {(selectedTxdFile.size / 1024).toFixed(1)} KB
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

FileUpload.displayName = 'FileUpload';

FileUpload.propTypes = {
    setModelData: PropTypes.func.isRequired,
    setTextureData: PropTypes.func.isRequired,
    setIsLoading: PropTypes.func.isRequired,
};

export default FileUpload;

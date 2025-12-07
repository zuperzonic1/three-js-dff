import { useState, useEffect, useRef, memo } from 'react';
import { TxdParser, DffParser } from 'rw-parser';
import { Buffer } from 'buffer';
import PropTypes from 'prop-types';

const FileUpload = memo(({ setModelData, setTextureData, setIsLoading, resetTrigger }) => {
    const [isDffDragOver, setIsDffDragOver] = useState(false);
    const [isTxdDragOver, setIsTxdDragOver] = useState(false);
    const [selectedDffFile, setSelectedDffFile] = useState(null);
    const [selectedTxdFile, setSelectedTxdFile] = useState(null);
    const dffInputRef = useRef(null);
    const txdInputRef = useRef(null);

    // Reset file selections when resetTrigger changes
    useEffect(() => {
        setSelectedDffFile(null);
        setSelectedTxdFile(null);
        if (dffInputRef.current) {
            dffInputRef.current.value = '';
        }
        if (txdInputRef.current) {
            txdInputRef.current.value = '';
        }
    }, [resetTrigger]);

    const processDFFWithMultiMesh = (parsedModelData) => {
        if (!parsedModelData) return parsedModelData;

        let geometries = [];
        if (parsedModelData.clump?.geometryList?.geometries) {
            geometries = parsedModelData.clump.geometryList.geometries;
        } else if (parsedModelData.geometryList?.geometries) {
            geometries = parsedModelData.geometryList.geometries;
        }

        console.log(`Enhanced FileUpload: Found ${geometries.length} geometries in DFF`);
        
        return {
            ...parsedModelData,
            clump: {
                ...parsedModelData.clump,
                geometryList: {
                    ...parsedModelData.clump?.geometryList,
                    geometries: geometries,
                    geometryCount: geometries.length
                }
            }
        };
    };

    const readFileAsBuffer = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(new Buffer(reader.result));
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const handleUpload = async (file, type) => {
        if (!file) return;

        if (type === 'dff') {
            setSelectedDffFile(file);
        } else if (type === 'txd') {
            setSelectedTxdFile(file);
        }

        setIsLoading(true);
        try {
            const buffer = await readFileAsBuffer(file);
            
            if (type === 'dff') {
                const dffParser = new DffParser(buffer);
                const parsedModelData = dffParser.parse();
                console.log(`Parsed DFF Model Data (${file.name}):`, parsedModelData);
                
                if (parsedModelData) {
                    const enhancedModelData = processDFFWithMultiMesh(parsedModelData);
                    setModelData({ ...enhancedModelData, sourceFile: file.name });
                }
            } else if (type === 'txd') {
                const txdParser = new TxdParser(buffer);
                const parsedTxdData = txdParser.parse();
                
                console.log(`Processing TXD file: ${file.name}`, parsedTxdData);
                
                if (parsedTxdData?.textureDictionary?.textureNatives) {
                    const textureNatives = parsedTxdData.textureDictionary.textureNatives;
                    console.log(`Found ${textureNatives.length} textures in ${file.name}`);
                    
                    // Process all textures from the single TXD file
                    const allTextures = textureNatives.map((native, index) => {
                        const textureMipmap = native.mipmaps[0];
                        return {
                            data: new Uint8Array(textureMipmap),
                            width: native.width,
                            height: native.height,
                            name: native.textureName || native.name || `texture_${index}`,
                            sourceFile: file.name,
                            index: index
                        };
                    });

                    console.log('Parsed TXD Texture Data:', allTextures.map(tex => ({
                        name: tex.name,
                        size: `${tex.width}x${tex.height}`,
                        sourceFile: tex.sourceFile
                    })));

                    if (allTextures.length > 0) {
                        setTextureData({
                            data: allTextures[0].data,
                            width: allTextures[0].width,
                            height: allTextures[0].height,
                            allTextures: allTextures,
                            textureCount: allTextures.length
                        });
                    }
                }
            }
        } catch (error) {
            console.error(`Error processing ${type} file:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDffDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDffDragOver(true);
    };

    const handleDffDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDffDragOver(false);
        }
    };

    const handleDffDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDffDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.name.toLowerCase().endsWith('.dff')
        );
        if (files.length > 0) {
            handleUpload(files[0], 'dff');
        }
    };

    const handleTxdDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsTxdDragOver(true);
    };

    const handleTxdDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsTxdDragOver(false);
        }
    };

    const handleTxdDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsTxdDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.name.toLowerCase().endsWith('.txd')
        );
        if (files.length > 0) {
            handleUpload(files[0], 'txd');
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
                            ref={dffInputRef}
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
                            ref={txdInputRef}
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
    resetTrigger: PropTypes.number,
};

export default FileUpload;

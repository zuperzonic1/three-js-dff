import { useState, useCallback } from 'react';
import { DffParser, TxdParser } from 'rw-parser';
import { Buffer } from 'buffer';
import PropTypes from 'prop-types';
import FileUploadZone from './FileUploadZone';
import MergedModelPreview from './MergedModelPreview';
import MergeControls from './MergeControls';
import ViewerCanvas from '../ViewerCanvas';

const DFFMergerTool = ({ onMergedModelReady }) => {
    const [dffFiles, setDffFiles] = useState([]);
    const [txdFiles, setTxdFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mergedModel, setMergedModel] = useState(null);
    const [mergedTextures, setMergedTextures] = useState(null);
    const [processingStatus, setProcessingStatus] = useState('');
    const [renderReady, setRenderReady] = useState(false);

    const handleDffFilesAdded = useCallback((files) => {
        const newFiles = Array.from(files).map((file, index) => ({
            id: Date.now() + index,
            file,
            name: file.name,
            size: file.size,
            parsed: null,
            error: null
        }));
        setDffFiles(prev => [...prev, ...newFiles]);
    }, []);

    const handleTxdFilesAdded = useCallback((files) => {
        const newFiles = Array.from(files).map((file, index) => ({
            id: Date.now() + index,
            file,
            name: file.name,
            size: file.size,
            parsed: null,
            error: null
        }));
        setTxdFiles(prev => [...prev, ...newFiles]);
    }, []);

    const removeDffFile = useCallback((id) => {
        setDffFiles(prev => prev.filter(f => f.id !== id));
    }, []);

    const removeTxdFile = useCallback((id) => {
        setTxdFiles(prev => prev.filter(f => f.id !== id));
    }, []);

    const parseFile = async (fileData, type) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const buffer = new Buffer(reader.result);
                    if (type === 'dff') {
                        const parser = new DffParser(buffer);
                        const parsed = parser.parse();
                        resolve(parsed);
                    } else if (type === 'txd') {
                        const parser = new TxdParser(buffer);
                        const parsed = parser.parse();
                        resolve(parsed);
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(fileData.file);
        });
    };

    const mergeDFFModels = (parsedDffFiles) => {
        if (parsedDffFiles.length === 0) return null;
        
        // Log the structure to understand the DFF format
        console.log('First DFF structure:', parsedDffFiles[0]);
        
        // Start with the first model as base
        const baseModel = parsedDffFiles[0];
        
        // Check for different possible DFF structures
        if (!baseModel) {
            console.error('Base model is null or undefined');
            return null;
        }

        // For simplicity, we'll combine geometries from multiple models
        const mergedGeometries = [];
        
        parsedDffFiles.forEach((model, index) => {
            console.log(`Processing model ${index}:`, model);
            
            // Handle different possible DFF structures
            let geometries = [];
            
            if (model && model.clump && model.clump.geometryList && model.clump.geometryList.geometries) {
                geometries = model.clump.geometryList.geometries;
            } else if (model && model.clump && model.clump.geometries) {
                geometries = model.clump.geometries;
            } else if (model && model.geometryList && model.geometryList.geometries) {
                geometries = model.geometryList.geometries;
            } else if (model && model.geometries) {
                geometries = model.geometries;
            } else {
                console.warn(`No geometries found in model ${index}:`, model);
                return;
            }

            geometries.forEach((geometry, geoIndex) => {
                if (!geometry) return;
                
                // Add an offset to avoid overlapping models
                const offset = index * 5; // 5 units apart
                
                // Clone geometry and add position offset
                const mergedGeometry = {
                    ...geometry,
                    morphTargets: geometry.morphTargets?.map(target => ({
                        ...target,
                        vertices: target.vertices?.map(vertex => ({
                            x: vertex.x + offset,
                            y: vertex.y,
                            z: vertex.z
                        }))
                    })),
                    // Add identifier for source file
                    sourceFile: `model_${index}_geo_${geoIndex}`
                };
                
                mergedGeometries.push(mergedGeometry);
            });
        });

        // Create merged model structure that matches the expected format
        let mergedModel;
        
        if (baseModel.clump && baseModel.clump.geometryList) {
            mergedModel = {
                ...baseModel,
                clump: {
                    ...baseModel.clump,
                    geometryList: {
                        ...baseModel.clump.geometryList,
                        geometries: mergedGeometries,
                        geometryCount: mergedGeometries.length
                    }
                }
            };
        } else if (baseModel.clump) {
            mergedModel = {
                ...baseModel,
                clump: {
                    ...baseModel.clump,
                    geometryList: {
                        geometries: mergedGeometries,
                        geometryCount: mergedGeometries.length
                    }
                }
            };
        } else {
            // Fallback structure
            mergedModel = {
                ...baseModel,
                clump: {
                    geometryList: {
                        geometries: mergedGeometries,
                        geometryCount: mergedGeometries.length
                    }
                }
            };
        }

        console.log('Merged model:', mergedModel);
        return mergedModel;
    };

    const mergeTXDTextures = (parsedTxdFiles) => {
        if (parsedTxdFiles.length === 0) return null;

        // Combine all texture natives from multiple TXD files
        const allTextureNatives = [];
        const textureMap = new Map(); // To avoid duplicates

        parsedTxdFiles.forEach((txd, index) => {
            if (txd && txd.textureDictionary && txd.textureDictionary.textureNatives) {
                txd.textureDictionary.textureNatives.forEach((native, nativeIndex) => {
                    const textureKey = native.name || `texture_${index}_${nativeIndex}`;
                    
                    if (!textureMap.has(textureKey)) {
                        textureMap.set(textureKey, {
                            ...native,
                            sourceFile: `txd_${index}`,
                            originalIndex: nativeIndex
                        });
                        allTextureNatives.push(textureMap.get(textureKey));
                    }
                });
            }
        });

        // Use the first texture for the main texture data (for Three.js compatibility)
        const primaryTexture = allTextureNatives[0];
        if (!primaryTexture || !primaryTexture.mipmaps || !primaryTexture.mipmaps[0]) {
            return null;
        }

        return {
            data: new Uint8Array(primaryTexture.mipmaps[0]),
            width: primaryTexture.width,
            height: primaryTexture.height,
            allTextures: allTextureNatives, // Include all textures for advanced usage
            textureCount: allTextureNatives.length
        };
    };

    const processMerge = async () => {
        if (dffFiles.length === 0) {
            setProcessingStatus('No DFF files to merge');
            return;
        }

        setIsProcessing(true);
        setProcessingStatus('Parsing DFF files...');

        try {
            // Parse all DFF files
            const parsedDffFiles = [];
            for (let i = 0; i < dffFiles.length; i++) {
                setProcessingStatus(`Parsing DFF file ${i + 1}/${dffFiles.length}...`);
                try {
                    const parsed = await parseFile(dffFiles[i], 'dff');
                    parsedDffFiles.push(parsed);
                    
                    // Update file status
                    setDffFiles(prev => prev.map(f => 
                        f.id === dffFiles[i].id 
                            ? { ...f, parsed: true, error: null }
                            : f
                    ));
                } catch (error) {
                    console.error(`Error parsing DFF file ${dffFiles[i].name}:`, error);
                    setDffFiles(prev => prev.map(f => 
                        f.id === dffFiles[i].id 
                            ? { ...f, parsed: false, error: error.message }
                            : f
                    ));
                }
            }

            // Parse all TXD files if any
            let parsedTxdFiles = [];
            if (txdFiles.length > 0) {
                setProcessingStatus('Parsing TXD files...');
                for (let i = 0; i < txdFiles.length; i++) {
                    setProcessingStatus(`Parsing TXD file ${i + 1}/${txdFiles.length}...`);
                    try {
                        const parsed = await parseFile(txdFiles[i], 'txd');
                        parsedTxdFiles.push(parsed);
                        
                        setTxdFiles(prev => prev.map(f => 
                            f.id === txdFiles[i].id 
                                ? { ...f, parsed: true, error: null }
                                : f
                        ));
                    } catch (error) {
                        console.error(`Error parsing TXD file ${txdFiles[i].name}:`, error);
                        setTxdFiles(prev => prev.map(f => 
                            f.id === txdFiles[i].id 
                                ? { ...f, parsed: false, error: error.message }
                                : f
                        ));
                    }
                }
            }

            // Merge models
            setProcessingStatus('Merging models...');
            const merged = mergeDFFModels(parsedDffFiles.filter(Boolean));
            
            // Merge textures
            const mergedTex = mergeTXDTextures(parsedTxdFiles.filter(Boolean));

            setMergedModel(merged);
            setMergedTextures(mergedTex);
            setProcessingStatus(`Successfully merged ${parsedDffFiles.length} models and ${parsedTxdFiles.length} textures`);
            
            // Auto-render in integrated viewer
            if (merged) {
                setRenderReady(true);
            }

            // Callback to parent component (optional)
            if (onMergedModelReady && merged) {
                onMergedModelReady(merged, mergedTex);
            }

        } catch (error) {
            console.error('Merge process error:', error);
            setProcessingStatus(`Error during merge: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const clearAll = () => {
        setDffFiles([]);
        setTxdFiles([]);
        setMergedModel(null);
        setMergedTextures(null);
        setProcessingStatus('');
        setRenderReady(false);
    };

    return (
        <div className="h-full w-full flex">
            {/* Left Panel - Controls */}
            <div className="w-96 p-6 bg-slate-800/20 border-r border-purple-500/20 space-y-6 overflow-y-auto">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-white">Custom Models</h2>
                    <p className="text-slate-400 text-sm">Combine multiple DFF models and TXD textures</p>
                </div>

                {/* File Upload Zones */}
                <div className="space-y-4">
                    <FileUploadZone
                        title="DFF Model Files"
                        accept=".dff"
                        files={dffFiles}
                        onFilesAdded={handleDffFilesAdded}
                        onRemoveFile={removeDffFile}
                        color="purple"
                    />
                    
                    <FileUploadZone
                        title="TXD Texture Files"
                        accept=".txd"
                        files={txdFiles}
                        onFilesAdded={handleTxdFilesAdded}
                        onRemoveFile={removeTxdFile}
                        color="pink"
                    />
                </div>

                {/* Merge Controls */}
                <MergeControls
                    canMerge={dffFiles.length > 0}
                    isProcessing={isProcessing}
                    onMerge={processMerge}
                    onClear={clearAll}
                    status={processingStatus}
                />

                {/* Preview */}
                {(mergedModel || mergedTextures) && (
                    <MergedModelPreview
                        model={mergedModel}
                        textures={mergedTextures}
                        dffCount={dffFiles.length}
                        txdCount={txdFiles.length}
                    />
                )}
            </div>

            {/* Right Panel - Integrated 3D Viewer */}
            <div className="flex-1">
                <ViewerCanvas
                    renderReady={renderReady}
                    modelData={mergedModel}
                    textureData={mergedTextures}
                    isLoading={isProcessing}
                />
            </div>
        </div>
    );
};

DFFMergerTool.propTypes = {
    onMergedModelReady: PropTypes.func
};

export default DFFMergerTool;

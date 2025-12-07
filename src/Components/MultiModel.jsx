import { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import loadTexture from './TextureLoader';

const parseGeometryToThree = (geometry, meshIndex = 0) => {
    const threeGeometry = new THREE.BufferGeometry();

    if (!geometry) {
        console.error("Invalid geometry provided to parse.");
        return threeGeometry;
    }

    const { vertexInformation: verticesArray, binMesh, textureMappingInformation: textureInfo } = geometry;
    
    // Use specific mesh index, default to 0 for backwards compatibility
    const targetMesh = binMesh?.meshes[meshIndex];
    const indicesArray = targetMesh?.indices;
    const uvsArray = textureInfo && textureInfo.length > 0 ? textureInfo[0] : null;

    console.log(`Processing mesh ${meshIndex} of ${binMesh?.meshes?.length || 0} total meshes`);
    console.log(`Mesh ${meshIndex} indices:`, indicesArray?.length);

    if (!verticesArray || !indicesArray) {
        console.error(`Mesh ${meshIndex} is missing vertices or indices.`);
        return threeGeometry;
    }

    const vertices = new Float32Array(verticesArray.length * 3);
    verticesArray.forEach((vertex, i) => {
        vertices[i * 3] = vertex.x;
        vertices[i * 3 + 1] = vertex.y;
        vertices[i * 3 + 2] = vertex.z;
    });

    // Check if we need Uint32Array instead of Uint16Array for large models
    const indices = verticesArray.length > 65535 
        ? new Uint32Array(indicesArray) 
        : new Uint16Array(indicesArray);

    console.log(`Mesh ${meshIndex} - Vertices: ${verticesArray.length}, Indices: ${indicesArray.length}, Index type: ${indices.constructor.name}`);

    threeGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    threeGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
    threeGeometry.computeVertexNormals();

    // Validate geometry
    const positionAttribute = threeGeometry.getAttribute('position');
    const indexAttribute = threeGeometry.getIndex();
    console.log(`Mesh ${meshIndex} - Position count: ${positionAttribute.count}, Index count: ${indexAttribute ? indexAttribute.count : 'none'}`);
    
    // Check bounding box
    threeGeometry.computeBoundingBox();
    const bbox = threeGeometry.boundingBox;
    console.log(`Mesh ${meshIndex} - Bounding box:`, {
        min: { x: bbox.min.x, y: bbox.min.y, z: bbox.min.z },
        max: { x: bbox.max.x, y: bbox.max.y, z: bbox.max.z },
        size: { 
            x: bbox.max.x - bbox.min.x, 
            y: bbox.max.y - bbox.min.y, 
            z: bbox.max.z - bbox.min.z 
        }
    });

    if (uvsArray) {
        const uvs = new Float32Array(uvsArray.length * 2);
        uvsArray.forEach((uv, i) => {
            uvs[i * 2] = uv.u;
            uvs[i * 2 + 1] = uv.v;
        });
        threeGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    }

    return threeGeometry;
};

const MultiModel = forwardRef(({ modelData, textureData, isAnimating = false, wireframe = false }, ref) => {
    const groupRef = useRef();

    const geometries = useMemo(() => {
        console.log("=== MULTIMODEL ANALYSIS ===");
        console.log("Full modelData structure:", modelData);
        
        if (!modelData) {
            console.warn("No model data provided");
            return [];
        }

        // Try different structure patterns
        let geoList = null;
        let structureUsed = '';

        if (modelData.clump && modelData.clump.geometryList && modelData.clump.geometryList.geometries) {
            geoList = modelData.clump.geometryList.geometries;
            structureUsed = 'clump.geometryList.geometries';
        } else if (modelData.geometryList && modelData.geometryList.geometries) {
            geoList = modelData.geometryList.geometries;
            structureUsed = 'geometryList.geometries';
        } else if (modelData.clump && modelData.clump.geometries) {
            geoList = modelData.clump.geometries;
            structureUsed = 'clump.geometries';
        } else if (modelData.geometries) {
            geoList = modelData.geometries;
            structureUsed = 'geometries';
        }

        console.log(`Geometry structure used: ${structureUsed}`);
        console.log("Geometry list:", geoList);
        console.log(`Found ${geoList ? geoList.length : 0} geometries`);

        if (!geoList || geoList.length === 0) {
            console.warn("No geometries found in any structure pattern");
            return [];
        }

            // Log each geometry details
            geoList.forEach((geo, index) => {
                console.log(`=== GEOMETRY ${index} ===`);
                console.log("Raw geometry:", geo);
                console.log("Vertex info:", geo?.vertexInformation?.length);
                console.log("Bin mesh:", geo?.binMesh);
                console.log("Bin mesh details:", geo?.binMesh?.meshes?.length, "meshes");
                console.log("Texture mapping:", geo?.textureMappingInformation?.length);
                console.log("Material info:", geo?.materialList);
                console.log("Material count:", geo?.materialList?.materialData?.length);
                
                // NEW: Detailed material data inspection
                if (geo?.materialList?.materialData) {
                    console.log("=== MATERIAL DATA ANALYSIS ===");
                    geo.materialList.materialData.forEach((material, matIndex) => {
                        console.log(`Material ${matIndex}:`, {
                            complete: material,
                            textureName: material?.textureName,
                            texture: material?.texture,
                            textureObject: material?.texture ? {
                                textureName: material.texture.textureName,
                                name: material.texture.name,
                                textureReference: material.texture.textureReference,
                                fullObject: material.texture
                            } : null,
                            surfaceProperties: material?.surfaceProperties,
                            hasCullMode: material?.hasCullMode,
                            isLit: material?.isLit,
                            color: material?.color
                        });
                    });
                }
                
                // Check for nested geometry structures
                if (geo.children) {
                    console.log("Found children:", geo.children.length);
                }
                if (geo.atomics) {
                    console.log("Found atomics:", geo.atomics.length);
                }
                if (geo.geometryList) {
                    console.log("Found nested geometryList:", geo.geometryList);
                }
            });

        // Also check the parent model for additional structures
        console.log("=== CHECKING PARENT MODEL STRUCTURES ===");
        if (modelData.clump) {
            console.log("Clump structure:", Object.keys(modelData.clump));
            if (modelData.clump.atomicList) {
                console.log("Atomic list:", modelData.clump.atomicList);
            }
            if (modelData.clump.frameList) {
                console.log("Frame list:", modelData.clump.frameList);
            }
        }
        
        const allMeshes = [];
        
        geoList.forEach((geo, geoIndex) => {
            const meshCount = geo?.binMesh?.meshes?.length || 0;
            console.log(`Geometry ${geoIndex} has ${meshCount} sub-meshes`);
            
            // Process each mesh within this geometry
            for (let meshIndex = 0; meshIndex < meshCount; meshIndex++) {
                try {
                    console.log(`Processing geometry ${geoIndex}, mesh ${meshIndex}...`);
                    const threeGeometry = parseGeometryToThree(geo, meshIndex);
                    console.log(`Geometry ${geoIndex}, mesh ${meshIndex} processed successfully`);
                    
                    // Get material index for this mesh from binMesh
                    const targetMesh = geo?.binMesh?.meshes[meshIndex];
                    const materialIndex = targetMesh?.materialIndex !== undefined ? targetMesh.materialIndex : meshIndex;
                    
                    console.log(`Mesh ${meshIndex} material assignment:`, {
                        targetMesh: targetMesh,
                        materialIndex: materialIndex,
                        meshMaterialIndex: targetMesh?.materialIndex,
                        fallbackToMeshIndex: targetMesh?.materialIndex === undefined
                    });
                    
                    allMeshes.push({
                        geometry: threeGeometry,
                        sourceFile: geo.sourceFile || `geometry_${geoIndex}_mesh_${meshIndex}`,
                        geoIndex,
                        meshIndex,
                        materialIndex,
                        originalGeo: geo
                    });
                } catch (error) {
                    console.error(`Error parsing geometry ${geoIndex}, mesh ${meshIndex}:`, error);
                }
            }
        });

        console.log(`Total meshes to render: ${allMeshes.length}`);
        return allMeshes;
    }, [modelData]);

    // Create textures array for multi-material support
    const textures = useMemo(() => {
        if (!textureData) return [];
        
        if (textureData.allTextures && textureData.allTextures.length > 0) {
            console.log(`Loading ${textureData.allTextures.length} textures from TXD`);
            return textureData.allTextures.map((texData, index) => {
                const texture = loadTexture(texData);
                console.log(`Loaded texture ${index}: ${texData.name} (${texData.width}x${texData.height})`);
                return texture;
            });
        } else {
            // Fallback to single texture for backwards compatibility
            return [loadTexture(textureData)];
        }
    }, [textureData]);

    // Expose reset function to parent
    useImperativeHandle(ref, () => ({
        resetRotation: () => {
            if (groupRef.current) {
                groupRef.current.rotation.set(Math.PI / 2, Math.PI, Math.PI / 2);
            }
        }
    }));

    // Animation frame
    useFrame((state, delta) => {
        if (groupRef.current && isAnimating) {
            groupRef.current.rotation.z += delta * 0.8;
        }
    });

    return (
        <group ref={groupRef} scale={5} rotation={[Math.PI / 2, Math.PI, Math.PI / 2]}>
            {geometries.map((geoData, index) => {
                // Get the appropriate texture for this material index
                const materialIndex = geoData.materialIndex || 0;
                
                // Try to get material data for texture name matching
                const materialData = geoData.originalGeo?.materialList?.materialData?.[materialIndex];
                
                // Extract texture name from various possible locations
                let requestedTextureName = null;
                if (materialData?.textureName) {
                    requestedTextureName = materialData.textureName;
                } else if (materialData?.texture?.textureName) {
                    requestedTextureName = materialData.texture.textureName;
                } else if (materialData?.texture?.name) {
                    requestedTextureName = materialData.texture.name;
                } else if (materialData?.texture?.textureReference) {
                    requestedTextureName = materialData.texture.textureReference;
                } else if (typeof materialData?.texture === 'string') {
                    requestedTextureName = materialData.texture;
                }
                
                // Enhanced texture mapping: try texture name matching first, then fallback
                let textureToUse = null;
                let mappingStrategy = 'none';
                
                if (textures.length > 0) {
                    // Strategy 1: Try to match by texture name
                    if (requestedTextureName && typeof requestedTextureName === 'string' && textureData?.allTextures) {
                        const matchingTexture = textureData.allTextures.find(tex => 
                            tex.name === requestedTextureName || 
                            (tex.name && tex.name.toLowerCase() === requestedTextureName.toLowerCase())
                        );
                        if (matchingTexture) {
                            const textureIndex = textureData.allTextures.indexOf(matchingTexture);
                            textureToUse = textures[textureIndex];
                            mappingStrategy = 'name-match';
                        }
                    }
                    
                    // Strategy 2: Direct material index mapping
                    if (!textureToUse && materialIndex < textures.length) {
                        textureToUse = textures[materialIndex];
                        mappingStrategy = 'index-direct';
                    }
                    
                    // Strategy 3: Intelligent fallback for missing textures
                    if (!textureToUse) {
                        const fallbackIndex = materialIndex % textures.length;
                        textureToUse = textures[fallbackIndex];
                        mappingStrategy = 'index-fallback';
                    }
                }
                
                console.log(`Rendering mesh ${index}:`, {
                    materialIndex: materialIndex,
                    requestedTextureName: requestedTextureName,
                    mappingStrategy: mappingStrategy,
                    textureAssigned: textureToUse ? 'yes' : 'no',
                    availableTextures: textures.length
                });
                
                return (
                    <mesh 
                        key={`${geoData.sourceFile}_${index}`}
                        geometry={geoData.geometry}
                    >
                        <meshStandardMaterial 
                            map={textureToUse} 
                            wireframe={wireframe}
                            metalness={0.1}
                            roughness={0.8}
                            transparent={true}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                );
            })}
        </group>
    );
});

MultiModel.displayName = 'MultiModel';

export default MultiModel;

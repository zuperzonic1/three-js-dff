import * as THREE from 'three';

const parseDffToGeometry = (parsedModelData) => {
    console.log("=== GEOMETRY PARSER ANALYSIS ===");
    console.log("Full parsed model data:", parsedModelData);
    
    const geometry = new THREE.BufferGeometry();

    if (!parsedModelData) {
        console.error("No model data provided to parse.");
        return geometry;
    }

    // Check different structure patterns
    let geometryList = null;
    let structureUsed = '';

    if (parsedModelData.geometryList && parsedModelData.geometryList.geometries) {
        geometryList = parsedModelData.geometryList.geometries;
        structureUsed = 'geometryList.geometries';
    } else if (parsedModelData.clump && parsedModelData.clump.geometryList && parsedModelData.clump.geometryList.geometries) {
        geometryList = parsedModelData.clump.geometryList.geometries;
        structureUsed = 'clump.geometryList.geometries';
    } else if (parsedModelData.geometries) {
        geometryList = parsedModelData.geometries;
        structureUsed = 'geometries';
    }

    console.log(`Structure used: ${structureUsed}`);
    console.log("Geometry list:", geometryList);
    console.log(`Found ${geometryList ? geometryList.length : 0} total geometries`);

    if (!geometryList || geometryList.length === 0) {
        console.error("No geometries found in model data.");
        return geometry;
    }

    // Log all geometries but still only use the first one (for backwards compatibility)
    geometryList.forEach((geo, index) => {
        console.log(`=== SINGLE MODEL GEOMETRY ${index} ===`);
        console.log("Geometry data:", geo);
        console.log("Vertices:", geo?.vertexInformation?.length);
        console.log("Indices:", geo?.binMesh?.meshes?.[0]?.indices?.length);
        console.log("UVs:", geo?.textureMappingInformation?.[0]?.length);
        console.log("Materials:", geo?.materialList);
    });

    console.log(`⚠️  WARNING: Only rendering geometry 0 of ${geometryList.length} available geometries!`);

    const firstGeometry = geometryList[0];
    const { vertexInformation: verticesArray, binMesh, textureMappingInformation: textureInfo } = firstGeometry;

    const indicesArray = binMesh?.meshes[0]?.indices;
    const uvsArray = textureInfo && textureInfo.length > 0 ? textureInfo[0] : null;

    if (!verticesArray || !indicesArray) {
        console.error("First geometry is missing vertices or indices.");
        return geometry;
    }

    const vertices = new Float32Array(verticesArray.length * 3);
    verticesArray.forEach((vertex, i) => {
        vertices[i * 3] = vertex.x;
        vertices[i * 3 + 1] = vertex.y;
        vertices[i * 3 + 2] = vertex.z;
    });

    const indices = new Uint16Array(indicesArray);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    if (uvsArray) {
        const uvs = new Float32Array(uvsArray.length * 2);
        uvsArray.forEach((uv, i) => {
            uvs[i * 2] = uv.u;
            uvs[i * 2 + 1] = uv.v;
        });
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    } else {
        console.warn("No UV coordinates found; model will render without texture.");
    }

    return geometry;
};

export default parseDffToGeometry;

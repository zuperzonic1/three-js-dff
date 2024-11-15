import * as THREE from 'three';

const parseDffToGeometry = (parsedModelData) => {
    const geometry = new THREE.BufferGeometry();

    if (!parsedModelData || !parsedModelData.geometryList.geometries[0]) {
        console.error("Invalid model data provided to parse.");
        return geometry;
    }

    const firstGeometry = parsedModelData.geometryList.geometries[0];
    const { vertexInformation: verticesArray, binMesh, textureMappingInformation: textureInfo } = firstGeometry;

    const indicesArray = binMesh?.meshes[0]?.indices;
    const uvsArray = textureInfo && textureInfo.length > 0 ? textureInfo[0] : null;

    if (!verticesArray || !indicesArray) {
        console.error("Parsed model data is missing vertices or indices.");
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

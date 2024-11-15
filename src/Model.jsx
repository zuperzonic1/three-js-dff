import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const parseDffToGeometry = (parsedModelData) => {
    const geometry = new THREE.BufferGeometry();

    console.log("Starting to parse geometry from model data...");
    const firstGeometry = parsedModelData.geometryList.geometries[0];
    const verticesArray = firstGeometry.vertexInformation;
    const binMesh = firstGeometry.binMesh.meshes[0];
    const indicesArray = binMesh.indices;
    const textureMappingInfo = firstGeometry.textureMappingInformation;

    // Check if UVs are present in the textureMappingInformation
    let uvsArray;
    if (textureMappingInfo && textureMappingInfo.length > 0) {
        uvsArray = textureMappingInfo[0];
        console.log("5ara",textureMappingInfo[0]);
    }

    console.log("Vertices Array:", verticesArray);
    console.log("Indices Array:", indicesArray);
    console.log("UV Coordinates Array:", uvsArray);

    if (!verticesArray || !indicesArray) {
        console.error("Parsed model data is missing vertices or indices.");
        return geometry;
    }

    try {
        const vertices = new Float32Array(verticesArray.flatMap(vertex => [vertex.x, vertex.y, vertex.z]));
        const indices = new Uint16Array(indicesArray);

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.computeVertexNormals();

        if (uvsArray) {
            const uvs = new Float32Array(uvsArray.flatMap(uv => [uv.u, uv.v]));
            geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
            console.log("UVs applied to geometry.");
        } else {
            console.warn("No UV coordinates found; model will render without texture.");
        }
    } catch (error) {
        console.error("Error while creating geometry:", error);
    }

    return geometry;
};

function Model({ modelData, textureData }) {
    const meshRef = useRef();

    const texture = textureData ? new THREE.DataTexture(
        textureData.data,
        textureData.width,
        textureData.height,
        THREE.RGBAFormat
    ) : null;

    if (texture) {
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.needsUpdate = true;
    }

    console.log("Parsing model data to create geometry...");
    const geometry = parseDffToGeometry(modelData);

    return (
        <mesh ref={meshRef} geometry={geometry} scale={5} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
            <meshBasicMaterial map={texture || null} />
        </mesh>
    );
}

export default Model;

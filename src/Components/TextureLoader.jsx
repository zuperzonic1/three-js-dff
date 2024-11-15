import * as THREE from 'three';

const loadTexture = (textureData) => {
    if (!textureData) return null;

    const texture = new THREE.DataTexture(
        textureData.data,
        textureData.width,
        textureData.height,
        THREE.RGBAFormat
    );

    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;

    return texture;
};

export default loadTexture;

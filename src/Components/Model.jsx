import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import parseDffToGeometry from './GeometryParser';
import loadTexture from './TextureLoader';

function Model({ modelData, textureData }) {
    const meshRef = useRef();

    const geometry = useMemo(() => parseDffToGeometry(modelData), [modelData]);
    const texture = useMemo(() => loadTexture(textureData), [textureData]);

    return (
        <mesh ref={meshRef} geometry={geometry} scale={5} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
            <meshBasicMaterial map={texture || null} />
        </mesh>
    );
}

export default Model;

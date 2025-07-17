import { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import parseDffToGeometry from './GeometryParser';
import loadTexture from './TextureLoader';

const Model = forwardRef(({ modelData, textureData, isAnimating = false, wireframe = false }, ref) => {
    const meshRef = useRef();

    const geometry = useMemo(() => parseDffToGeometry(modelData), [modelData]);
    const texture = useMemo(() => loadTexture(textureData), [textureData]);

    // Expose reset function to parent
    useImperativeHandle(ref, () => ({
        resetRotation: () => {
            if (meshRef.current) {
                meshRef.current.rotation.set(Math.PI / 2, Math.PI, Math.PI / 2);
            }
        }
    }));

    // Animation frame
    useFrame((state, delta) => {
        if (meshRef.current && isAnimating) {
            meshRef.current.rotation.z += delta * 0.8; // Rotate around Z-axis for upright spinning (showing off outfit)
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry} scale={5} rotation={[Math.PI / 2, Math.PI, Math.PI / 2]}>
            <meshStandardMaterial 
                map={texture || null} 
                wireframe={wireframe}
                metalness={0.1}
                roughness={0.8}
            />
        </mesh>
    );
});

export default Model;
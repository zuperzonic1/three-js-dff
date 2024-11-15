import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model from './Model';

const ViewerCanvas = ({ renderReady, modelData, textureData }) => (
    <div className="w-4/5 h-screen flex items-center justify-center">
        {renderReady && modelData && (
            <Canvas
                style={{ width: "100%", height: "100%" }}
                camera={{ position: [0, 1, 10] }}
            >
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Model modelData={modelData} textureData={textureData} />
                <OrbitControls enablePan={false} />
            </Canvas>
        )}
    </div>
);

export default ViewerCanvas;

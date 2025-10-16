import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface HappyMacFaceProps {
  isThinking?: boolean;
  isTalking?: boolean;
}

function MacComputer({ isTalking }: { isTalking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += isTalking ? 0.02 : 0.005;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [isTalking]);

  return (
    <group ref={groupRef}>
      {/* Monitor body - beige */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 3, 2]} />
        <meshStandardMaterial color="#E8DCC8" />
      </mesh>

      {/* Screen - dark blue/gray */}
      <mesh position={[0, 0.3, 1.01]}>
        <boxGeometry args={[2, 2, 0.1]} />
        <meshStandardMaterial color="#4A5568" emissive="#2D3748" emissiveIntensity={0.3} />
      </mesh>

      {/* Happy Mac screen content - glowing */}
      <mesh position={[0, 0.3, 1.06]}>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={isTalking ? 0.8 : 0.4} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.25, 0.5, 1.07]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.25, 0.5, 1.07]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 0.15, 1.07]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.3, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Base */}
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial color="#D4C4A8" />
      </mesh>

      {/* Disk drive slot */}
      <mesh position={[0, -0.8, 1.01]}>
        <boxGeometry args={[1.2, 0.2, 0.05]} />
        <meshStandardMaterial color="#2D3748" />
      </mesh>

      {/* Apple logo area */}
      <mesh position={[0, -1.8, 1.01]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color="#2D3748" />
      </mesh>
    </group>
  );
}

const HappyMacFace = ({ isThinking = false, isTalking = false }: HappyMacFaceProps) => {
  return (
    <div className="relative inline-block w-full max-w-[600px]">
      <div className={`transition-transform duration-200 ${isTalking ? 'scale-105' : 'scale-100'}`}>
        <Canvas style={{ height: '500px', width: '100%' }}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            autoRotate={!isTalking}
            autoRotateSpeed={2}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          <pointLight position={[0, 0, 5]} intensity={0.5} />
          
          {/* Mac Computer */}
          <MacComputer isTalking={isTalking} />
        </Canvas>
      </div>
      {isThinking && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <div className="w-6 h-6 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-6 h-6 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-6 h-6 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
    </div>
  );
};

export default HappyMacFace;

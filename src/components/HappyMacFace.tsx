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
  const mouthRef = useRef<THREE.Mesh>(null);
  const lowerLipRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    let animationId: number;
    let time = 0;
    
    const animate = () => {
      time += 0.1;
      
      // Animate mouth when talking
      if (mouthRef.current && lowerLipRef.current && isTalking) {
        // Mouth opens and closes
        const mouthScale = 1 + Math.sin(time * 0.5) * 0.3;
        mouthRef.current.scale.y = mouthScale;
        
        // Lower lip moves down when mouth opens
        const lipOffset = Math.sin(time * 0.5) * 0.1;
        lowerLipRef.current.position.y = 0.05 - lipOffset;
      } else if (mouthRef.current && lowerLipRef.current) {
        // Reset to normal when not talking
        mouthRef.current.scale.y = 1;
        lowerLipRef.current.position.y = 0.05;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [isTalking]);

  return (
    <group ref={groupRef} scale={1.5}>
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

      {/* Upper lip/smile */}
      <mesh ref={mouthRef} position={[0, 0.15, 1.07]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.3, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Lower lip - moves when talking */}
      <mesh ref={lowerLipRef} position={[0, 0.05, 1.07]}>
        <boxGeometry args={[0.5, 0.05, 0.01]} />
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
    <div className="relative inline-block w-full max-w-[800px]">
      <div className={`transition-transform duration-200 ${isTalking ? 'scale-105' : 'scale-100'}`}>
        <Canvas style={{ height: '700px', width: '100%' }}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            minDistance={6}
            maxDistance={20}
            autoRotate={false}
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

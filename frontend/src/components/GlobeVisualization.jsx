import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Globe = () => {
  const globeRef = useRef();
  const pointsRef = useRef();

  // Sample data for blood donation statistics
  const donationData = [
    { country: 'US', position: [0, 0, 1], color: '#ff0000', intensity: 0.8 },
    { country: 'UK', position: [0.5, 0.5, 0.5], color: '#ff0000', intensity: 0.6 },
    { country: 'India', position: [0.8, 0.2, 0.3], color: '#ff0000', intensity: 0.9 },
    { country: 'China', position: [0.3, 0.8, 0.4], color: '#ff0000', intensity: 0.7 },
    { country: 'Brazil', position: [-0.5, -0.5, 0.5], color: '#ff0000', intensity: 0.5 },
  ];

  useEffect(() => {
    // Create points for donation statistics
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(donationData.length * 3);
    const colors = new Float32Array(donationData.length * 3);

    donationData.forEach((data, i) => {
      positions[i * 3] = data.position[0];
      positions[i * 3 + 1] = data.position[1];
      positions[i * 3 + 2] = data.position[2];

      const color = new THREE.Color(data.color);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    pointsRef.current = new THREE.Points(geometry, material);
  }, []);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Sphere ref={globeRef} args={[1, 100, 100]}>
        <MeshDistortMaterial
          color="#3d1c56"
          attach="material"
          distort={0.3}
          speed={1.5}
          radius={1}
        />
      </Sphere>
      <primitive object={pointsRef.current} />
    </>
  );
};

const GlobeVisualization = () => {
  return (
    <div className="w-full h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <Globe />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
        />
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Blood Donation Statistics</h3>
        <p className="text-sm">Red dots indicate blood donation activity</p>
      </div>
    </div>
  );
};

export default GlobeVisualization; 
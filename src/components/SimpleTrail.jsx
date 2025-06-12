import { useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import trailVertexShader from "../shaders/trail/vertex.glsl";
import trailFragmentShader from "../shaders/trail/fragment.glsl";

useRef;

const SimpleTrail = ({
  target = null,
  color = "#ffffff",
  intensity = 6,
  numPoints = 20,
  height = 0.42,
  minDistance = 0.1,
  opacity = 0.5,
  duration = 20,
}) => {
  const meshRef = useRef();

  // to store the current position of our target-cursor
  const positions = useRef(
    new Array(numPoints).fill(new THREE.Vector3(0, 0, 0))
  );

  const lastUnshift = useRef(Date.now());

  useFrame(() => {
    if (!meshRef.current || !target.current) return;

    const currentPosition = target.current.position;

    // Check if the new position is significantly different from the last stored position
    const lastPosition = positions.current[0];

    const distanceToLast = lastPosition.distanceTo(currentPosition);

    if (distanceToLast < minDistance) {
      if (Date.now() - lastUnshift.current < duration) {
        positions.current.unshift(lastPosition);
        positions.current.pop();
        lastUnshift.current = Date.now();
      } else {
      }
    }
    if (distanceToLast > minDistance) {
      // Shift positions to make room for the new position
      positions.current.unshift(currentPosition.clone());
      positions.current.pop(); // Remove the last position to maintain the fixed size of the array
    }

    const geometry = meshRef.current.geometry;
    const positionsAttribute = geometry.getAttribute("position");
    for (let i = 0; i < numPoints; i++) {
      const point = positions.current[positions.current.length - 1 - i];
      positionsAttribute.setXYZ(i * 2, point.x, point.y - height / 2, point.z);
      positionsAttribute.setXYZ(
        i * 2 + 1,
        point.x,
        point.y + height / 2,
        point.z
      );
    }
    positionsAttribute.needsUpdate = true;

    // Update the geometry with the new positions
    // meshRef.current.geometry.setFromPoints(positions.current);
  });
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 1, numPoints - 1]} />
      <trailMaterial
        color={color}
        side={THREE.DoubleSide}
        transparent
        opacity={opacity}
        depthWrite={false}
        intensity={intensity}
      />
    </mesh>
  );
};

export default SimpleTrail;

const TrailMaterial = shaderMaterial(
  {
    color: new THREE.Color("white"),
    opacity: 1,
    intensity: 1,
  },
  trailVertexShader,
  trailFragmentShader
);

extend({ TrailMaterial });

import React, { useRef } from "react";
import { lerp } from "three/src/math/MathUtils.js";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import SimpleTrail from "./SimpleTrail";

const tempVector = new THREE.Vector3();

const Cursor = () => {
  const { color, intensity, opacity, size } = useControls("Cursor", {
    size: { value: 0.2, min: 0.1, max: 3, step: 0.01 },
    color: "#dfbcff",
    intensity: { value: 4.6, min: 1, max: 10, step: 0.1 },
    opacity: { value: 0.5, min: 0, max: 1, step: 0.01 },
  });
  const target = useRef();

  // to get the mouse position on the screen we need the screen size:
  const viewport = useThree((state) => state.viewport);

  useFrame(({ pointer }, delta) => {
    if (!target.current) return;
    tempVector.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );
    target.current.position.lerp(tempVector, delta * 10);

    // const elapsedTime = clock.getElapsedTime();
    // target.current.position.x = Math.sin(elapsedTime) * 5;
    // target.current.position.y = Math.cos(elapsedTime * 2) * 4; // much faster oscillation
    // target.current.position.z = Math.sin(elapsedTime * 4) * 10;
  });
  return (
    <>
      <group ref={target}>
        <mesh visible={false}>
          <sphereGeometry args={[size / 2, 32, 32]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={opacity}
            emissive={color}
            emissiveIntensity={intensity}
          />
        </mesh>
      </group>
      <SimpleTrail
        target={target}
        color={color}
        opacity={opacity}
        intensity={intensity}
        height={size}
      />
    </>
  );
};

export default Cursor;

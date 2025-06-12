import React, { useRef, useMemo } from "react";
import { AdditiveBlending, Color, Vector3 } from "three";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { Trail, useScroll } from "@react-three/drei";
import { MeshLineMaterial, MeshLineGeometry } from "meshline";
import { lerp } from "three/src/math/MathUtils.js";

const tmpVector = new Vector3();
const LERP_SPEED = 10;

const Comet = ({
  length,
  size,
  color,
  startPosition,
  orbitSpeed,
  coinSpeed,
  radius,
  planetOrbitSpeed,
  rotation,
}) => {
  const containerRef = useRef();
  const ref = useRef();

  const emissiveColor = useMemo(() => {
    const newColor = new Color(color);
    newColor.multiplyScalar(5);
    return newColor;
  }, [color]);

  // to have access to the scroll data:
  const data = useScroll();
  const viewport = useThree((state) => state.viewport);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;

    //The delta value represents the time between the current frame and the previous frame.
    //It's used to make the movement smooth and consistent.
    //if you switch from one tab to another, the delta value can be very high
    // when you come back to the tab. This is not a bug, it's just that the updates
    // are not called when the tab is not active. So when you come back,
    //the delta value is high and the movement can be jerky. => smootDelta
    const smoothDelta = Math.min(0.1, delta);

    const coinMode = data.visible(1 / 4, 1 / 4);
    const planetOrbitMode = data.visible(2 / 4, 1 / 4);
    const cardMode = data.visible(3 / 4, 1 / 4);
    let containerTarget = 0;

    if (planetOrbitMode) {
      containerTarget = -viewport.height * 2;
      // If in coin mode, we move the comet faster
      tmpVector.x = Math.cos(clock.elapsedTime * planetOrbitSpeed) * radius;
      tmpVector.y = Math.sin(clock.elapsedTime * planetOrbitSpeed) * radius;
      tmpVector.z = 0;
    } else if (coinMode) {
      containerTarget = -viewport.height;
      // If in coin mode, we move the comet faster
      tmpVector.x = Math.cos(clock.elapsedTime * coinSpeed) * radius;
      tmpVector.y = Math.sin(clock.elapsedTime * coinSpeed) * radius;
      tmpVector.z = 0;
    } else if (cardMode) {
      containerTarget = -viewport.height * 3;
      // If in coin mode, we move the comet faster
      tmpVector.x = Math.sin(clock.elapsedTime * orbitSpeed) * viewport.width;
      tmpVector.y = Math.cos(clock.elapsedTime * orbitSpeed * 8) * 2;
      tmpVector.z = -2 + Math.cos(clock.elapsedTime * orbitSpeed) * 1; // -2 to be behind the card
    } else {
      tmpVector.x = startPosition[0];
      tmpVector.y = Math.sin(clock.elapsedTime * orbitSpeed) * 20;
      tmpVector.z = -5 + Math.cos(clock.elapsedTime * orbitSpeed) * 80;
    }

    // we use the distance betweeen the current position and the target position to adjust
    // the interpolation speed
    const distance = ref.current.position.distanceTo(tmpVector);
    const lerpFactor = Math.min(1, Math.max(0.0005, 10 / distance));

    ref.current.position.lerp(tmpVector, smoothDelta * LERP_SPEED * lerpFactor);
    containerRef.current.position.y = lerp(
      containerRef.current.position.y,
      containerTarget,
      smoothDelta * LERP_SPEED
    );
    containerRef.current.rotation.x = lerp(
      containerRef.current.rotation.x,
      planetOrbitMode ? rotation[0] : 0,
      smoothDelta * LERP_SPEED
    );
    containerRef.current.rotation.y = lerp(
      containerRef.current.rotation.y,
      planetOrbitMode ? rotation[1] : 0,
      smoothDelta * LERP_SPEED
    );
  });
  return (
    <group ref={containerRef}>
      <Trail
        width={size} // Width of the line
        //color={"hotpink"} // Color of the line
        length={length} // Length of the line
        decay={1} // How fast the line fades away
        local={false} // Wether to use the target's world or local positions
        stride={0} // Min distance between previous and current point
        interval={1} // Number of frames to wait before next calculation
        target={undefined} // Optional target. This object will produce the trail.
        attenuation={(width) => width}
      >
        {/* If `target` is not defined, Trail will use the first `Object3D` child as the target. */}
        <mesh ref={ref} position={startPosition}>
          <sphereGeometry args={[size / 50]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
          />
        </mesh>

        {/* You can optionally define a custom meshLineMaterial to use. */}
        <meshLineMaterial
          color={emissiveColor}
          transparent
          toneMapped={false}
          opacity={0.5}
          blending={AdditiveBlending}
        />
      </Trail>
    </group>
  );
};

extend({ MeshLineMaterial });

export default Comet;

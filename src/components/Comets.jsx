import { useMemo } from "react";
import {
  randFloatSpread,
  randInt,
  randFloat,
} from "three/src/math/MathUtils.js";
import Comet from "./Comet.jsx";

const Comets = ({ nbTrails = 42 }) => {
  const comets = useMemo(() =>
    new Array(nbTrails).fill(0).map(() => {
      const size = randFloat(1, 3);
      return {
        size,
        length: randInt(2, 4),
        color: [
          "#fc7de7",
          "#b845ee",
          "#618fff",
          "#61ffdb",
          "#61ff93",
          "#faff61",
          "#ff6161",
          "#ffffff",
          "ec824d",
          "#edd0b1",
        ][randInt(0, 9)],
        startPosition: [randFloatSpread(20), 0, 0],
        orbitSpeed: (2 / size) * (randInt(0, 1) || -1),
        coinSpeed: (15 / size) * (randInt(0, 1) || -1), //much faster than orbitSpeed
        radius: randFloat(4, 6),
        planetOrbitSpeed: (4 / size) * (randInt(0, 1) || -1),
        rotation: [randFloatSpread(Math.PI), randFloatSpread(Math.PI), 0],
      };
    })
  );
  return (
    <>
      {comets.map((props, i) => (
        <Comet ket={i} {...props} />
      ))}
    </>
  );
};

export default Comets;

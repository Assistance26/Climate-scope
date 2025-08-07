// src/utils/polygonUtils.ts

export function calculateCentroid(points: Array<[number, number]>): [number, number] {
  let signedArea = 0;
  let centroidX = 0;
  let centroidY = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % n]; // next vertex, wrap around

    const a = x0 * y1 - x1 * y0;
    signedArea += a;
    centroidX += (x0 + x1) * a;
    centroidY += (y0 + y1) * a;
  }

  signedArea *= 0.5;
  centroidX /= (6 * signedArea);
  centroidY /= (6 * signedArea);

  return [centroidX, centroidY];
}

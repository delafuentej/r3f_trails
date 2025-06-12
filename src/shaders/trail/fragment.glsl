uniform vec3 color;
uniform float opacity;
uniform float intensity;
varying vec2 vUv;

void main(){
    float alpha = smoothstep(1.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.x) * smoothstep(0.0, 0.5, vUv.x);
    gl_FragColor = vec4(color * intensity, alpha * opacity);
}

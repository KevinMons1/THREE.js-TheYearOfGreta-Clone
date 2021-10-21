uniform float uScrollI;
uniform float uTime;

varying vec2 vUv;

void main() {
    float strenght = 0.4 + distance(vUv, vec2(uScrollI * 0.00115));

    vec3 color1 = vec3(0.5412, 0.1059, 0.1059);
    vec3 color2 = vec3(0.1216, 0.0039, 0.0039);
    vec3 mixedColor = mix(color1, color2, strenght);

    gl_FragColor = vec4(mixedColor, 1.0);
}
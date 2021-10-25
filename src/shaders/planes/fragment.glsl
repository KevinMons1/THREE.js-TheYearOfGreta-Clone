uniform sampler2D uTexture;
uniform float uTouch;
uniform float uTime;

varying vec2 vUv;

void main() {
    vec4 texture = texture2D(uTexture, vUv);
    vec3 gray = vec3((texture.r + texture.g + texture.b) * 0.3);

    float strength = distance(vUv, vec2(0.5));
    strength -= - sin(uTouch - 0.5) * 2.0;

    vec3 color = mix(gray.rgb, texture.rgb, smoothstep(strength, strength - 0.1, uTouch));

    gl_FragColor = vec4(color, 1.0);
}
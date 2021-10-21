uniform sampler2D uTexture;
uniform float uTouch;
uniform float uTime;

varying vec2 vUv;

void main() {
    vec4 texture = texture2D(uTexture, vUv);

    float red = texture.r;
    float green = texture.g;
    float blue = texture.b;

    float strength = distance(vUv, vec2(1.0)) + 1.0;
    
    // strength -= sin(uTouch * uTime * 2.0) * 3.0;
    strength -= abs(sin(uTime));

    float gray = (texture.r + texture.g + texture.b) / 10.0;
    float color = mix(strength, gray, uTouch);

    gl_FragColor = vec4(vec3(texture), 1.0);
}
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
    strength = - uTouch;

    float gray = (texture.r + texture.g + texture.b) / 10.0;

    texture.r *= 0.5 * step(strength * red, gray) + gray;
    texture.g *= 0.5 * step(strength * green, gray) + gray;
    texture.b *= 0.5 * step(strength * blue, gray) + gray;

    gl_FragColor = vec4(vec3(texture * 1.25), 1.0);
}
uniform float uScrollI;
uniform float uResoltion;

// // 2D Random
// float random (in vec2 st) {
//     return fract(sin(dot(st.xy,
//                          vec2(12.9898,78.233)))
//                  * 43758.5453123);
// }

// // 2D Noise based on Morgan McGuire @morgan3d
// // https://www.shadertoy.com/view/4dS3Wd
// float noise (in vec2 st) {
//     vec2 i = floor(st);
//     vec2 f = fract(st);

//     // Four corners in 2D of a tile
//     float a = random(i);
//     float b = random(i + vec2(1.0, 0.0));
//     float c = random(i + vec2(0.0, 1.0));
//     float d = random(i + vec2(1.0, 1.0));

//     // Smooth Interpolation

//     // Cubic Hermine Curve.  Same as SmoothStep()
//     vec2 u = f*f*(3.0-2.0*f);
//     // u = smoothstep(0.,1.,f);

//     // Mix 4 coorners percentages
//     return mix(a, b, u.x) +
//             (c - a)* u.y * (1.0 - u.x) +
//             (d - b) * u.x * u.y;
// }

void main() {
    // vec2 strength = gl_FragCoord.xy / 1024.0;
    // float pos = vec2(strength * 5.0);

    // float color = noise(pos);

    // gl_FragColor = vec4(vec3(color), 1.0);

    // ----

    vec2 uv = -1.0 + 2.0 * gl_FragCoord;

    gl_FragColor = vec4(uv.x, uv.y, 0.9, 1.0);
}
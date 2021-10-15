uniform float uScrollI;
uniform float uTime;
uniform bool uStartFloat;

varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * 5.0 - uTime) * 0.1;


    // float elevation = sin(modelPosition.x * 10.0 - uTime) * 0.1;
    // elevation += sin(modelPosition.y * 5.0 - uTime) * 0.1;

    // modelPosition.z + elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}
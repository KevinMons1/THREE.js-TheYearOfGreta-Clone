uniform float uTime;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.z += sin(modelPosition.y * 0.5 - uTime) * 0.1;
    // modelPosition.z += sin(modelPosition.x * 1.5 - uTime) * 0.1;
    modelPosition.z += sin(uTime);

    // float elevation = sin(modelPosition.x * 10.0 - uTime) * 0.1;
    // elevation += sin(modelPosition.y * 5.0 - uTime) * 0.1;

    // modelPosition.z + elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
}
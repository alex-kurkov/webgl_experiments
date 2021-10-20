#ifdef  GL_ES
    precision highp float;
#endif

uniform vec4 resolution;
uniform vec2 mouse;
uniform vec2 threshold;
uniform float time;
uniform float pixelRatio;
uniform sampler2D image0;
uniform sampler2D image1;


void main() {
    vec depth = texture2D(depthImage, uv);
    gl_FragColor = texture2D(originalImage, uv + mouse);
}

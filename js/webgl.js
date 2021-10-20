let canvas, gl, resolutionLocation, resolution, timeLocation, time;
let startTime;

const initWebGL = () => {
  let VSText, FSText;
  loadTextResource('/shaders/vertexShader.glsl')
    .then((res) => {
      VSText = res;
      return loadTextResource('/shaders/fragmentShader.glsl')
    })
    .then((res) => {
      FSText = res;
      return setupWebGL(VSText, FSText);
    })
    .catch((err) => console.error(err));
}

const setupWebGL = (VShaderText, FShaderText) => {
  canvas = document.querySelector('canvas');
  gl = canvas.getContext('webgl2');
  let isWebGL2 = !!gl;
  if (!isWebGL2) {
    gl = canvas.getContext('webgl') ||
    canvas.getContext('experimental-webgl') ||
    canvas.getContext('webkit-3d') ||
    canvas.getContext('moz-webgl');
  }
  if (!gl) {
    console.log('your browser does not support WebGL');
    return;
  }
  canvas.addEventListener('resize', resize(canvas, gl));
  resize(canvas, gl);

  const VShader = compileShader(VShaderText, gl.VERTEX_SHADER, gl);
  const FShader = compileShader(FShaderText, gl.FRAGMENT_SHADER, gl);

  const program = createProgram(gl, VShader, FShader);
  gl.deleteShader(VShader);
  gl.deleteShader(FShader);

  resolutionLocation = gl.getUniformLocation(program, 'uResolution')
  timeLocation = gl.getUniformLocation(program, 'uTime')



  return startWebGl(program);
}


function startWebGl(program) {
  console.log('gl: \n', gl);
  console.log('program: \n', program);
  
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // const vertexArray = [
  //   // X     Y     Z     R     G     B
  //      0.0,  0.3,  0.0,  1.0,  0.0,  0.0,
  //      0.5, -0.8,  0.0,  1.0,  0.0,  0.0,  // red
  //     -0.5, -0.8,  0.0,  1.0,  0.0,  0.0,
  
  
  //     -0.5,  0.5,  0.5,  0.0,  0.0,  1.0, 
  //      0.5,  0.5,  0.5,  0.0,  0.0,  1.0, //blue
  //      0.0, -0.8,  0.5,  0.0,  0.0,  1.0, 
  //   ]
  const vertexArray = [
    // X     Y     
       -1.0,  1.0,  
       1.0,  1.0,  
       1.0,  -1.0,
       -1.0,  1.0,  
       -1.0,  -1.0,  
       1.0,  -1.0,
    ]
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

  const positionAttrLocation = gl.getAttribLocation(program, 'vertexPosition');

  gl.vertexAttribPointer(
    positionAttrLocation,
    2,
    gl.FLOAT,
    gl.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT,
    0 * Float32Array.BYTES_PER_ELEMENT,
    )
  gl.enableVertexAttribArray(positionAttrLocation);
    startTime = Date.now();
  render();
}

function drawScene() {
  gl.uniform1f(timeLocation, time);
  gl.uniform2fv(resolutionLocation, resolution);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function render() {
  requestAnimationFrame(render);

  resolution = [canvas.width, canvas.height];

  time = (Date.now() - startTime) / 1000;

  drawScene();
}
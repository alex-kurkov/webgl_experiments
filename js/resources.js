const loadTextResource = (url) => new Promise((
  resolve, reject) => fetch(url)
    .then(res => res.text())
    .then(text => resolve(text))
    .catch(error => reject(error))
  );

const resize = (canvas, ctx) => {
  const {clientHeight, clientWidth} = ctx.canvas;
  
  canvas.height = clientHeight;
  canvas.width = clientWidth;
  ctx.viewport(0, 0, clientWidth, clientHeight);
}

const compileShader = (shaderSource, shaderType, ctx) => {
  const shader = ctx.createShader(shaderType);
  ctx.shaderSource(shader, shaderSource);
  ctx.compileShader(shader);
  if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
    console.error('Shader error info: ', gl.getShaderInfoLog(shader));
  }
  return shader;
}

const createProgram = (gl, VShader, FShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, VShader);
  gl.attachShader(program, FShader);
  gl.linkProgram(program);
  gl.useProgram(program);
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('Error validating program ', gl.getProgramInfoLog(program));
    return;
  }
  return program;
}

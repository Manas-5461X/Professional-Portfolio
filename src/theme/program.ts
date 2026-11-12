function compileShader(gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('createShader failed');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    const log = gl.getShaderInfoLog(shader) ?? '';
    gl.deleteShader(shader);
    throw new Error(`Shader compile error:\n${log}`);
  }
  return shader;
}

export interface ShaderProgram {
  program: WebGLProgram;
  uniform(name: string): WebGLUniformLocation | null;
  destroy(): void;
}

export function createProgram(gl: WebGL2RenderingContext, vert: string, frag: string): ShaderProgram {
  const program = gl.createProgram();
  if (!program) throw new Error('createProgram failed');

  const vs = compileShader(gl, gl.VERTEX_SHADER, vert);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, frag);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
    const log = gl.getProgramInfoLog(program) ?? '';
    gl.deleteProgram(program);
    throw new Error(`Program link error:\n${log}`);
  }

  const cache = new Map<string, WebGLUniformLocation | null>();
  return {
    program,
    uniform(name: string) {
      if (!cache.has(name)) {
        cache.set(name, gl.getUniformLocation(program, name));
      }
      return cache.get(name) ?? null;
    },
    destroy() {
      cache.clear();
      gl.deleteProgram(program);
    }
  };
}


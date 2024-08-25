/* eslint no-console:0 consistent-return:0 */
"use strict";

function createShader(gl, type, source) {
    // 1.
    var shader = gl.createShader(type);
    // 2.
    gl.shaderSource(shader, source);
    // 3.
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    // if error
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function main() {
    // Get A WebGL context
    var canvas = document.querySelector("canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        console.log("webgl not supported");
        return;
    }

    // Get the strings for our GLSL shaders
    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

    // reate GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // 4. Link the two shaders into a program
    var program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();
    // add buffer to ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl);


    drawScene();

    function drawScene() {

        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 7. Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Turn on the attribute, at position of a_position
        gl.enableVertexAttribArray(positionAttributeLocation);
        // Bind the position buffer. use positionBuffer when ARRAY_BUFFER needed
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // sets uniforms for the last program passed onto gl.useProgram
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer

        // tells webgl the format of the data    
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
        
        gl.enableVertexAttribArray(colorAttributeLocation);

        // supply data from buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        var size = 4;
        // save up 75% space by using unsigned byte instead of float. 0 to 255
        var type = gl.UNSIGNED_BYTE;
        // from 0 to 1
        var normalize = true;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);

        // draw the points with triangles
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;

        // rgb vals are from 0 to 1
        gl.drawArrays(primitiveType, offset, count);
    }
}

function setColors(gl) {
  // Define a uniform color for each triangle
//   var r1 = Math.random(), g1 = Math.random(), b1 = Math.random();
//   var r2 = Math.random(), g2 = Math.random(), b2 = Math.random();

  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
        Math.random()*256, Math.random()*256, Math.random()*256, 255,
        Math.random()*256, Math.random()*256, Math.random()*256, 255,
        Math.random()*256, Math.random()*256, Math.random()*256, 255,
        Math.random()*256, Math.random()*256, Math.random()*256, 255,
        Math.random()*256, Math.random()*256, Math.random()*256, 255,
        Math.random()*256, Math.random()*256, Math.random()*256, 255
      ]),
      gl.STATIC_DRAW);
}



function setGeometry(gl) {
  // Define the vertices for the two triangles separately
  gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([
          // First triangle (top-left)
          150, 100,
          250, 100,
          150, 200,

          // Second triangle (bottom-right)
          250,  100,
          150,  200,
          250,  200,
      ]),
      gl.STATIC_DRAW);
}

main();

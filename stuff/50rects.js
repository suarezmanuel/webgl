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
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var colorUniformLocation = gl.getUniformLocation(program, "u_color");

    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // // triangle vertices
    // var positions = [
    //     10, 20,
    //     80, 20,
    //     10, 30,
    //     10, 30,
    //     80, 20,
    //     80, 30,
    // ];

    // // fill the array buffer with data
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // code above this line is initialization code.
    // code below this line is rendering code.

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

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    // tells webgl the format of the data    
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // draw the points with triangles
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    //  there are this many points
    // var count = 6*50;
    // draws points
    // gl.drawArrays(primitiveType, offset, count);


    for (var ii=0; ii < 50; ii++) {
        // set random rectangle
        // fills ARRAY_BUFFER with 6 points
        setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));
        // set random color
        gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1)
        // draws the 6 points inside ARRAY_BUFFER
        gl.drawArrays(gl.TRIANGLES,0,6);
    }
}

function randomInt(range) {
    return Math.floor(Math.random() * range);
}

function setRectangle(gl, x, y, width, height) {
    
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

    // each rectangle is made up of 2 triangles, thus 6 points per rectangle
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1,y1,
        x2,y1,
        x1,y2,
        x1,y2,
        x2,y1,
        x2,y2,
    ]), gl.STATIC_DRAW);
}
main();

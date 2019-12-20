var createVertexShader = function (gl, inputText)
{
	var shader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(shader, inputText);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		console.error('Cannot compile vertex shader.', gl.getShaderInfoLog(shader));
		return;
	}
	return shader;
}

var createFragmentShader = function(gl, inputText)
{
	var shader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(shader, inputText);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		console.error('Cannot compile fragment shader.', gl.getShaderInfoLog(shader));
		return;
	}
	return shader;
}

var createProgram = function(gl, vertexShaderText, fragmentShaderText, texLocations = false)
{
	var vertexShader = createVertexShader(gl, vertexShaderText);
	var fragmentShader = createFragmentShader(gl, fragmentShaderText);
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	var texLoc;
	if (texLocations)
	{
		gl.useProgram(program);
		for (var i = 0; i < texLocations.length; i++)
		{
			texLoc = gl.getUniformLocation(program, texLocations[i]);
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.uniform1i(texLoc, i);
		}
	}

	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		console.error('Cannot link GL program.', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('Cannot validate GL program.', gl.getProgramInfoLog(program));
		return;
	}
	return program;
}
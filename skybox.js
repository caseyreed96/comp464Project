class Skybox
{
	// imageIDs is 6 images + - x, + - y, + - z
	constructor(gl, program, imageIDs, camera)
	{
		// object references
		this.gl = gl;
		this.program = program;
		this.imageIDs = imageIDs;
		this.cam = camera;
		this.cam.addSkybox(this);

		// shader values
		this.mView = Matrix.view(new Vector(), this.cam.forward, this.cam.localUp);
		this.mProj = Matrix.perspective(this.cam.fov, this.cam.aspect, 0.1, 1.0);

		// shader locations
		this.positionAttribLocation = this.gl.getAttribLocation(this.program, "position");
		this.mOrientUniformLocation = this.gl.getUniformLocation(this.program, "cam.view");
		this.mProjUniformLocation = this.gl.getUniformLocation(this.program, "cam.projection");

		// attrib/index arrays
		this.positionArray = Cube.cubeMapPositionArray();
		this.indexArray = Cube.cubeMapIndexArray();

		// attrib/index buffers
		this.positionBufferObject = this.gl.createBuffer();
		this.indexBufferObject = this.gl.createBuffer();

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBufferObject);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positionArray), this.gl.STATIC_DRAW);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBufferObject);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexArray), this.gl.STATIC_DRAW);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

		// textures
		this.tex = gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.tex);
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);

		for(var i = 0; i < imageIDs.length; i++)
		{
			gl.texImage2D(
				gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
				0,
				gl.RGBA,
				gl.RGBA,
				gl.UNSIGNED_BYTE,
				document.getElementById(imageIDs[i])
			);
		}

		this.gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		//this.gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		this.gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
	}

	updateViewMatrix()
	{
		this.mView = Matrix.view(new Vector(), this.cam.forward, this.cam.localUp);
	}

	updateProjectionMatrix()
	{
		this.mProj = Matrix.perspective(this.cam.fov, this.cam.aspect, 0.1, 1.0);
	}

	activate()
	{
		this.gl.useProgram(this.program);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBufferObject);
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.tex);

		this.gl.enableVertexAttribArray(this.positionAttribLocation);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBufferObject);
		this.gl.vertexAttribPointer(
			this.positionAttribLocation,
			3,
			this.gl.FLOAT,
			this.gl.FALSE,
			3 * Float32Array.BYTES_PER_ELEMENT,
			0
		);

		this.gl.uniformMatrix4fv(this.mOrientUniformLocation, false, this.mView);
		this.gl.uniformMatrix4fv(this.mProjUniformLocation, false, this.mProj);
	}

	draw()
	{
		this.activate();
		this.gl.drawElements(
			this.gl.TRIANGLES,
			this.indexArray.length,
			this.gl.UNSIGNED_SHORT,
			0
		);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
	}
}



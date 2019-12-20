class UVGlassMesh extends Mesh
{
	constructor(gl, program, positionArray, indexArray, normalArray, uvArray, textureID, flipTexture, imageIDs, reflectionIntensity, refractionIntensity, refractiveIndex, diffuse, specular, ambient, shininess, position=new Vector(), rotation=new Quaternion(), scale=new Vector(1,1,1))
	{
		var material = new UVGlassMaterial(gl, program, imageIDs, reflectionIntensity, refractionIntensity, refractiveIndex, diffuse, specular, ambient, shininess);
		super(gl, program, positionArray, indexArray, normalArray, material, position, rotation, scale);

		this.texCoordAttribLocation = gl.getAttribLocation(this.program, 'vertTexCoord');
		this.texSamplerUniformLocation = gl.getUniformLocation(this.program, 'sampler');
		this.gl.uniform1i(this.texSamlerUniformLocation, 0);

		this.vertTexCoords = new Float32Array(uvArray);
		this.texCoordBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, this.vertTexCoords, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		this.textureObject = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.textureObject);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			document.getElementById(textureID)
		);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}

	activate()
	{
		super.activate();

		this.gl.enableVertexAttribArray(this.texCoordAttribLocation);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBufferObject);
		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureObject);
		this.gl.vertexAttribPointer(
			this.texCoordAttribLocation,
			2,
			this.gl.FLOAT,
			this.gl.FALSE,
			2 * Float32Array.BYTES_PER_ELEMENT,
			0
		);
	}

	draw()
	{
		super.draw();
		this.gl.activeTexture(this.gl.TEXTURE1);
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}
}
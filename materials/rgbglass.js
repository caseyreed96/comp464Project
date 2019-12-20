class RGBGlassMaterial
{
	constructor(gl, program, imageIDs, reflectionIntensity = 0.1, refractionIntensity = 0.9, refractiveIndex = 2.0, diffuse=new Vector(1,1,1), specular=new Vector(1,1,1), ambient=new Vector(1,1,1), shininess=0.3)
	{
		this.gl = gl;
		this.program = program;

		this.diffuse = diffuse.toArray();
		this.specular = specular.toArray();
		this.ambient = ambient.toArray();
		this.shininess = shininess;
		this.reflectionIntensity = reflectionIntensity;
		this.refractionIntensity = refractionIntensity;
		this.baseIntensity = 1.0 - reflectionIntensity - refractionIntensity;
		this.refractionConstant = 1.0 / refractiveIndex;

		this.diffuseUniformLocation = gl.getUniformLocation(program, 'material.diffuse');
		this.specularUniformLocation = gl.getUniformLocation(program, 'material.specular');
		this.ambientUniformLocation = gl.getUniformLocation(program, 'material.ambient');
		this.shininessUniformLocation = gl.getUniformLocation(program, 'material.shininess');
		this.reflectionIntensityUniformLocation = gl.getUniformLocation(program, 'material.reflectionIntensity');
		this.refractionIntensityUniformLocation = gl.getUniformLocation(program, 'material.refractionIntensity');
		this.baseIntensityUniformLocation = gl.getUniformLocation(program, 'material.baseIntensity');
		this.refractionConstantUniformLocation = gl.getUniformLocation(program, 'material.refractionConstant');

		this.tex = gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.tex);

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
		this.gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		this.gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
	}

	activate()
	{
		this.gl.uniform3fv(this.diffuseUniformLocation, this.diffuse);
		this.gl.uniform3fv(this.specularUniformLocation, this.specular);
		this.gl.uniform3fv(this.ambientUniformLocation, this.ambient);
		this.gl.uniform1f(this.shininessUniformLocation, this.shininess);
		this.gl.uniform1f(this.reflectionIntensityUniformLocation, this.reflectionIntensity);
		this.gl.uniform1f(this.refractionIntensityUniformLocation, this.refractionIntensity);
		this.gl.uniform1f(this.baseIntensityUniformLocation, this.baseIntensity);
		this.gl.uniform1f(this.refractionConstantUniformLocation, this.refractionConstant);
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.tex);
	}
}
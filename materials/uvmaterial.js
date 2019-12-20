class UVMaterial
{
	// unlike RGBMaterial, diffuse speculart and ambient are all floats
	constructor(gl, program, diffuse=1.0, specular=1.0, ambient=1.0, shininess=1.0)
	{
		this.gl = gl;
		this.program = program;

		this.diffuse = diffuse;
		this.specular = specular;
		this.ambient = ambient;
		this.shininess = shininess;

		this.diffuseUniformLocation = gl.getUniformLocation(program, 'material.diffuse');
		this.specularUniformLocation = gl.getUniformLocation(program, 'material.specular');
		this.ambientUniformLocation = gl.getUniformLocation(program, 'material.ambient');
		this.shininessUniformLocation = gl.getUniformLocation(program, 'material.shininess');
	}

	activate()
	{
		this.gl.uniform1f(this.diffuseUniformLocation, this.diffuse);
		this.gl.uniform1f(this.specularUniformLocation, this.specular);
		this.gl.uniform1f(this.ambientUniformLocation, this.ambient);
		this.gl.uniform1f(this.shininessUniformLocation, this.shininess);
	}
}
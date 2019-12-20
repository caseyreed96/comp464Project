class RGBGlassMesh extends Mesh
{
	constructor(gl, program, positionArray, indexArray, normalArray, imageIDs, reflectionIntensity, refractionIntensity, refractiveIndex, diffuse, specular, ambient, shininess, position=new Vector(), rotation=new Quaternion(), scale=new Vector(1,1,1))
	{
		var material = new RGBGlassMaterial(gl, program, imageIDs, reflectionIntensity, refractionIntensity, refractiveIndex, diffuse, specular, ambient, shininess);
		super(gl, program, positionArray, indexArray, normalArray, material, position, rotation, scale);
	}
}
precision mediump float;

uniform samplerCube cubeMap;

varying vec3 texCoord;

void main()
{
	//vec4 texel = texture2D(sampler, fragTexCoord);
	gl_FragColor = textureCube(cubeMap, texCoord);
}
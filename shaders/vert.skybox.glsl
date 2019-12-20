precision mediump float;

struct Camera
{
	mat4 view;
	mat4 projection;
};

uniform Camera cam;

attribute vec3 position;

varying vec3 texCoord;

void main()
{
	texCoord = position;
	vec4 modPosition = cam.projection * cam.view * vec4(position, 1.0);
	gl_Position = vec4(modPosition.xy, 0.999999*modPosition.w, modPosition.w);
}
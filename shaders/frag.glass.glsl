precision mediump float;

// data type definitions
struct DirectionalLight
{
	vec3 direction; // xyz direction of light
	vec3 ambient; // rgb contribution to scene ambient light
	vec3 diffuse; // rgb intensity of diffuse 
	vec3 specular; // rgb intensity of specular
};

struct PointLight
{
	vec3 position; // xyz position of source
	vec3 ambient; // rgb contribution to scene ambient light
	vec3 diffuse; // rgb intensity of diffuse
	vec3 specular; // rgb intensity of specular
};

struct Material
{
	vec3 diffuse; // diffuse reflection color
	vec3 specular; // specular reflection color
	vec3 ambient; // ambient reflection color
	float shininess; // "shininess / glossiness" constant
	float reflectionIntensity;
	float refractionIntensity;
	float baseIntensity;
	float refractionConstant; // 1 / refractive index
};

struct Camera
{
	vec3 position;
	mat4 mProjView;
};

// lights
uniform vec3 ambientLight;
uniform DirectionalLight directionalLights[16];
uniform PointLight pointLights[16];

// cubemap / skybox
uniform samplerCube cubeMap;

// model parameters
uniform Material material;

// camera
uniform Camera cam;

// surface parameters
varying vec3 fragPosition;
varying vec3 fragNormal;

void main()
{
	vec3 light = ambientLight; // will be sum of all ambient light
	vec3 diffuse = vec3(0.0, 0.0, 0.0); // will me sum of all diffuse light
	vec3 specular = vec3(0.0, 0.0, 0.0); // will be sum of all specular light
	vec3 pdir; // direction from point light to surface
	float pdist; // squared distance from point light to surface
	vec3 cdir = normalize(cam.position - fragPosition);; // direction from surface to camera
	vec3 rdir; // direction of perfectly reflected light
	float nDot;

	for (int i = 0; i < 16; i++)
	{
		// get lights
		DirectionalLight dlight = directionalLights[i];
		PointLight plight = pointLights[i];

		// get direction and squared distance for point light
		pdir = plight.position - fragPosition;
		pdist = dot(pdir, pdir) + 1.0;
		pdir = normalize(pdir);

		// ambient light
		light += dlight.ambient + plight.ambient;

		// directional light
		nDot = -dot(dlight.direction, fragNormal);
		if (nDot > 0.0)
		{
			// diffuse
			diffuse += dlight.diffuse * nDot;

			// specular
			rdir = 2.0 * nDot * fragNormal + dlight.direction ;
			specular += dlight.specular * pow( max( -dot(rdir, cdir), 0.0), material.shininess);
		}

		// point light
		nDot = dot(pdir, fragNormal);
		if (nDot > 0.0)
		{
			// diffuse
			diffuse += plight.diffuse * nDot / pdist;

			// specular
			rdir = 2.0 * nDot * fragNormal - pdir;
			specular += plight.specular * pow( max( dot(rdir, cdir), 0.0), material.shininess) / pdist;
		}
	}

	light = light * material.ambient + diffuse * material.diffuse + specular * material.specular;

	vec3 reflectDirection = 2.0 * dot(fragNormal, cdir) * fragNormal - cdir;
	vec3 reflectLight = textureCube(cubeMap, reflectDirection).rgb;

	vec3 refractCross = cross(-fragNormal, cdir);
	vec3 refractDirection =
		(material.refractionConstant) * cross(-fragNormal, -refractCross)
		+ fragNormal * sqrt(1 - pow(material.refractionConstant, 2) *
			dot(refractCross, refractCross));
	vec3 refractLight = textureCube(cubeMap, refractDirection).rgb;

	light = material.baseIntensity * light +
			material.reflectionIntensity * reflectLight +
			material.refractionIntensity * refractLight;

	gl_FragColor = vec4(light, 1.0);
}
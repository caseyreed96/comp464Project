
var RunDemo = function (filemap)
{
	console.log("Initializing Demo");

	// get canvas, set dimensions to fill browser window
	var canvas = document.getElementById('the_canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// get WebGL context, confirm...
	var gl = canvas.getContext('webgl');

	if (!gl)
	{
		console.log('Browser is using experimental webgl.');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('This requires a browser which supports WebGL; Yours does not.');
	}

	// set background color and clear
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// set up culling via depth and back face, set front face to CCW
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	// create shaders
	var uvProgram = createProgram(
		gl, 
		filemap['uvVertShaderText'],
		filemap['uvFragShaderText']
	);

	var rgbProgram = createProgram(
		gl, 
		filemap['rgbVertShaderText'],
		filemap['rgbFragShaderText']
	);

	var skyboxProgram = createProgram(
		gl,
		filemap['skyboxVertShaderText'],
		filemap['skyboxFragShaderText']
	);

	var rgbglassProgram = createProgram(
		gl,
		filemap['rgbglassVertShaderText'],
		filemap['rgbglassFragShaderText']
	);

	var uvglassProgram = createProgram(
		gl,
		filemap['uvglassVertShaderText'],
		filemap['uvglassFragShaderText'],
		['sampler', 'cubeMap']
	);

	// set up camera
	let aspect = canvas.width / canvas.height;
	let fieldOfView = Math.PI / 4;
	let nearClip = 0.01;
	let farClip = 1000.0;
	var camera = new FPSCamera(
		gl,
		[uvProgram, rgbProgram, rgbglassProgram, uvglassProgram],
		aspect,
		fieldOfView,
		nearClip,
		farClip
	);
	camera.translate(new Vector(5, 17, 10));
	camera.lookAt(new Vector(0,5,0), new Vector(0, 0, 0));

	// set ambient light parameters
	var ambientLight = new Vector(0.5, 0.5, 0.5);

	// set up point lights' parameters
	var pointLightPosition = new Vector(0, 0, 0);
	var pointLightDiffuse = new Vector(1, 1, 4);
	var pointLightSpecular = new Vector(1, 4, 1);

	// use light manager to create lights
	var lightManager = new LightManager(gl,
		[rgbProgram, uvProgram, rgbglassProgram, uvglassProgram],
		ambientLight
	);
	lightManager.addPointLight(pointLightPosition, pointLightDiffuse, pointLightSpecular);
	lightManager.addPointLight(pointLightPosition, pointLightDiffuse, pointLightSpecular);
	lightManager.update();

	// set up directional light's parameters and create directional light
	var directionalLightDirection = new Vector(1, -4, 2);
	var directionalLightDiffuse = new Vector(0.4, 0.7, 0.6);
	var directionalLightSpecular = new Vector(0.4, 0.7, 0.6);
	lightManager.addDirectionalLight(directionalLightDirection, directionalLightDiffuse, directionalLightSpecular);
	lightManager.update();

	// skybox
	var skyboxImageIDs = [
		'skybox-right',
		'skybox-left',
		'skybox-top',
		'skybox-bottom',
		'skybox-back',
		'skybox-front'
	];
	var skybox = new Skybox(gl, skyboxProgram, skyboxImageIDs, camera);

	var volDiffuse = 1.0;
	var volSpecular = 1.0;
	var volAmbient = 1.0;
	var volShininess = 1;
	var volReflectionIntensity = 0.0;
	var volRefractionIntensity = 0.0;
	var volRefractiveIndex = 2.0;

	threeVolcano = ThreeJSToUVGlassMesh(
		filemap['volcanoJSON'],
		gl,
		uvglassProgram,
		'volctexture',
		true,
		skyboxImageIDs,
		volReflectionIntensity,
		volRefractionIntensity,
		volRefractiveIndex,
		volDiffuse,
		volSpecular,
		volAmbient,
		volShininess
	);

	threeVolcano.translate(new Vector(0, -4, 0));

//particle stuff done with threejs - couldnt implement into system
//var clock = new THREE.Clock(true);
//var deltaTime;
//var particleSystem;
//function createParticleSystem()
//{
//	var particleCount=2000;
//	var particles = new THREE.Geometry();
//	for(var p=0;p<particleCount;p++)
//	{
//	var x=Math.random()*10-5;
//	var y=Math.random()*400-200;
//	var z=Math.random()*10-5;
//	var particle=new THREE.Vector3(x,y,z);
//	// Add the vertex to the geometry
//	particles.vertices.push(particle);
//	}
//
//	// Create the material that will be used to render each vertex of the geometry
//	var particleMaterial=new THREE.PointsMaterial(
//		{color: 0xffffff, 
//		 size: 4,
//		 map: THREE.ImageUtils.loadTexture("textures/smoke.png"),
//		 blending: THREE.AdditiveBlending,
//		 transparent: true,
//		});
// 
//	// Create the particle system
//	particleSystem=new THREE.Points(particles,particleMaterial);
//	return particleSystem;	
//}
//var particleSystem=createParticleSystem();
//function animate()
//{
//deltaTime=clock.getDelta();
//animateParticles();
//requestAnimationFrame(animate);
//}
//function animateParticles()
//{
//	var verts=particleSystem.geometry.vertices;
//	for(vari=0;i<verts.length;i++) {
//		var vert=verts[i];
//		if (vert.y>200) {
//			vert.y=Math.random()*400-200;
//		}
//	vert.y=vert.y+(10*deltaTime);
//	}
//	particleSystem.geometry.verticesNeedUpdate=true;
//	particleSystem.rotation.y-=.1*deltaTime;
//}
	// set up some arbitrary constants for motion
	var startTime = Date.now();
	var time;
	let k_theta = 1/1000;
	let k_alpha = 1/3101;
	let hr = 5;
	let vr = 2;
	var theta;
	var alpha;
	var cosTheta;
	var lightPosition;// = new Vector(2, 0, 1.5);

	var main = function()
	{
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		time = Date.now() - startTime;
		theta = time * k_theta;
		alpha = time * k_alpha;
		cosTheta = Math.cos(theta);

		lightPosition = new Vector(
			hr*cosTheta*Math.sin(alpha),
			vr*Math.sin(2*theta),
			vr*cosTheta*Math.cos(alpha)
		);

		lightManager.pointLights[0].setPosition(lightPosition);
		lightManager.pointLights[1].setPosition(lightPosition.inverse())
		lightManager.update();

		camera.update();

		threeVolcano.draw();

		skybox.draw();

		requestAnimationFrame(main);
	}
	requestAnimationFrame(main);
}

var InitDemo = function()
{
	// locations of imported files
	var urls = [
		'shaders/vert.uv.glsl',
		'shaders/frag.uv.glsl',
		'shaders/vert.rgb.glsl',
		'shaders/frag.rgb.glsl',
		'shaders/vert.skybox.glsl',
		'shaders/frag.skybox.glsl',
		'shaders/vert.rgbglass.glsl',
		'shaders/frag.rgbglass.glsl',
		'shaders/vert.uvglass.glsl',
		'shaders/frag.uvglass.glsl',
		'models/volcano.json'
	];

	// imported file keys for file key-value map, respective to locations
	var names = [
		'uvVertShaderText',
		'uvFragShaderText',
		'rgbVertShaderText',
		'rgbFragShaderText',
		'skyboxVertShaderText',
		'skyboxFragShaderText',
		'rgbglassVertShaderText',
		'rgbglassFragShaderText',
		'uvglassVertShaderText',
		'uvglassFragShaderText',
		'volcanoJSON'
	];

	// file types, respective to locations (text or JSON)
	var types = [
		'text',
		'text',
		'text',
		'text',
		'text',
		'text',
		'text',
		'text',
		'text',
		'text',
		'json'
	];
	
	var importer = new resourceImporter(urls, names, types, RunDemo);
}
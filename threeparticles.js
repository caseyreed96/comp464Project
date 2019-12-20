var camera;
var scene;
var renderer;
var volcano;
var clock;
var deltaTime;
var particleSystem;
var theta=0;
var radius=100;

init();
animate();

function init(){
	renderer=new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);
	window.addEventListener('resize',onWindowResize,false);
    scene=new THREE.Scene();

    camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,1,1000);

    clock=new THREE.Clock(true);

    particleSystem=createParticleSystem();
    scene.add(particleSystem);

    initMesh();
    initSkybox();
    render();
    
}

function initMesh()
{
	var volMaterial=new THREE.MeshBasicMaterial();
	var volTexture;
	var loader=new THREE.JSONLoader();
	var texLoader=new THREE.TextureLoader();
	loader.load('/models/volc.json',function(geometry) {
		volcano=new THREE.Mesh(geometry,volMaterial);
		volcano.scale.x=volcano.scale.y=volcano.scale.z=10;
		volcano.position.set(0,-150,0);
		scene.add(volcano);
	});
	texLoader.load('/textures/volctexture.png',function(texture)
	{
		volMaterial.map=texture;
		volMaterial.needsUpdate=true;
	});
}

function initSkybox()
{
	scene.background=new THREE.Color(0xf0f0f0); //why no work
}

function createParticleSystem()
{
    var particleCount = 2000;   
    var particles = new THREE.Geometry();
	for (var p = 0; p < particleCount; p++)
	{
		// This will create all the vertices in a specific range
		var x=Math.random()*40-20;
		var y=Math.random()*300-50;
		var z=Math.random()*40-20;

		var particle=new THREE.Vector3(x,y,z);
		particles.vertices.push(particle);
	}

	var particleMaterial=new THREE.PointsMaterial(
			{color:0xffffff, 
			 size:8,
			 map:THREE.ImageUtils.loadTexture("textures/smoke.png"),
			 blending:THREE.AdditiveBlending,
			 transparent:true,
			});

	particleSystem=new THREE.Points(particles,particleMaterial);
	return particleSystem;	
}

function animate()
{
	deltaTime = clock.getDelta();
    animateParticles();
    render();
    requestAnimationFrame(animate);
}

function animateParticles()
{
	var verts=particleSystem.geometry.vertices;
	for(var i=0;i<verts.length;i++){
		var vert=verts[i];
		if(vert.x>20){
			vert.x=Math.random()*40-20;
		}
		if(vert.y>150){
			vert.y=Math.random()*150-50;
		}
		if(vert.z>20){
			vert.z=Math.random()*40-20;
		}
		vert.x=vert.x+(10*deltaTime);
		vert.y=vert.y+(10*deltaTime);
		vert.z=vert.z+(10*deltaTime);
	}
	particleSystem.geometry.verticesNeedUpdate=true;
	particleSystem.rotation.y-=.1*deltaTime;
}

function render()
{
	theta+=0.1;
	camera.position.x=radius*Math.sin(THREE.Math.degToRad(theta));
	camera.position.y=-50+radius*Math.sin(THREE.Math.degToRad(theta));
	camera.position.z=100+radius*Math.cos(THREE.Math.degToRad(theta));
	camera.lookAt(scene.position);

    renderer.render(scene,camera);
}

function onWindowResize(){
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    render();
}
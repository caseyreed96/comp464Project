var camera;
var scene;
var renderer;
var volcano;

var clock;
var deltaTime;

var particleSystem;

init();
animate();

function init(){

	clock=new THREE.Clock(true);
	
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,1,1000);
    camera.position.z=500;
    
    var light=new THREE.DirectionalLight(0xffffff);
    light.position.set(1,-1,1).normalize();
    //scene.add(light);
     
    particleSystem=createParticleSystem();
    scene.add(particleSystem);
    
    renderer=new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize',onWindowResize,false);

    initMesh();
    render();
}

function initMesh(){
	var loader=new THREE.JSONLoader();
	var volTexture=new THREE.TextureLoader().load('/textures/volctexture.png');
	var volMaterial=new THREE.MeshBasicMaterial({map:volTexture});
	loader.load('/models/volc.json',function(geometry) {
		volcano=new THREE.Mesh(geometry);
		volcano.scale.x=volcano.scale.y=volcano.scale.z=10;
		volcano.position.set(0,-150,0);
		scene.add(volcano);
	});
}

function createParticleSystem() {
	
	// The number of particles in a particle system is not easily changed.
    var particleCount = 2000;
    
    // Particles are just individual vertices in a geometry
    // Create the geometry that will hold all of the vertices
    var particles = new THREE.Geometry();

	// Create the vertices and add them to the particles geometry
	for (var p = 0; p < particleCount; p++) {
	
		// This will create all the vertices in a range of -200 to 200 in all directions
		var x = Math.random() * 20-10;
		var y = Math.random() * 300-50;
		var z = Math.random() * 20-10;
		      
		// Create the vertex
		var particle = new THREE.Vector3(x, y, z);
		
		// Add the vertex to the geometry
		particles.vertices.push(particle);
	}

	// Create the material that will be used to render each vertex of the geometry
	var particleMaterial = new THREE.PointsMaterial(
			{color: 0xffffff, 
			 size: 8,
			 map: THREE.ImageUtils.loadTexture("textures/smoke.png"),
			 blending: THREE.AdditiveBlending,
			 transparent: true,
			});
	 
	// Create the particle system
	particleSystem = new THREE.Points(particles, particleMaterial);

	return particleSystem;	
}

function animate() {
	deltaTime = clock.getDelta();
    animateParticles();
    render();
    requestAnimationFrame( animate );
}

function animateParticles() {
	var verts=particleSystem.geometry.vertices;
	for(var i=0;i<verts.length;i++){
		var vert=verts[i];
		if(vert.y>150){
			vert.y=Math.random()*150-50;
		}
		vert.y=vert.y+(10*deltaTime);
	}
	particleSystem.geometry.verticesNeedUpdate=true;
	particleSystem.rotation.y-=.1*deltaTime;
}

function render(){
    renderer.render(scene,camera);
}

function onWindowResize(){
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    render();
}
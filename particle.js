class Particle
{

	createParticleSystem()
	{
    	var particleCount=2000;
    	// Create the geometry that will hold all of the vertices
    	var particles = new THREE.Geometry();
		// Create the vertices and add them to the particles geometry
		for(var p=0;p<particleCount;p++)
		{
		var x=Math.random()*10-5;
		var y=Math.random()*400-200;
		var z=Math.random()*10-5;
		// Create the vertex
		var particle=new THREE.Vector3(x,y,z);
		// Add the vertex to the geometry
		particles.vertices.push(particle);
		}

		// Create the material that will be used to render each vertex of the geometry
		var particleMaterial=new THREE.PointsMaterial(
			{color: 0xffffff, 
			 size: 4,
			 map: THREE.ImageUtils.loadTexture("textures/smoke.png"),
			 blending: THREE.AdditiveBlending,
			 transparent: true,
			});
	 
		// Create the particle system
		particleSystem = new THREE.Points(particles,particleMaterial);
		return particleSystem;	
	}

	animate()
	{
	deltaTime=clock.getDelta();
    animateParticles();
    requestAnimationFrame(animate);
	}

	animateParticles()
	{
		var verts = particleSystem.geometry.vertices;
		for(var i = 0; i < verts.length; i++) {
			var vert = verts[i];
			if (vert.y > 200) {
				vert.y = Math.random() * 400 - 200;
			}
		vert.y = vert.y + (10 * deltaTime);
		}
		particleSystem.geometry.verticesNeedUpdate=true;
		particleSystem.rotation.y-=.1*deltaTime;
	}
}
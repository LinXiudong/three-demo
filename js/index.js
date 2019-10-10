	var container, camera, scene, renderer, circle;
	// 粒子系统1，最终变成矩阵的粒子中永远不变的部分
	var particleSystem_1;
	// 粒子系统2，最终变成矩阵的粒子中会变的部分
	var particleSystem_2;
	// 粒子系统3，后期消失的粒子
	// var particleSystem_3;
	// 旋转方向，1顺时针，-1逆时针
	// var circleDrection = 1;
	var system2 = []
	// 当前步骤：1（无序到有序），2（有序旋转）
	var step = 1
	// 
	var index = 0

	// 开始
	init();
	animate();

	// 初始化
	function init() {
        container = document.getElementById( 'container' );

		// 相机设置
        camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, .1, 10000 );
        camera.position.x = -310;
        camera.position.y = -260;
        camera.position.z = 260;
        camera.move_direction = 1;
        scene = new THREE.Scene();
        scene.add( camera );

		camera.lookAt(new THREE.Vector3(0,0,0));

        // 渲染
        renderer = new THREE.WebGLRenderer( { antialias: true,transparent:true,alpha: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearAlpha(0.81);
        container.appendChild( renderer.domElement );

        renderer.shadowMapEnabled = true;

		// 旋转的圆
		var radius = 250;
		var segments = 32;

		var circleGeometry = new THREE.CircleGeometry( radius, segments );
		circle = new THREE.Mesh( circleGeometry);
		circle.add(camera);
		circle.visible = false;
		circle.rotation.y = 0.2
		scene.add( circle );

		// 更新视角位置，旋转视角
		circle.update= function(){
			if(step === 2 && this.rotation.y > 0.5){
				// 开始切换到无序运动部分，系统3出现
				circle.rotation.y = 0.2
				this.rotation.z = 0
				for(var i = 0; i < particleSystem_2.geometry.vertices.length; i++){
					particleSystem_2.geometry.vertices[i].x = system2[i].start[0]
					particleSystem_2.geometry.vertices[i].y = system2[i].start[1]
					particleSystem_2.geometry.vertices[i].z = system2[i].start[2]
				}
				particleSystem_2.geometry.verticesNeedUpdate = true;

				/* for(var i = 0; i < particleSystem_3.geometry.vertices.length; i++){
					particleSystem_3.geometry.vertices[i].x = 200 - 400 * Math.random()
					particleSystem_3.geometry.vertices[i].y = -200 * Math.random()
					particleSystem_3.geometry.vertices[i].z = 200 * Math.random()
				}
				particleSystem_3.geometry.verticesNeedUpdate = true; */

				step = 1
				// particleSystem_3.material.visible = true
			}else if(step === 2){
				this.rotation.y += 0.001
				this.rotation.z -= 0.0002
			}
		}

		// 粒子系统1，2
		var particles1 = new THREE.Geometry();
		var particles2 = new THREE.Geometry();
		var pMaterial1 = new THREE.PointCloudMaterial({
			color: '#ffffff',
			size: 2,
			transparent:true,
			opacity:0.8
		});
		var pMaterial2 = new THREE.PointCloudMaterial({
			color: '#ffffff',
			size: 2,
			transparent:true,
			opacity:0.8
		});

		for(var k = 0 ; k < 15 ; k++){
			for(var j = 0 ; j < 15 ; j++) {
				for (var i = 0; i < 15; i++) {
					// 是否是系统2的粒子，是否会改变
					var isSystem2 = Math.random() > 0 ? true : false
					var random1 = isSystem2 ? (Math.random() * 200 - 100) : 0
					var random2 = isSystem2 ? (Math.random() * 200 - 100) : 0
					var random3 = isSystem2 ? (Math.random() * 200 - 100) : 0
					var x = i * 40 - 300 + random1;
					var y = j * 40 - 300 + random2;
					var z = k * 40 - 300 + random3;

					if(!isSystem2){
						particles1.vertices.push(new THREE.Vector3(x, y, z));
					}else{
						system2.push({
							start: [x, y, z],
							end: [i * 40 - 300, j * 40 - 300, k * 40 - 300],
							random1: random1,
							random2: random2,
							random3: random3
						})
						particles2.vertices.push(new THREE.Vector3(x, y, z));
					}
				}
			}
		}

		particleSystem_1 = new THREE.PointCloud(particles1, pMaterial1);
		particleSystem_2 = new THREE.PointCloud(particles2, pMaterial2);
		scene.add(particleSystem_1);
		scene.add(particleSystem_2);

		// 粒子系统3
		/* var particles3 = new THREE.Geometry();
		var pMaterial3 = new THREE.PointCloudMaterial({
			color: '#ffffff',
			size: 2,
			transparent:true,
			opacity:0.8
		});

		for(var i = 0 ; i < 0 ; i++){
			var x = 200 - 400 * Math.random();
			var y = -200 * Math.random();
			var z = 200 * Math.random();
			
			particles3.vertices.push(new THREE.Vector3(x, y, z));
		}

		particleSystem_3 = new THREE.PointCloud(particles3, pMaterial3);
		scene.add(particleSystem_3); */

	}

	// 改变浏览器大小后
	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	// 动画效果
	function animate() {
		/* system2.push({
			start: [x, y, z],
			end: [i * 40 - 300, j * 40 - 300, k * 40 - 300],
			random: random
		}) */
		var timeout = false
		if(step === 1){
			// 粒子系统2动画
			for(var i = 0; i < particleSystem_2.geometry.vertices.length; i++){
				// system2[i].r = Math.sqrt(3 * system2[i].random * system2[i].random)
				
				particleSystem_2.geometry.vertices[i].x -= system2[i].random1 / 400
				particleSystem_2.geometry.vertices[i].y -= system2[i].random2 / 400
				particleSystem_2.geometry.vertices[i].z -= system2[i].random3 / 400
			}
			particleSystem_2.geometry.verticesNeedUpdate = true;

			// 粒子系统3动画
			/* for(var i = 0; i < particleSystem_3.geometry.vertices.length; i++){
				particleSystem_3.geometry.vertices[i].x -= 3 * Math.sin(particleSystem_3.geometry.vertices[i].x) // Math.random() * 0.3
				particleSystem_3.geometry.vertices[i].y -= 0.2
				particleSystem_3.geometry.vertices[i].z -= Math.random() * 0.3
			}
			particleSystem_3.geometry.verticesNeedUpdate = true; */

			if(Math.abs(particleSystem_2.geometry.vertices[0].x - system2[0].end[0]) < 0.01){
				
				// 开始切换到有序旋转部分，系统3消失
				for(var i = 0; i < particleSystem_2.geometry.vertices.length; i++){
					particleSystem_2.geometry.vertices[i].x = system2[i].end[0]
					particleSystem_2.geometry.vertices[i].y = system2[i].end[1]
					particleSystem_2.geometry.vertices[i].z = system2[i].end[2]
				}
				particleSystem_2.geometry.verticesNeedUpdate = true;

				step = 2
				timeout = true
				// particleSystem_3.material.visible = false
			}
		}

		var time = timeout ? 0.1 : 0
		setTimeout(function(){
			requestAnimationFrame( animate );

			render();
		}, time)
	}

	function render() {
		circle.update();

		renderer.render( scene, camera );
	}

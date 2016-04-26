var App = function() {
    
    var socket;
    var scene;
    var camera;
    var renderer;
    
    this.init = function() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Initialize camera
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 700 );
        this.camera.position.set(0, 0, 5);
        
        Reticulum.init(this.camera, {
			proximity: false,
			clickevents: false,
			reticle: {
				visible: true,
				restPoint: 1000, //location when nothing selected
				color: 0xcc00cc,
				innerRadius: 0.0001,
				outerRadius: 0.003,
					hover: {
						color: 0x00cccc,
						innerRadius: 0.02,
						outerRadius: 0.024,
						speed: 5,
						vibrate: 50 
							}	
					},
			fuse: {
				visible: false,
				duration: 1.0,
				color: 0x00fff6,
				innerRadius: 0.045,
				outerRadius: 0.06,
				vibrate: 0, //
				clickCancelFuse: false //If users clicks on targeted object fuse is canceled
			}
		});
        
        this.scene.add(this.camera);
        
        // Initialize lighting
        this.light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        this.scene.add( this.light );
        
        // Initialize renderer
        this.renderer = new THREE.WebGLRenderer();
        this.stereoRenderer = new THREE.StereoEffect(this.renderer);
        rem = this.renderer.domElement;
        
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( rem );

        // Initialize WindowObjController
        this.windowObjController = new WindowObjController(this.scene);
        
        // CONTROLS
        var controls = new THREE.OrbitControls(this.camera, rem);
        // controls.target.set(
        //     camera.position.x + 0.15,
        //     camera.position.y,
        //     camera.position.z
        // );
        
        // controls.noPan = true;
        controls.enableZoom = false;
        
        // window.addEventListener('deviceorientation', setOrientationControls, true);
        // rem.addEventListener('click', this.fullscreen, false);
        
        this.socket = io();
        this.socket.on('gesture', function(gestureNum){
            // Apply gesture to active window
            var aw = this.windowObjController.getActiveWindow();
            
            if (aw !== null) {
                switch (gestureNum) {
        			case 0:
        				MoveLeft(aw.obj);
            			break;
        			case 1:
        				MoveRight(aw.obj);
            			break;
        			case 2:
        				MoveUp(aw.obj);
            			break;
        			case 3:
        				MoveDown(aw.obj);
            			break;
        			case 4:
        				Scale(aw.obj);
            			break;
        			case 5:
        				Shrink(aw.obj);
            			break;
        			case 6:
        				Minimize(aw.obj);
            			break;
        			case 7:
        				Restore(aw.obj);
            			break;
        			case 8:
        				MoveCloser(aw.obj);
            			break;
        			case 9:
        				MoveFurther(aw.obj);
            			break;
                }
            }
        });
        
        var that = this;
        this.socket.on('window', function(winData) {
            // Create image info
            var img = new Image();
            img.src = 'data:image/jpeg;base64,' + winData.buffer;
            
            // if window exists, get it and update it
            var win = that.windowObjController.getWindowById(winData.id);
            if (win !== null) {
                win.update(img);
            }
        });
        
        this.socket.on('windowCreate', function(winData) {
            // Create new window
            var win = that.windowObjController.createWindow(winData.id);
            that.scene.add( win.obj );
            console.log("Window " + winData.id + " created");
        });
        
        this.socket.on('windowDestroy', function(winData) {
            // Create new window
            var win = that.windowObjController.destroyWindow(winData.id);
            that.scene.remove( win.obj );
            console.log("Window " + winData.id + " destroyed");
        });
        
        this.render();
    };
    
    this.update = function() {
        // TODO: user windowControllerObject
        Reticulum.update();
    };
    
    this.render = function() {
        this.update();

        this.stereoRenderer.render( this.scene, this.camera );
        
        requestAnimationFrame( this.render.bind(this) );
    };
    
    this.fullscreen = function() {};
    
    this.init();
    
    return this;
};

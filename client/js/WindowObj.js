// written by: Joshua Chan, Anthony Wong, Dmitriy Koz (Virtualization Team)
// tested by: Joshua Chan, Anthony Wong, Dmitriy Koz (Virtualization Team)
// debugged by: Joshua Chan, Anthony Wong, Dmitriy Koz (Virtualization Team)

var WindowObj = function() {
    
    var defaultWidth = 3;
    var defaultHeight = 3;
    
    var id;
    var videoTexture;
    
    this.init = function(id) {
        // Create container object
        this.obj = new THREE.Group();
        
        // Create base/video plane
        var geometry = new THREE.PlaneGeometry(defaultWidth, defaultHeight);
        this.videoTexture = new THREE.Texture();
        var material = new THREE.MeshLambertMaterial({
            color: "#3498db",
            wireframe: false,
            map: this.videoTexture
        });

        var videoScreen = new THREE.Mesh( geometry, material );
        videoScreen.position.z += 0.005;
        
        // Create minimize button
        geometry = new THREE.PlaneGeometry(defaultWidth, defaultHeight / 6);
        material = new THREE.MeshBasicMaterial( { color: "#dab", wireframe: false} );
        
        var minButton = new THREE.Mesh( geometry, material );
        minButton.position.y = defaultHeight * (1/2);
        
        // Create scale button
        geometry = new THREE.PlaneGeometry(defaultWidth, defaultHeight / 6);
        material = new THREE.MeshBasicMaterial( { color: "#777", wireframe: false} );
        
        var scaleButton = new THREE.Mesh( geometry, material );
        scaleButton.position.y = defaultHeight * (-1/2);
        
        this.obj.add(videoScreen);
        this.obj.add(minButton);
        this.obj.add(scaleButton);
        this.id = id;
    };
    
    this.getId = function() {
        return this.id;
    };
    
    this.getPosition = function() {
        // return the position coordinates of the (center?) of the window
        return this.obj.position;
    };
    
    this.setPosition = function(x, y, z) {
        // set the position of the windowObject
        this.obj.position.x = x;
        this.obj.position.y = y;
        this.obj.position.z = z;
        return this.obj.position;
    };
    
    this.close = function() {
        // TODO: this whole thing
    };
    
    this.getSize = function() {
        // TODO: return the width and height of the window calculated from the top left corner to the bottom right
        var w = 0;
        var h = 0;
        return ({ "w": w, "h": h});
    };
    
    this.setSize = function(w, h) {
        // TODO: figure out this whole thing
    };
    
    this.update = function(imgObj) {
        this.videoTexture.image = imgObj;
        var that = this;
        imgObj.onload = function() {
        	that.videoTexture.needsUpdate = true;
        };
    };
    
    this.init();
    
    return this;
};

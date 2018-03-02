import {vec3, vec4, mat3, mat4} from 'gl-matrix';


function degToRad(deg: number) {
    return deg * 3.14159265 / 180.0;

}


class Turtle {
    //1. Since this will keep track of transformations, you'll probably want something to keep track of position, rotation, scale etc.
    currPos: vec3;
    currDir: vec3;
    rotMat: mat4;

    // currRot: vec3;
    // currScale: vec3;
    // worldTransform: mat4;
    // invTrans: mat4;
    next: Turtle;
    prev: Turtle;
    // forward: vec3;
    // up: vec3;
    // right: vec3;

    //have function to transform each vertex in a vbo
    //only actually fill buffers after you've put all pieces into the long vbo, not in create after you read in obj file
    //every time you need to transform a component, copy default vbo data, transform it and append it to the end of the giant vbo
    //need default vbo data for each component and giant vbo that you'll actually pass into buffers when youre ready- put this part in create and make another function to load default array of data
    
    constructor(pos : vec3) {
        this.currPos = vec3.create();
        vec3.set(this.currPos, pos[0], pos[1], pos[2]);
        this.currDir = vec3.create();
        this.currDir = vec3.fromValues(0, 1, 0);

        this.rotMat = mat4.create();
        
        // this.currRot = rot;
        // this.currScale = scale;
        // this.up = vec3.fromValues(0, 1, 0);
        // this.forward = vec3.fromValues(0, 0, 1);
        // this.right = vec3.fromValues(1, 0, 0);
        // this.worldTransform = mat4.create();
        // this.invTrans = mat4.create();
        // this.computeWorldTransform();

        

    }

    
    // computeTransMat() : mat4 {
    //     var empty = mat4.create();
    //     return mat4.translate(empty, empty, this.currPos);
    // }

    computeRotMat(currRot: vec3) : mat4 {
        var empty = mat4.create();
        var rotx = degToRad(currRot[0]);
        var roty = degToRad(currRot[1]);
        var rotz = degToRad(currRot[2]);

        var rotatex = mat4.rotateX(mat4.create(), mat4.create(), rotx);
        var rotatey = mat4.rotateY(mat4.create(), mat4.create(), roty); 
        var rotatez = mat4.rotateZ(mat4.create(), mat4.create(), rotz); 
        mat4.multiply(rotatex, rotatex, rotatey); 
        mat4.multiply(rotatex, rotatex, rotatez);
        return rotatex;
    }

    // computeScaleMat() : mat4 {
    //     var empty = mat4.create();
    //     return mat4.scale(empty, empty, this.currScale);
    // }

    // computeWorldTransform() {
    //     mat4.multiply(this.worldTransform, this.computeTransMat(), this.computeRotMat());
    //     mat4.multiply(this.worldTransform, this.worldTransform, this.computeScaleMat());
        
    //     var transpose: mat4 = mat4.create();
    //     mat4.transpose(transpose, this.worldTransform);
    //     mat4.invert(this.invTrans, transpose);

    // }

    //when you add a turtle to the stack, add in transformations of turtles before it

    //add right and up vectors


    //CHANGE THESE FUNCTIONS SO THEYLL MOVE A DEFAULT VALUE AND TAKE IN NO ARGUMENTS
    //2. You will need methods that can change the position,rotation,scale etc.
    moveForward(z: number) {
        var amount: vec3 = vec3.create();
        vec3.scale(amount, this.currDir, z);
        this.currPos = vec3.add(this.currPos, this.currPos, amount);
       // this.computeWorldTransform();
    }

    // moveRight(x: number) {
    //     var amount: vec3 = vec3.create();
    //     vec3.scale(amount, this.right, x);
    //     this.currPos = vec3.add(this.currPos, this.currPos, amount);
    //     //this.computeWorldTransform();
    // }

    // moveUp(y: number) {
    //     var amount: vec3 = vec3.create();
    //     vec3.scale(amount, this.up, y);
    //     this.currPos = vec3.add(this.currPos, this.currPos, amount);
    //     this.computeWorldTransform();
    // }

    // scale(scale : vec3) {
    //     this.currScale = vec3.add(this.currScale, this.currScale, scale);
    //     this.computeWorldTransform();
    // }

    rotate(rot : vec3) {
        // this.currRot = vec3.add(this.currRot, this.currRot, rot);
        // this.computeWorldTransform();

        //transform forward, right, up vectors
        // var for4 = vec4.fromValues(this.forward[0], this.forward[1], this.forward[2], 0);
        // vec4.transformMat4(for4, for4, this.worldTransform);
        // this.forward = vec3.fromValues(for4[0], for4[1], for4[2]);

        // var right4 = vec4.fromValues(this.right[0], this.right[1], this.right[2], 0);
        // vec4.transformMat4(right4, right4, this.worldTransform);
        // this.right = vec3.fromValues(right4[0], right4[1], right4[2]);

        // var up4 = vec4.fromValues(this.up[0], this.up[1], this.up[2], 0);
        // vec4.transformMat4(up4, up4, this.worldTransform);
        // this.up = vec3.fromValues(up4[0], up4[1], up4[2]);

        //create rotation matrix for new rotation
        var newRot = mat4.create();
        newRot = (this.computeRotMat(rot));

        //multilpy current rotation matrix by new rotation
        mat4.multiply(this.rotMat, this.rotMat, newRot);

        //rotate dir by total rotation matrix
        vec3.transformMat4(this.currDir, vec3.fromValues(0, 1, 0), this.rotMat); //does this have to be a mat3

            
    }

    static linkTurtles(first: Turtle, second: Turtle) {
        if(first != null) {
            first.next = second;
        }
        if(second != null) {
            second.prev = first;
        }
        
    }

    //3. Support for push/pop operations

    
};
export default Turtle;
import {vec3, vec4, mat4} from 'gl-matrix';

class Turtle {
    //1. Since this will keep track of transformations, you'll probably want something to keep track of position, rotation, scale etc.
    currPos: vec3;
    currRot: vec3;
    currScale: vec3;
    worldTransform: mat4;
    invTrans: mat4;
    next: Turtle;
    prev: Turtle;

    //have function to transform each vertex in a vbo
    //only actually fill buffers after you've put all pieces into the long vbo, not in create after you read in obj file
    //every time you need to transform a component, copy default vbo data, transform it and append it to the end of the giant vbo
    //need default vbo data for each component and giant vbo that you'll actually pass into buffers when youre ready- put this part in create and make another function to load default array of data
    
    constructor(pos : vec3, rot : vec3, scale : vec3) {
        this.currPos = pos;
        this.currRot = rot;
        this.currScale = scale;
        this.worldTransform = mat4.create();
        this.invTrans = mat4.create();
        this.computeWorldTransform();
    }

    
    computeTransMat() : mat4 {
        var empty = mat4.create();
        return mat4.translate(empty, empty, this.currPos);
    }

    computeRotMat() : mat4 {
        var empty = mat4.create();
        var rotatex = mat4.rotateX(mat4.create(), mat4.create(), this.currRot[0]);
        var rotatey = mat4.rotateY(mat4.create(), mat4.create(), this.currRot[1]); 
        var rotatez = mat4.rotateZ(mat4.create(), mat4.create(), this.currRot[2]); 
        mat4.multiply(rotatex, rotatex, rotatey); 
        mat4.multiply(rotatex, rotatex, rotatez);
        return rotatex;
    }

    computeScaleMat() : mat4 {
        var empty = mat4.create();
        return mat4.scale(empty, empty, this.currScale);
    }

    computeWorldTransform() {
        mat4.multiply(this.worldTransform, this.computeTransMat(), this.computeRotMat());
        mat4.multiply(this.worldTransform, this.worldTransform, this.computeScaleMat());
        
        var transpose: mat4 = mat4.create();
        mat4.transpose(transpose, this.worldTransform);
        mat4.invert(this.invTrans, transpose);

    }


    //CHANGE THESE FUNCTIONS SO THEYLL MOVE A DEFAULT VALUE AND TAKE IN NO ARGUMENTS
    //2. You will need methods that can change the position,rotation,scale etc.
    translate(trans : vec3) {
        this.currPos = vec3.add(this.currPos, this.currPos, trans);
        this.computeWorldTransform();
    }

    scale(scale : vec3) {
        this.currScale = vec3.add(this.currScale, this.currScale, scale);
        this.computeWorldTransform();
    }

    rotate(rot : vec3) {
        this.currRot = vec3.add(this.currRot, this.currRot, rot);
        this.computeWorldTransform();
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
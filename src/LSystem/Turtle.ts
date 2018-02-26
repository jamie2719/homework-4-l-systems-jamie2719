import {vec3, vec4, mat4} from 'gl-matrix';

class Turtle {
    //1. Since this will keep track of transformations, you'll probably want something to keep track of position, rotation, scale etc.
    currPos: vec3;
    currRot: vec3;
    currScale: vec3;
    worldTransform: mat4;

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

    computeWorldTransform() : mat4 {
        mat4.multiply(this.worldTransform, this.computeTransMat(), this.computeRotMat());
        mat4.multiply(this.worldTransform, this.worldTransform, this.computeScaleMat());
        return this.worldTransform;
    }

    //2. You will need methods that can change the position,rotation,scale etc.
    //3. Support for push/pop operations

    constructor(pos : vec3, rot : vec3, scale : vec3) {
        this.computeWorldTransform();
    }
}
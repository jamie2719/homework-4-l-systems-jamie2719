import ExpansionRule from './ExpansionRule';
import CharNode from './CharNode';
import Turtle from './Turtle';
import Branch from './../geometry/Branch';
import {vec3, vec4} from 'gl-matrix';
import {mat4} from 'gl-matrix';
import MeshDrawable from '../geometry/MeshDrawable';


class TurtleParser {
    renderGrammar : Map<string, Function>;
    seed: string;
    currTurtle: Turtle;
    defaultBranch: Branch;
    currBranch: Branch;
    turtleHead: Turtle;

    constructor(curr: Turtle) {
       // this.defaultBranch = new Branch(vec3.fromValues(0, 0, 0));
        //this.currBranch = new Branch(vec3.fromValues(0, 0, 0));
        //this.createBranch(vec3.fromValues(0, 1, 0));
        this.currTurtle = curr;
        this.turtleHead = null;
        this.renderGrammar = new Map<string, Function>();
    }

    createBranch(center: vec3) {
        var newBranch = new Branch(center);
        newBranch.positions = new Float32Array(this.defaultBranch.positions);
        newBranch.normals = new Float32Array(this.defaultBranch.normals);
        newBranch.indices = new Uint32Array(this.defaultBranch.indices);
        return newBranch;
    }

    shiftBranch(center:vec3, newBranch: Branch) {
        for(var i = 0; i < newBranch.positions.length; i+=4) {
            newBranch.positions[i] += center[0];
            newBranch.positions[i+1] += center[1];
            newBranch.positions[i+2] += center[2];
        }

        return newBranch;
    }



    static VBOtoVec4(arr: Float32Array) {
        var vectors: Array<vec4> = new Array<vec4>();
        for(var i = 0; i < arr.length; i+=4) {
          var currVec = vec4.fromValues(arr[i], arr[i+1], arr[i+2], arr[i+3]);
          vectors.push(currVec);
        }
        return vectors;
      }
      
      transformVectors(vectors: Array<vec4>, transform: mat4) {
        for(var i = 0; i < vectors.length; i++) {
            var newVector: vec4 = vec4.create();
            newVector = vec4.transformMat4(newVector, vectors[i], transform);
 
            vectors[i] = newVector;
        }
        return vectors;
      }
      
      // Just converts from vec4 to floats for VBOs
      static Vec4toVBO(vectors: Array<vec4>) {
        var j: number = 0;
        var arr = new Float32Array(vectors.length*4);
        for(var i = 0; i < vectors.length; i++) {
            var currVec = vectors[i];
            arr[j] = currVec[0];
            arr[j+1] = currVec[1];
            arr[j+2] = currVec[2];
            arr[j+3] = currVec[3];
            j+=4;
        }
        return arr;
      }


     // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode: CharNode, meshDrawable: MeshDrawable) {
        //var func = this.renderGrammar.get(symbolNode.char);

        if(symbolNode.char == 'F') {
            //store old turtlePos
            var oldTurtlePos = vec3.create();
            oldTurtlePos.set(this.currTurtle.currPos); //

            //translate turtle forward
            this.currTurtle.moveForward(5);

            //find center of new branch- average of old pos and new pos
            var newCenter = vec3.create();
            vec3.add(newCenter, oldTurtlePos, this.currTurtle.currPos);
            vec3.scale(newCenter, newCenter, .5);

            //convert positions (of default branch) into vec4s, transform, and convert back
            var posVectors = TurtleParser.VBOtoVec4(this.defaultBranch.positions);
            var norVectors = TurtleParser.VBOtoVec4(this.defaultBranch.normals);
            
            posVectors = this.transformVectors(posVectors, this.currTurtle.rotMat);
            norVectors = this.transformVectors(norVectors, this.currTurtle.rotMat); //change to inverse transpose
 
            //create new branch at that new center point
            var newBranch = this.createBranch(newCenter);

            newBranch.positions = TurtleParser.Vec4toVBO(posVectors);
            newBranch.normals = TurtleParser.Vec4toVBO(norVectors);

            //shift positions of default branch so new branch is at correct offset
            newBranch = this.shiftBranch(newCenter, newBranch);

            //actually draw branch
            meshDrawable = meshDrawable.addMeshComponent(newBranch);
        }

        //rotate around z axis
        else if(symbolNode.char == '+') {
            this.currTurtle.rotate(vec3.fromValues(0, 0, -30));
        }
        else if(symbolNode.char == '-') {
            this.currTurtle.rotate(vec3.fromValues(0, 0, 30));
        }

        else if(symbolNode.char == '[') {
            var parentTransform = mat4.create();
            //push new turtle with current state onto stack
            if(this.turtleHead != null) {
                var temp = this.turtleHead;
                Turtle.linkTurtles(this.currTurtle, temp);
            }

            this.turtleHead = new Turtle(this.currTurtle.currPos); 
        }
        else if(symbolNode.char == ']') {
            //pop off head of stack and set curr to that
            if(this.turtleHead != null) {
                var temp = new Turtle(this.turtleHead.currPos);
                this.currTurtle = temp;
                this.turtleHead = this.turtleHead.next;
            }
        }

        //rotate around x axis
        else if(symbolNode.char == 'L') {
            this.currTurtle.rotate(vec3.fromValues(70, 0, 0));
        }
        else if(symbolNode.char == 'R') {
            this.currTurtle.rotate(vec3.fromValues(-70, 0, 0));
        }
        else if(symbolNode.char == 'B') {
            this.currTurtle.rotate(vec3.fromValues(20, 0, 0));
        }
        else if(symbolNode.char == 'V') {
            this.currTurtle.rotate(vec3.fromValues(-20, 0, 0));
        }
        else if(symbolNode.char == 'Q') {
            this.currTurtle.rotate(vec3.fromValues(0, 65, 0));
        }
        else if(symbolNode.char == 'W') {
            this.currTurtle.rotate(vec3.fromValues(0, -65, 0));
        }

        return meshDrawable;

    };

    // Invoke renderSymbol for every node in a linked list of grammar symbols.
    renderSymbols(head: CharNode, meshDrawable: MeshDrawable) {
        var currentNode;
        for(currentNode = head; currentNode != null; currentNode = currentNode.next) {
            meshDrawable = this.renderSymbol(currentNode, meshDrawable);
        }
        return meshDrawable;
    }

};
export default TurtleParser;

//start by just creating a new mesh drawable for each transformed component and calling draw on each one
//eventually replace each draw call by appending to a giant vbo of one single mesh drawable and call draw on that
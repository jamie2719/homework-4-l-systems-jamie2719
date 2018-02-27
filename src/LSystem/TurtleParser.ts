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
    turtleHead: Turtle;

    constructor(curr: Turtle) {
        this.defaultBranch = new Branch(vec3.fromValues(0, 0, 0));
        this.currTurtle = curr;
        this.renderGrammar = new Map<string, Function>();
        this.createGrammar();
    }



    createGrammar() {
        this.renderGrammar.set('H', this.currTurtle.translate);
        this.renderGrammar.set('X', this.currTurtle.rotate);

        //FINISH SETTING UP GRAMMAR HERE
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
         // console.log(vectors);
        for(var i = 0; i < vectors.length; i++) {
            var newVector: vec4 = vec4.create();
            newVector = vec4.transformMat4(newVector, vectors[i], transform);
 
            vectors[i] = newVector;
        }
        return vectors;
      }
      
      // Just converts from vec4 to floats for VBOs
      static Vec4toVBO(vectors: Array<vec4>, arr: Float32Array) {
        var j: number = 0;
        arr = new Float32Array(vectors.length*4);
        for(var i = 0; i < vectors.length; i++) {
            var currVec = vectors[i];
            //console.log(currVec);
            arr[j] = currVec[0];
            arr[j+1] = currVec[1];
            arr[j+2] = currVec[2];
            arr[j+3] = currVec[3];
            j+=4;
        }
        console.log(arr);
        return arr;
      }


     // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode: CharNode, meshDrawable: MeshDrawable) {
        //var func = this.renderGrammar.get(symbolNode.char);

        if(symbolNode.char == 'F') {
            this.currTurtle.translate(vec3.fromValues(2, 0, 0));
        }
        else if(symbolNode.char == 'X') {
            this.currTurtle.rotate(vec3.fromValues(0, 0, 30));
        }
        else if(symbolNode.char == '[') {
            //push new turtle with current state onto stack
            Turtle.linkTurtles(this.currTurtle, this.turtleHead);
        }
        else if(symbolNode.char == ']') {
            //pop off head of stack and set curr to that
            this.currTurtle = this.turtleHead;
            this.turtleHead = this.turtleHead.next;
            this.turtleHead.prev = null;
        }
        else if(symbolNode.char == 'B') {
            //draw branch at current turtle state
            var newBranch = this.defaultBranch;
            //console.log(newBranch);
            //convert vertex data of components to vec4s
            var posVectors = TurtleParser.VBOtoVec4(newBranch.positions);
            var norVectors = TurtleParser.VBOtoVec4(newBranch.normals);

            posVectors = this.transformVectors(posVectors, this.currTurtle.worldTransform);
            norVectors = this.transformVectors(norVectors, this.currTurtle.invTrans);
            //create new branch for this transformed branch with these transformed data
        
            newBranch.positions = TurtleParser.Vec4toVBO(posVectors, newBranch.positions);
            newBranch.normals = TurtleParser.Vec4toVBO(norVectors, newBranch.positions);
            meshDrawable = meshDrawable.addMeshComponent(newBranch);
        }

        

    };

    // Invoke renderSymbol for every node in a linked list of grammar symbols.
    renderSymbols(head: CharNode, meshDrawable: MeshDrawable) {
        var currentNode;
        for(currentNode = head; currentNode != null; currentNode = currentNode.next) {
            //console.log(this.currTurtle);
            this.renderSymbol(currentNode, meshDrawable);
        }
        //console.log(meshDrawable);
        return meshDrawable;
    }

};
export default TurtleParser;

//start by just creating a new mesh drawable for each transformed component and calling draw on each one
//eventually replace each draw call by appending to a giant vbo of one single mesh drawable and call draw on that
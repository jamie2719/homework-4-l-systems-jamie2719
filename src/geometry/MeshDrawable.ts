import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import * as OBJ from 'webgl-obj-loader';
import * as Mesh from 'webgl-obj-loader';

//contains the VBOs of the total of all of the mesh components in the scene
class MeshDrawable extends Drawable {
    indices: Uint32Array;
    positions: Float32Array;
    normals: Float32Array;

    center: vec4;


    constructor() {
        super(); // Call the constructor of the super class. This is required.
        //this.center = vec4.fromValues(center[0], center[1], center[2], 1);
        this.indices = new Uint32Array(0);
        this.positions = new Float32Array(0);
        this.normals = new Float32Array(0);
    }   
    
    
    addMeshComponent(m: MeshDrawable) {
      
      var tempP = this.positions;
      if(this.positions.length != 0) {
        
        //console.log(this.positions);
        this.positions = new Float32Array(tempP.length + m.positions.length);
        this.positions.set(tempP);
        this.positions.set(m.positions, tempP.length);
        //console.log(this.positions);
      }
      else {
        this.positions = new Float32Array(m.positions.length);
        this.positions.set(m.positions);
      }

      if(this.normals != null) {
        var tempN = this.normals;
        this.normals = new Float32Array(tempN.length + m.normals.length);
        this.normals.set(tempN);
        this.normals.set(m.normals, tempN.length);
      }
      else {
        this.normals.set(m.normals);
      }

      if(this.indices != null) {

        var tempI = this.indices;
        this.indices = new Uint32Array(tempI.length + m.indices.length);
        this.indices.set(tempI);
        var j = tempI.length;
        //console.log(j);
        for(var i = 0; i < m.indices.length; i++) {
          this.indices[j] = m.indices[i] + tempP.length/4;
          j++;
        }
      }
      else {
        this.indices.set(m.indices);
      }

      this.count = this.indices.length;

      console.log(this.positions);

      return this;
    }
      

create() {
  //   const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  // var gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  // var objStr = document.getElementById('cube.obj').innerHTML;
    
  // var mesh = new OBJ.Mesh(objStr);
  // OBJ.initMeshBuffers(gl, mesh);

  // this.positions = new Float32Array(mesh.vertices.length + mesh.vertices.length / 3.0);
  // this.normals = new Float32Array(mesh.vertexNormals.length +  mesh.vertexNormals.length / 3.0);
  // this.indices = new Uint32Array(mesh.indices);
    

  // var j = 0;
  // for(var i = 0; i < mesh.vertices.length; i+=3) {
  //   this.positions[j] = mesh.vertices[i];
  //   this.positions[j+1] = mesh.vertices[i+1];
  //   this.positions[j+2] = mesh.vertices[i+2];
  //   this.positions[j+3] = 1;
  //   j+=4;
  // }


  // var k = 0;
  // for(var i=0; i < mesh.vertexNormals.length; i+=3) {
  //   this.normals[k] = mesh.vertexNormals[i];
  //   this.normals[k+1] = mesh.vertexNormals[i+1];
  //   this.normals[k+2] = mesh.vertexNormals[i+2];
  //   this.normals[k+3] = 0;
  //   k+=4;
  // }
   
  //   console.log(this.positions);

    this.generateIdx();
    this.generatePos();
    this.generateNor();

    this.count = this.indices.length;
  


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    
    console.log(`Created mesh`);
  }
};

export default MeshDrawable;   
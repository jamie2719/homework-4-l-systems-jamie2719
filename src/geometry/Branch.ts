import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import * as OBJ from 'webgl-obj-loader';
import * as Mesh from 'webgl-obj-loader';
import MeshDrawable from './MeshDrawable';

//contains the vertex data of the loaded branch object, but does not create buffers 
class Branch extends MeshDrawable {
    // indices: Uint32Array;
    // positions: Float32Array;
    // normals: Float32Array;

    center: vec4;


    constructor(center: vec3) {
        super(); // Call the constructor of the super class. This is required.
        this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    }    

    loadMesh() {
      const canvas = <HTMLCanvasElement> document.getElementById('canvas');
      var gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
      var objStr = document.getElementById('square.obj').innerHTML;
        
      var mesh = new OBJ.Mesh(objStr);
      OBJ.initMeshBuffers(gl, mesh);

      this.positions = new Float32Array(mesh.vertices.length + mesh.vertices.length / 3.0);
      this.normals = new Float32Array(mesh.vertexNormals.length +  mesh.vertexNormals.length / 3.0);
      this.indices = new Uint32Array(mesh.indices);
        

      var j = 0;
      for(var i = 0; i < mesh.vertices.length; i+=3) {
        this.positions[j] = mesh.vertices[i];
        this.positions[j+1] = mesh.vertices[i+1];
        this.positions[j+2] = mesh.vertices[i+2];
        this.positions[j+3] = 1;
        j+=4;
      }


      var k = 0;
      for(var i=0; i < mesh.vertexNormals.length; i+=3) {
        this.normals[k] = mesh.vertexNormals[i];
        this.normals[k+1] = mesh.vertexNormals[i+1];
        this.normals[k+2] = mesh.vertexNormals[i+2];
        this.normals[k+3] = 0;
        k+=4;
      }
      this.count = this.indices.length;
    }


  create() {
    // this.generateIdx();
    // this.generatePos();
    // this.generateNor();

    // this.count = this.indices.length;


    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    // gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    // gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    // gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    // gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    
    console.log(`Loaded branch`);
  }
};

export default Branch;   
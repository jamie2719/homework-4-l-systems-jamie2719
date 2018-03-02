import {vec3} from 'gl-matrix';
import {mat4, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import { print } from 'util';
import * as OBJ from 'webgl-obj-loader';
import MeshDrawable from './geometry/MeshDrawable';
import LSystem from './LSystem/LSystem';
import CharNode from './LSystem/CharNode';
import TurtleParser from './LSystem/TurtleParser';
import Turtle from './LSystem/Turtle';
import Branch from './geometry/Branch';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  tesselations: 5,
  Red: 1,
  Green: 0,
  Blue: 1,
  Iterations: 0,
  Axiom: "F",
  Reload: function() {loadScene()}
};

let icosphere: Icosphere;
let square: Square;
let cube: Cube;
let currTime: number = 0;
let meshDrawable : MeshDrawable;
let lsystem: LSystem;
let turtleParser: TurtleParser;
//original obj data for branches
let indicesB: Uint32Array; 
let positionsB: Float32Array;
let normalsB: Float32Array;

function loadMeshComponents() {
  // const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  // var gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  // var objStr = document.getElementById('cube.obj').innerHTML;
    
  // var mesh = new OBJ.Mesh(objStr);
  // OBJ.initMeshBuffers(gl, mesh);

  // positionsB = new Float32Array(mesh.vertices.length + mesh.vertices.length / 3.0);
  // normalsB = new Float32Array(mesh.vertexNormals.length +  mesh.vertexNormals.length / 3.0);
  // indicesB = new Uint32Array(mesh.indices);
    

  // var j = 0;
  // for(var i = 0; i < mesh.vertices.length; i+=3) {
  //   positionsB[j] = mesh.vertices[i];
  //   positionsB[j+1] = mesh.vertices[i+1];
  //   positionsB[j+2] = mesh.vertices[i+2];
  //   positionsB[j+3] = 1;
  //   j+=4;
  // }


  // var k = 0;
  // for(var i=0; i < mesh.vertexNormals.length; i+=3) {
  //   normalsB[k] = mesh.vertexNormals[i];
  //   normalsB[k+1] = mesh.vertexNormals[i+1];
  //   normalsB[k+2] = mesh.vertexNormals[i+2];
  //   normalsB[k+3] = 0;
  //   k+=4;
  // }
}




function loadScene() {
  //loadMeshComponents();

  meshDrawable = new MeshDrawable();

  lsystem = new LSystem(controls.Axiom, controls.Iterations);
  lsystem.doIterations();
  console.log(lsystem.seed);

  //load in default branch vertex data
  var branchDef = new Branch(vec3.fromValues(0, 0, 0));
  branchDef.loadMesh();
  //create first turtle
  var currTurtle = new Turtle(vec3.fromValues(0, 0, 0));
  //create turtle stack
  turtleParser = new TurtleParser(currTurtle);
  
  //set turtle stack's default branch to the branch you created
  turtleParser.defaultBranch = branchDef;
  //turtleParser.createBranch();
  meshDrawable = turtleParser.renderSymbols(CharNode.stringToLinkedList(lsystem.seed), meshDrawable);
  meshDrawable.create();

}

//keep resizeable arrays for each thing in drawable class and store copy of original obj data
//- each time you transform position of new branch/component, convert original obj data to vec4s,
//multiply each by transformation, convert back to vbo arrays, append these arrays to resizeable arrays
//finally, call create on all resizeable arrays



function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'tesselations', 0, 8).step(1);
  gui.add(controls, 'Red', 0, 1).step(.05);
  gui.add(controls, 'Green', 0, 1).step(.05);
  gui.add(controls, 'Blue', 0, 1).step(.05);
  gui.add(controls, 'Iterations', 0, 10).step(1);
  gui.add(controls, 'Axiom');
  gui.add(controls, 'Reload');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);


  // This function will be called every frame
  function tick() {
    lambert.setTime(currTime);
    currTime++;
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    let color = vec4.fromValues(controls.Red, controls.Green, controls.Blue, 1);  
    lambert.setGeometryColor(color);
    renderer.clear();
    
   

    renderer.render(camera, lambert, [
      //icosphere,
      //square,
      //cube
      meshDrawable
    ]);
  
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();



//load in one copy of primitive
//

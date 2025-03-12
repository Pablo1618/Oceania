/*
Clarification: this is a modified code from the Marzipano VR view demo found here: https://github.com/google/marzipano/tree/master/demos/webvr
However, that code was several years old and required some substantial modifications + customization.

*/

/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


'use strict';

var mat4 = Marzipano.dependencies.glMatrix.mat4;
var quat = Marzipano.dependencies.glMatrix.quat;
var degToRad = Marzipano.util.degToRad;

var viewerElement = document.querySelector("#pano");
var vrModeButton = document.querySelector("#vr-mode-button")
// Create stage and register renderers.
var stage = new Marzipano.WebGlStage();
Marzipano.registerDefaultRenderers(stage);

// Insert stage into the DOM.
viewerElement.appendChild(stage.domElement());

// Update the stage size whenever the window is resized.
function updateSize() {
  stage.setSize({
    width: viewerElement.clientWidth,
    height: viewerElement.clientHeight
  });
}
updateSize();
window.addEventListener("resize", updateSize);

// Create geometry.
var geometry = new Marzipano.CubeGeometry([
  { tileSize: 256, size: 256, fallbackOnly: true },
  { tileSize: 512, size: 512 },
  { tileSize: 512, size: 1024 },
  { tileSize: 512, size: 2048 },
  { tileSize: 512, size: 4096 }
]);

// Create a normal Marzipano view for non-XR mode
var limiter = Marzipano.RectilinearView.limit.traditional(4096, 110 * Math.PI / 180);
var view = new Marzipano.RectilinearView({ yaw: 0, pitch: 0, roll: 0 }, limiter);

// Create layer.
var layer = createLayer(stage, view, geometry);
stage.addLayer(layer);



let xrSession = null;
let xrReferenceSpace = null;



vrModeButton.addEventListener("click", async function () {
  if (!xrSession) {
    try {
      let gl = stage.domElement().getContext("webgl", { xrCompatible: true }); // ✅ FIXED WebGL Context
      xrSession = await navigator.xr.requestSession("immersive-vr");

      let xrLayer = new XRWebGLLayer(xrSession, gl);
      xrSession.updateRenderState({ baseLayer: xrLayer });

      xrReferenceSpace = await xrSession.requestReferenceSpace("local");

      xrSession.requestAnimationFrame(renderVr);
    } catch (error) {
      console.error("Failed to start WebXR session", error);
    }
  }
});
function renderVr(time, frame) {
  let session = frame.session;
  let pose = frame.getViewerPose(xrReferenceSpace);

  if (pose) {
    let xrView = pose.views[0]; // Get the first eye (centered VR pose)
    let transformMatrix = xrView.transform.matrix;

    // Extract yaw, pitch, and roll from the WebXR matrix
    let yaw = Math.atan2(transformMatrix[8], transformMatrix[10]); // Y-axis rotation
    let pitch = Math.asin(-transformMatrix[9]); // X-axis rotation
    let roll = Math.atan2(transformMatrix[1], transformMatrix[5]); // Z-axis rotation

    // Update Marzipano view
    view.setYaw(yaw);
    view.setPitch(pitch);
    view.setRoll(roll);
  }

  stage.render();
  session.requestAnimationFrame(renderVr);
}

function createLayer(stage, view, geometry) {
  var urlPrefix = "//www.marzipano.net/media/music-room";
  var source = new Marzipano.ImageUrlSource.fromString(
    urlPrefix + "/left/{z}/{f}/{y}/{x}.jpg",
    { cubeMapPreviewUrl: urlPrefix + "/left/preview.jpg" }
  );

  var textureStore = new Marzipano.TextureStore(source, stage);
  var layer = new Marzipano.Layer(source, geometry, view, textureStore);

  layer.pinFirstLevel();
  return layer;
}

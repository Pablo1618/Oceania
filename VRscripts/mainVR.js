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

window.inVrMode = false;

var mat4 = Marzipano.dependencies.glMatrix.mat4;
var quat = Marzipano.dependencies.glMatrix.quat;
var degToRad = Marzipano.util.degToRad;

var viewerElement = document.querySelector("#pano");
var vrModeButton = document.querySelector("#vr-mode-button")

var stage = window.marzipanoStage;

// Update the stage size whenever the window is resized.
function updateSize() {
  stage.setSize({
    width: viewerElement.clientWidth,
    height: viewerElement.clientHeight
  });
}
updateSize();
window.addEventListener("resize", updateSize);


let xrSession = null;
let xrReferenceSpace = null;
let gl = null;

async function exitVrMode() {
  if (xrSession) {
    try {
      // Zapisz aktualny stan sceny
      const view = window.marzipanoScene.view;
      const sceneName = document.querySelector('.sceneName').textContent; // Pobierz nazwę sceny
      const currentState = {
        yaw: view.yaw(),
        pitch: view.pitch(),
        roll: view.roll(),
        sceneName: sceneName // Dodaj nazwę sceny
      };
      localStorage.setItem('sceneState', JSON.stringify(currentState));
      console.log("Scene state saved:", currentState);

      // Zakończ sesję XR
      xrSession.updateRenderState({ baseLayer: null });
      await xrSession.end();
      history.pushState({ vr: false }, "Normal Mode");

      window.inVrMode = false;
      xrSession = null;
      xrReferenceSpace = null;
      gl = null;

      console.log("Exited VR mode");

      // Przeładuj stronę
      window.location.reload();
    } catch (error) {
      console.error("Failed to exit VR mode", error);
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const savedState = JSON.parse(localStorage.getItem('sceneState'));
  if (savedState) {
    const view = window.marzipanoScene.view;

    // Przywróć yaw, pitch i roll
    view.setYaw(savedState.yaw);
    view.setPitch(savedState.pitch);
    view.setRoll(savedState.roll);
    console.log("Scene state restored:", savedState);

    // Przywróć sceneName i ustaw odpowiednią scenę
    if (savedState.sceneName) {
      const sceneNameElement = document.querySelector('.sceneName');
      if (sceneNameElement) {
        sceneNameElement.textContent = savedState.sceneName; // Ustaw nazwę sceny w interfejsie
      }

      // Jeśli masz mechanizm zmiany sceny, wywołaj go tutaj
      const scene = window.marzipanoScenes[savedState.sceneName];
      if (scene) {
        window.marzipanoScene.switchToScene(scene); // Przełącz na zapisaną scenę
        console.log("Scene switched to:", savedState.sceneName);
      }
    }

    // Wyczyść zapisany stan
    localStorage.removeItem('sceneState');
  }
});

// Obsługa przycisku "Back" na urządzeniach mobilnych
window.addEventListener("popstate", () => {
  if (window.inVrMode) {
    exitVrMode();
  }
});

// ...existing code...
vrModeButton.addEventListener("click", async function () {
  if (!xrSession) {
    try {
      console.log("VR ON!");

      gl = window.marzipanoStage.domElement().getContext("webgl", { xrCompatible: true });

      xrSession = await navigator.xr.requestSession("immersive-vr", {
        requiredFeatures: ["local-floor"]
      });

      // Dodaj stan do historii przeglądarki
      history.pushState({ vr: true }, "VR Mode");

      // Create the XRWebGLLayer
      let xrLayer = new XRWebGLLayer(xrSession, gl);

      // Update the session's render state
      xrSession.updateRenderState({ baseLayer: xrLayer });

      xrReferenceSpace = await xrSession.requestReferenceSpace("local-floor");

      window.inVrMode = true;

      xrSession.requestAnimationFrame(renderVr);
    } catch (error) {
      console.error("Failed to start WebXR session", error);
    }
  }
});


function renderVr(time, frame) {
    console.log("Render vr");

    let session = frame.session;
    let pose = frame.getViewerPose(xrReferenceSpace);
    let glLayer = session.renderState.baseLayer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);
    
    if (pose) {
      let xrView = pose.views[0]; // Get the first eye (centered VR pose)
      let transformMatrix = xrView.transform.matrix;

      let yaw = -Math.atan2(transformMatrix[8], transformMatrix[10]); // Y-axis rotation
      let pitch = -Math.asin(-transformMatrix[9]); // X-axis rotation
      let roll = -Math.atan2(transformMatrix[1], transformMatrix[5]); // Z-axis rotation
  
     window.marzipanoScene.view.setYaw(yaw);
     window.marzipanoScene.view.setPitch(pitch);
     window.marzipanoScene.view.setRoll(roll);


  

    
 
     
    }
    window.marzipanoStage.render();
    xrSession.requestAnimationFrame(renderVr);
  }

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
let originalPanoChildren = null;
let container = null;

let currentSceneId = null;
let currentViewParams = null;

vrModeButton.addEventListener("click", async function () {
  container = document.getElementById('pano');
  originalPanoChildren = container.innerHTML;

  currentSceneId = window.marzipanoScene.data.id;
  currentViewParams = window.marzipanoScene.view.parameters();

    if (!xrSession) {
      try {
 

        console.log("VR ON!");


        gl = window.marzipanoStage.domElement().getContext("webgl", {xrCompatible:true});

        xrSession = await navigator.xr.requestSession("immersive-vr", {
          requiredFeatures: ["local-floor"]
        });

                // Create the XRWebGLLayer
        let xrLayer = new XRWebGLLayer(xrSession, gl);
            
        // Update the session's render state
        xrSession.updateRenderState({ baseLayer: xrLayer });

        xrReferenceSpace = await xrSession.requestReferenceSpace("local-floor");
     
       
        window.inVrMode = true;

        history.pushState({inVr:true}, "W trybie VR", "#vr");

        xrSession.addEventListener("end", onVrSessionEnded);
        

        xrSession.requestAnimationFrame(renderVr);
      } catch (error) {
        console.error("Failed to start WebXR session", error);
        window.inVrMode = false;
        xrSession = null;
        gl = null;
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


  function onVrSessionEnded()
  {
  
    console.log("VR session ended");
    window.inVrMode = false;

    if(xrSession)
    {
      xrSession.end();
      xrSession.removeEventListener('end', onVrSessionEnded);
     
      xrSession = null;
    }
    gl = null;
    xrReferenceSpace = null;


    //things that don't work
    //  window.marzipanoViewer.controls().enable();
    // window.marzipanoScene.scene._updateHotspotContainerHandler();
    //document.querySelector('canvas').focus();
    // adding controls back (they are already enabled and arent the problem)
    // binding gl framebuffer to null
    // switching back to this scene
    // manually recreating hotspots

  
    /*
      -- Nuclear Option --

      Robelek
    */

   
  
    if (window.location.hash === "#vr") {
     
     history.replaceState(null, document.title, window.location.pathname + window.location.search);
 
    }
   

  }

  window.addEventListener("popstate", (event) => 
  {
    event.preventDefault();
    if(window.inVrMode)
    {
      console.log("Go back button pressed");

      if(xrSession)
      {
        try
        {
          
          

          console.log("Id sceny ", currentSceneId);
          console.table(currentViewParams)
          xrSession.end();
          console.log("xr session end succes")
          
          console.log(container);
          document.querySelector('canvas[style*="z-index: 9999"]')?.remove();
          container.querySelector("canvas")?.remove()

          window.marzipanoInit(
            {
              currentSceneId:currentSceneId,
              currentViewParams:currentViewParams

            }
          )
           window.marzipanoScene.view.setRoll(0);

        }
        catch(error)
        {
          
          console.error("Error when ending xrSession:", error);
          onVrSessionEnded();
          
        }
      }
      else
      {
        onVrSessionEnded();
      }
    }
  })


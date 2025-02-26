/* global vars */
let deckData = {};
let currentDeckLevel = 2;
const ORIGINAL_DECK_IMAGE_WIDTH = 1920;
const ORIGINAL_DECK_IMAGE_HEIGHT = 1080;

let shipImageElement = null;
let pinContainer = null;

// --- Panele boczne ---
// Lewy panel
const open_left_panel_button = document.getElementById('div_open_left_panel_button');
const left_panel = document.getElementById('left-panel');
open_left_panel_button.addEventListener('click', () => {
    left_panel.classList.toggle('open');
    const icon = open_left_panel_button.querySelector('i');
    icon.classList.toggle('fa-arrow-right');
    icon.classList.toggle('fa-arrow-left');
});



/* 
######################
TEMPLATE FOR JSON SCENE
######################

{
    "name": "Scena 1",
    "position": {
    "x": 120,
    "y": 250
    },
    "link": "maszynownia-silnik-link",
    "color": [255, 0, 0]
}

*/



//loading the deck data
window.onload = function()
{
    fetch('deckData/deckData.json')
    .then(response => response.json())
    .then(data => 
        { 
            deckData = data['decks'];
        })
    .then(() => updatePins(1));

    shipImageElement = document.getElementById('shipImage');
    pinContainer = document.querySelector('.pinsContainer');

    window.onresize = updatePins;
}

//this should show always the correct pins for given level
function updatePins()
{
    //console.log(deckData);
    let pinsHere = deckData[currentDeckLevel];

    //console.log(pinsHere);

    let scaledImageSize = shipImageElement.getBoundingClientRect();

    pinContainer.replaceChildren();


    let vw = window.innerWidth * 0.01;

    let idCounter = 0;
    for(pin of pinsHere)
    {
        console.log(pin);
        
        let position = {x: pin['position']['x'], y: pin['position']['y']};
        position['x'] = position['x'] / ORIGINAL_DECK_IMAGE_WIDTH * scaledImageSize.width;
        position['y'] = position['y'] / ORIGINAL_DECK_IMAGE_HEIGHT * scaledImageSize.height;

        let pinElement = document.createElement('a');
        pinElement.classList.add('pin');
        pinElement.style.left = (position['x'] -0.25*vw) + 'px';
        pinElement.style.top = (position['y'] -0.25*vw) + 'px';
        pinElement.id = `${idCounter}-pin`;
        pinElement.addEventListener('click', ((link) => {
            return () => document.getElementById(link).click();
        })(pin['link']));
        pinElement.style.backgroundColor = `rgb(${pin['color'][0]}, ${pin['color'][1]}, ${pin['color'][2]})`;

        let tooltip = document.createElement('span');
        tooltip.textContent = pin['name'];
        tooltip.classList.add('tooltip');
        pinElement.addEventListener('mouseover', () => {
            tooltip.style.visibility = 'visible';
        })
        pinElement.addEventListener('mouseout', () => {
            tooltip.style.visibility = 'hidden';
        })
        
        pinElement.appendChild(tooltip);

        pinContainer.appendChild(pinElement);

        console.log(position);

    }

    console.log('Pins updated')
}


function changeLevel(height){
    currentDeckLevel = height;

    if(height==2){
        shipImageElement.src = 'ui-img/poklad.png';
    }
    else if(height==1){
        shipImageElement.src = 'ui-img/miedzypoklad.png';
    }
    else if(height==0){
        shipImageElement.src = 'ui-img/maszynownia.png';
    }
    updatePins();
}


// Prawy panel
const open_right_panel_button = document.getElementById('div_open_right_panel_button');
const right_panel = document.getElementById('right-panel');
open_right_panel_button.addEventListener('click', () => {
    right_panel.classList.toggle('open');
    const icon = open_right_panel_button.querySelector('i');
    icon.classList.toggle('fa-arrow-right');
    icon.classList.toggle('fa-arrow-left');
});
function toggleList(id) {
    var list = document.getElementById(id);
    list.classList.toggle("listShown");

    if(list.classList.contains("listShown"))
    {
        list.style.maxHeight = list.scrollHeight + 'px';
    }
    else
    {
        list.style.maxHeight = '0px';
    }

  }
  
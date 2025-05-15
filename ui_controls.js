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



//loading the deck data and descriptions
window.onload = function()
{
    fetch('descriptions.json')
    .then(response => response.json())
    .then(data => {
        descriptions = data;
    })
    .catch(error => {
        console.error('Błąd podczas ładowania opisu:', error);
        descriptions = {};
    });

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
  
//   function showDescription() {

//     const descriptionDiv = document.getElementById('description-div');
//     descriptionDiv.style.display = 'flex';
//     const descriptionContent = document.getElementById('description-content-div');
//     setTimeout(() => {
//         descriptionContent.style.marginTop = '0%';
//         descriptionDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
//     }, 10);
// }

function showDescription() {
    const descriptionDiv = document.getElementById('description-div');
    descriptionDiv.style.display = 'flex';
    const descriptionContent = document.getElementById('description-content-div');
    
    setTimeout(() => {
        descriptionContent.style.marginTop = '0%';
        descriptionDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    }, 10);

    const sceneName = document.querySelector('.sceneName').textContent;
    const descriptionTitle = document.getElementById('description-title')
    const descriptionParagraph = document.getElementById('description-paragraph')
    if (descriptions[sceneName]) {
        descriptionTitle.innerHTML = sceneName;
        descriptionParagraph.innerHTML = descriptions[sceneName];
    } else {
        descriptionTitle.innerHTML = '';
        descriptionParagraph.innerHTML = 'Brak opisu dla tej sceny.';
    }
}
function showAutorsDescription() {
    showDescription();

    const descriptionTitle = document.getElementById('description-title')
    const descriptionParagraph = document.getElementById('description-paragraph')
    const sceneName = "Informacje o autorach";
    descriptionTitle.innerHTML = sceneName;
    descriptionParagraph.innerHTML = descriptions[sceneName];
}

function hideDescription(){
    const descriptionContent = document.getElementById('description-content-div');
    setTimeout(() => {
        descriptionContent.style.marginTop = '-100%';
        document.getElementById('description-div').style.backgroundColor = 'rgba(0, 0, 0, 0.0)';
    }, 10);

    setTimeout(() => {
        document.getElementById('description-div').style.display = 'none';
    }, 600);
}


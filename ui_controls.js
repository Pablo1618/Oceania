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
function changeLevel(height){
    if(height==2){
        document.getElementById('shipImage').src = 'ui-img/poklad.png';
    }
    else if(height==1){
        document.getElementById('shipImage').src = 'ui-img/miedzypoklad.png';
    }
    else if(height==0){
        document.getElementById('shipImage').src = 'ui-img/maszynownia.png';
    }
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
    if (list.style.display === "none" || list.style.display === "") {
      list.style.display = "block";
    } else {
      list.style.display = "none";
    }
  }
  
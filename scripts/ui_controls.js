const container = document.querySelector('#container');
const panorama = new PANOLENS.ImagePanorama('sphere_photos/mostek1.jpg');
const viewer = new PANOLENS.Viewer({ horizontalView: false, momentum: false, cameraFov: 85, container: container });
viewer.add(panorama);

// Left panel toggle
const open_left_panel_button = document.getElementById('div_open_left_panel_button');
const left_panel = document.getElementById('left-panel');
open_left_panel_button.addEventListener('click', () => {
    left_panel.classList.toggle('open');
    const icon = open_left_panel_button.querySelector('i');
    icon.classList.toggle('fa-arrow-right');
    icon.classList.toggle('fa-arrow-left');
});

// Right panel toggle
const open_right_panel_button = document.getElementById('div_open_right_panel_button');
const right_panel = document.getElementById('right-panel');
open_right_panel_button.addEventListener('click', () => {
    right_panel.classList.toggle('open');
    const icon = open_right_panel_button.querySelector('i');
    icon.classList.toggle('fa-arrow-right');
    icon.classList.toggle('fa-arrow-left');
});

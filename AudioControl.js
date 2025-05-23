let currentAudio = null;
//let isMuted = false;
let isMuted = JSON.parse(localStorage.getItem('audioMuted')) || false;
let isAutoLectorON = JSON.parse(localStorage.getItem('autoLector')) || false;

document.addEventListener('DOMContentLoaded', function() {
document.getElementById('autoLectorCheckbox').checked = isAutoLectorON;
});

const sceneAudioMap = {
    "Serwerownia": "serwerownia-audio",
    "Dziób": "dziob-audio",
    "Laboratorium Mokre": "lab-mokre-audio",
    "Maszynownia - Przedni Sektor": "maszynownia-przedni-sektor-audio",
    "Maszynownia - Silnik": "maszynownia-silnik-audio",
    "Mesa": "mesa-audio",
    "Mostek": "mostek-audio",
    "Mostek - Wejście": "mostek-wejscie-audio",
    "Pokój Załogi": "pokoj-zalogi-audio",
    "Rufa": "rufa-audio",
    "Salon - Rufa": "salon-rufa-audio"
};

function playAudio() {
    const sceneName = document.querySelector('.sceneName').textContent;
    const audioId = sceneAudioMap[sceneName];
    
    console.log(sceneName);
    if (!audioId) return;
    if ( JSON.parse(localStorage.getItem('audioMuted'))) return;

    const newAudio = document.getElementById(audioId);

    if (currentAudio === newAudio) {
        if (!currentAudio.paused) {
            currentAudio.pause();
        } else {
            currentAudio.play();
        }
        return;
    }

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = newAudio;
    currentAudio.muted = isMuted;
    currentAudio.play();

    currentAudio.onended = function () {
        currentAudio.currentTime = 0;
    };
}

function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('audioMuted', JSON.stringify(isMuted));
    
    Object.values(sceneAudioMap).forEach(audioId => {
        const audioElement = document.getElementById(audioId);
        if (audioElement) {
            audioElement.muted = isMuted;
        }
    });

    const volumeIcon = document.querySelector('.fa-solid.fa-volume-high, .fa-solid.fa-volume-xmark');
    if (volumeIcon) {
        volumeIcon.classList.toggle('fa-volume-high', !isMuted);
        volumeIcon.classList.toggle('fa-volume-xmark', isMuted);
    }
}

function toggleAutoLector(){
    isAutoLectorON = !isAutoLectorON;

    console.log('Auto-lector-toggled')
    localStorage.setItem('autoLector', JSON.stringify(isAutoLectorON));
}
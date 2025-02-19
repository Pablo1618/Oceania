let currentAudio = null;
let isMuted = false;

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
    //console.log(sceneName);

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    const audioId = sceneAudioMap[sceneName];
    //console.log(audioId);
    if (audioId) {
        currentAudio = document.getElementById(audioId);
        if (currentAudio) {
            currentAudio.muted = isMuted; 
            currentAudio.play().catch(error => console.log("Error playing audio:", error));
        }
    }
}

function toggleMute() {
    isMuted = !isMuted;
    
    Object.values(sceneAudioMap).forEach(audioId => {
        const audioElement = document.getElementById(audioId);
        if (audioElement) {
            audioElement.muted = isMuted;
        }
    });

    const volumeIcon = document.querySelector('.fa-solid.fa-volume-high, .fa-solid.fa-volume-off');
    if (volumeIcon) {
        volumeIcon.classList.toggle('fa-volume-high', !isMuted);
        volumeIcon.classList.toggle('fa-volume-off', isMuted);
    }
}





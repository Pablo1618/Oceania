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
    const audioId = sceneAudioMap[sceneName];

    if (!audioId) return;

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
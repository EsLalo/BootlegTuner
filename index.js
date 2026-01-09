const letters = ["E","F","F#","G","G#","A","A#","B","C","C#","D","D#"];


const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", async () => {
        console.log("User clicked Start. Initializing audio...");
        startSoundDection();
});

async function startSoundDection(){
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);

    //Gain boost
    const gainNode =audioCtx.createGain();
    gainNode.gain.value =3.0;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

    source.connect(gainNode);
    gainNode.connect(analyser);

    const buffer = new Float32Array(analyser.fftSize);

    let lastLongTime = 0;
    const LOG_INTERVAL =1000;

    function loop(){
        analyser.getFloatTimeDomainData(buffer);

        let sumSquares = 0;
        for(let i = 0; i< buffer.length; i++){
            sumSquares += buffer[i] * buffer[i];
        }
        const rms = Math.sqrt(sumSquares / buffer.length);

        const now = performance.now();
        if(now - lastLongTime > LOG_INTERVAL){
            console.log("RMS:", rms);
            lastLongTime = now;
        }

        if(rms > 0.005){
            document.getElementById("statusText").textContent = "Sound detected with RMS: " + rms.toFixed(4);
        } else {
            document.getElementById("statusText").textContent = "No significant sound detected.";
        }

        requestAnimationFrame(loop);
    }
    loop();
}
startSoundDection();
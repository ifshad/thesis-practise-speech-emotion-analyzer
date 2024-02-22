let recorder;
let audioChunks = [];
console.log(recorder);
console.log(audioChunks);

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        // console.log(stream);
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = e => {
            audioChunks.push(e.data);
            if (recorder.state == 'inactive') {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                sendAudioToServer(audioBlob);
            }
        }
    });

document.getElementById('startButton').addEventListener('click', () => {
    audioChunks = [];
    recorder.start();
    console.log('recording started');
});

document.getElementById('stopButton').addEventListener('click', () => {
    recorder.stop();
    console.log('recording stopped');
})

function sendAudioToServer(audioBlob) {
    const formData = new FormData();
    formData.append('audioFile', audioBlob);
    console.log(formData);

    fetch('/analyze', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => displayAnalysisResult(data))
        .catch(error => console.log(error))
}

function displayAnalysisResult(results) {
    const analysisResultDiv = document.getElementById('analysisResult');
    analysisResultDiv.innerHTML = `<p>Emotion: ${results.emotion}</p>`
}
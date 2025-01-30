export class AudioService {
    private speechSynth: SpeechSynthesisUtterance;
    
    constructor() {
        this.speechSynth = new SpeechSynthesisUtterance();
    }

    speak(text: string) {
        window.speechSynthesis.cancel();
        this.speechSynth.text = text;
        window.speechSynthesis.speak(this.speechSynth);
    }

    playSuccess() {
        const audio = new Audio('/success-sound.mp3');
        audio.play();
    }

    cleanup() {
        window.speechSynthesis.cancel();
    }
}
export class AudioService {
    private speechSynth: SpeechSynthesisUtterance;
    
    constructor() {
        // Check if window and speechSynthesis are available
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            this.speechSynth = new SpeechSynthesisUtterance();
        } else {
            // Handle case when speech synthesis is not available (e.g., during SSR)
            this.speechSynth = null as any;
        }
    }

    speak(text: string) {
        window.speechSynthesis.cancel();
        this.speechSynth.text = text;
        window.speechSynthesis.speak(this.speechSynth);
    }

    // playSuccess() {
    //     const audio = new Audio('/success-sound.mp3');
    //     audio.play();
    // }

    cleanup() {
        window.speechSynthesis.cancel();
    }
}
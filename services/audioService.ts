
class AudioService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createOscillator(freq: number, type: OscillatorType = 'sine', duration: number = 0.1, gainValue: number = 0.1, sweep: boolean = false) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    
    if (sweep) {
      // Create a characteristic 'pop' pitch sweep (downwards for more organic feel)
      osc.frequency.setValueAtTime(freq * 1.3, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + duration);
    } else {
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    }

    gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playPop(isLocking: boolean = true) {
    // Locking (high pitch, sharp pop), Unlocking (lower pitch, softer release)
    const baseFreq = isLocking ? 950 : 550;
    const duration = isLocking ? 0.07 : 0.12;
    const gain = isLocking ? 0.15 : 0.1;
    this.createOscillator(baseFreq, 'sine', duration, gain, true);
  }

  playShuffle() {
    // A sequence of rising frequencies (chime)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.createOscillator(note, 'triangle', 0.15, 0.04);
      }, i * 40);
    });
  }

  playMagicWhoosh() {
    this.init();
    if (!this.ctx) return;

    const duration = 0.4;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);

    // Follow up with chime
    setTimeout(() => this.playShuffle(), 100);
  }

  playClick() {
    // A tight, short tap sound
    this.createOscillator(200, 'square', 0.04, 0.03);
  }
}

export const audioService = new AudioService();

import { isPlatformBrowser } from '@angular/common';
//import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-player',
  standalone: true,
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  audioFile: string = '/assets/teleport.mp3';

  files = [
    '/assets/letilasoya/t1.mp3',
    '/assets/letilasoya/t2.mp3',
    '/assets/letilasoya/t3.mp3',
  ];

  audioContext: AudioContext | undefined;
  sources: AudioBufferSourceNode[] = [];
  track: MediaElementAudioSourceNode | undefined;
  gainNode!: GainNode | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: NonNullable<unknown> // public http: HttpClient
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const AudioContext = window.AudioContext;
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
    }
  }

  async mergeBuffers() {
    const tracks: AudioBuffer[] = [];

    for await (const url of this.files) {
      const buffer = await this.loadAudioFile(url);
      if (buffer) {
        tracks.push(buffer);
      }
    }

    console.log(tracks);
    const firstTrack = tracks[0];
    const duration =
      firstTrack && firstTrack.duration ? firstTrack.duration : 0;
    const rate =
      firstTrack && firstTrack.sampleRate ? firstTrack.sampleRate : 0;
    const numberOfChannels = this.files.length;
    const frameCount = rate * duration;

    if (!this.audioContext) return;

    const newBuffer: AudioBuffer = this.audioContext.createBuffer(
      numberOfChannels,
      frameCount,
      rate
    );

    for (let channel = 0; channel < numberOfChannels; channel++) {
      const nowBuffering = newBuffer.getChannelData(channel);
      const srcBuffer = tracks[channel].getChannelData(0);
      // console.log(channel, ' < < < ', srcBuffer);
      for (let i = 0; i < frameCount; i++) {
        nowBuffering[i] = srcBuffer[i];
        // console.log(srcBuffer[i])
      }
    }
    console.log(newBuffer);
    return newBuffer;
  }

  async launchAudio() {
    const buffer = await this.mergeBuffers();
    console.log(buffer);
    if (buffer) {
      this.playAudio(buffer);
    }

    // this.files.forEach((url) => {
    //   this.loadAudioFile(url)
    //     .then((buffer) => {
    //       if (buffer) this.playAudio(buffer);
    //     })
    //     .catch((error) => {
    //       console.error('Error loading audio:', error);
    //     });
    // });
  }

  playAudio(buffer: AudioBuffer) {
    if (this.audioContext && buffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      this.sources.push(source);
      if (this.gainNode) {
        source.connect(this.gainNode).connect(this.audioContext.destination);
      }
      source.start(5);
    }
  }

  async loadAudioFile(url: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    // console.log(buffer);
    if (this.audioContext === undefined) return;
    return this.audioContext.decodeAudioData(buffer);
  }

  changeGain(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const newValue = Number.parseFloat(input.value);
    if (this.gainNode !== undefined) {
      this.gainNode.gain.value = newValue;
    }
  }

  play() {
    this.launchAudio();
    this.mergeBuffers();
  }

  pause() {
    this.sources.forEach((src) => src.stop());
  }
}

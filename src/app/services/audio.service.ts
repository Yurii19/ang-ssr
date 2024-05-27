import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  audioContext: AudioContext | undefined;
  audio: HTMLAudioElement | undefined;

  audioElements: HTMLAudioElement[] = [];

  audioSources: MediaElementAudioSourceNode[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: NonNullable<unknown>) {
    if (isPlatformBrowser(this.platformId)) {
      const AudioContext = window.AudioContext;
      this.audioContext = new AudioContext();
    }
  }


   async mergeBuffers(urls: string[]) {
    const tracks: AudioBuffer[] = [];

    for await (const url of urls) {
      const buffer = await this.loadAudioFile(url);
      if (buffer) {
        tracks.push(buffer);
      }
    }

    const firstTrack = tracks[0];
    const duration =
      firstTrack && firstTrack.duration ? firstTrack.duration : 0;
    const rate =
      firstTrack && firstTrack.sampleRate ? firstTrack.sampleRate : 0;
    const numberOfChannels = urls.length;
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
      for (let i = 0; i < frameCount; i++) {
        nowBuffering[i] = srcBuffer[i];
      }
    }
    return newBuffer;
  }

  async loadAudioFile(url: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    if (this.audioContext === undefined) return;
    return this.audioContext.decodeAudioData(buffer);
  }



// services for handle html Audio approach
  startAudioFromUrls(audioUrls: string[]) {
    this.audioElements = audioUrls.map((url) => {
      const audio = new Audio(url);
      audio.crossOrigin = 'anonymous';
      return audio;
    });

    const size = this.audioElements.length;

    this.audioSources = this.audioElements.map((el) =>
      this.audioContext!.createMediaElementSource(el)
    );

    if (this.audioContext) {
      const merger = this.audioContext.createChannelMerger(size);
      this.audioSources.forEach((el) => {
        el.connect(merger, 0, 0);
        el.connect(merger, 0, 1);
      });
      merger.connect(this.audioContext.destination);
    }

    this.play();
  }

  play() {
    this.audioElements.forEach((el) => {
      el.play();
    });
  }
}

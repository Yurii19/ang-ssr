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

  startAudioFromUrls(audioUrls: string[]) {
    this.audioElements = audioUrls.map((url) => new Audio(url));

    this.audioSources = this.audioElements.map((el) =>
      this.audioContext!.createMediaElementSource(el)
    );

    this.audioElements.forEach((el) => {
      el.play();
    });
  }

  playFrom(url: string) {
    const audioElement = new Audio(url);
    console.log(audioElement);
  }

  play() {
    if (this.audio !== undefined) {
      this.audio.play();
    }
  }
}

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

    // const merger = this.audioContext?.createChannelMerger(size);

    //  if (this.audioContext) {
    // this.audioSources.forEach((el) =>
    //   el.connect(this.audioContext!.destination)
    // );

    // }

    this.play();
  }

  // playFrom(url: string) {
  //   const audioElement = new Audio(url);
  //   audioElement.crossOrigin = 'anonymous';
  //   const src = this.audioContext?.createMediaElementSource(audioElement);
  //   src?.connect(this.audioContext!.destination);
  //   audioElement.play();
  //   console.log(audioElement);
  // }

  play() {
    this.audioElements.forEach((el) => {
      el.play();
    });
  }
}

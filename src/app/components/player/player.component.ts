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
  audioElement: HTMLAudioElement | undefined;
  audioElement1: HTMLAudioElement | undefined;
  audioElement2: HTMLAudioElement | undefined;

  audioContext: AudioContext | undefined;
  source!: NonNullable<unknown>;
  track: MediaElementAudioSourceNode | undefined;
  gainNode!: GainNode | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: NonNullable<unknown>,
   // public http: HttpClient
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const AudioContext = window.AudioContext;
      this.audioContext = new AudioContext();
      this.audioElement = new Audio(this.audioFile);
      this.track = this.audioContext.createMediaElementSource(
        this.audioElement
      );
      // track.connect(this.audioContext.destination);

      this.gainNode = this.audioContext.createGain();
      this.track.connect(this.gainNode).connect(this.audioContext.destination);
      // gainNode.gain.value = 3;
      // console.log();
      //audioElement.play()
      // track.play()
    }

    //const file = this.http.get(this.files[0]).subscribe((d: any) => console.log(d))
    //const localBuffer = this.files[0].arrayBuffer()
    // fetch(this.files[0]).then(r => console.log(r))
  }

  // playAudio(buffer: any){

  // }

  changeGain(ev: Event) {
    // console.log(ev.target.value);
    const input = ev.target as HTMLInputElement;
    const newValue = Number.parseFloat(input.value);
    if (this.gainNode !== undefined) {
      this.gainNode.gain.value = newValue;
    }
  }

  play() {
    if (typeof this.audioElement !== 'undefined') {
      this.audioElement.play();
    }
    console.log(this.audioContext);
  }
  pause() {
    if (typeof this.audioElement !== 'undefined') {
      this.audioElement.pause();
    }
  }
}

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
  sources:AudioBufferSourceNode[] = [];
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

  launchAudio() {
    this.files.forEach(url =>{
      this.loadAudioFile(url)
      .then((buffer) => {
        if(buffer)
        this.playAudio(buffer);
      })
      .catch((error) => {
        console.error('Error loading audio:', error);
      });

    })
   
  }

  playAudio(buffer: AudioBuffer) {
    if (this.audioContext && buffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      this.sources.push(source)
      if(this.gainNode){
        source.connect(this.gainNode).connect(this.audioContext.destination);
        
      }
      source.start(0);
    }
  }

  loadAudioFile(url: string) {
    return fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        if (this.audioContext === undefined) return;
        return this.audioContext.decodeAudioData(buffer);
      });
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
  }

  pause() {
    this.sources.forEach(src => src.stop())
  }
}

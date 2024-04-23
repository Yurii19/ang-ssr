import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  trackUrl: string = '/assets/teleport.mp3';
  // aContext : any = null;
  audioElement: HTMLAudioElement | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: NonNullable<unknown>) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const AudioContext = window.AudioContext;
      const audioContext = new AudioContext();
      this.audioElement = new Audio(this.trackUrl);
      const track = audioContext.createMediaElementSource(this.audioElement);
      track.connect(audioContext.destination);
      //audioElement.play()
      // track.play()
    }
  }

  play() {
    if (typeof(this.audioElement) !== 'undefined') {
      this.audioElement.play();
    }
  }
  pause() {
    if (typeof(this.audioElement) !== 'undefined') {
      this.audioElement.pause();
    }
  }
}

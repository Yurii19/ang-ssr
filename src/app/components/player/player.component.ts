import { CommonModule, isPlatformBrowser } from '@angular/common';
//import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChannelComponent } from './channel/channel.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [ChannelComponent, CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  audioFile: string = '/assets/teleport.mp3';

  files = [
    '/assets/letilasoya/t1.mp3',
    '/assets/letilasoya/t2.mp3',
    '/assets/letilasoya/t3.mp3'
  ];

  audioContext: AudioContext | undefined;
  // sources: AudioBufferSourceNode[] = [];
  track: AudioBufferSourceNode | undefined;
  gainNode!: GainNode | undefined;

  gainNodes: GainNode[] = [];

  currentTime = 0;
  startTime = 0;

  // startedTime = 0;

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

  mute(channel: number) {
    const theNode = this.gainNodes[channel];
    theNode.gain.value = theNode.gain.value > 0 ? 0 : 1;
    // console.log(this.gainNodes);
    // console.log(theNode);
  }

  async launchAudio() {
    const buffer = await this.mergeBuffers();
    if (buffer) {
      this.playAudio(buffer);
    }
  }

  playAudio(buffer: AudioBuffer) {
    if (this.audioContext && buffer) {
      const numberOfChannels = this.files.length;

      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;

      const splitter =
        this.audioContext.createChannelSplitter(numberOfChannels);
      for (let i = 0; i < numberOfChannels; i++) {
        const node = this.audioContext.createGain();
        this.gainNodes.push(node);
      }
      const merger = this.audioContext.createChannelMerger(numberOfChannels);
      source.connect(splitter);
      for (let i = 0; i < numberOfChannels; i++) {
        splitter.connect(this.gainNodes[i], i);
      }

      for (let i = 0; i < numberOfChannels; i++) {
        this.gainNodes[i].connect(merger, 0, i);
      }

      merger.connect(this.audioContext.destination);

       this.track = source;
      // if (this.gainNode) {
      //   source.connect(this.gainNode).connect(this.audioContext.destination);
      // }
      source.start();
      this.startTime = Date.now();
    }
  }

  private async mergeBuffers() {
    const tracks: AudioBuffer[] = [];

    for await (const url of this.files) {
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
     // console.log(srcBuffer)
      for (let i = 0; i < frameCount; i++) {
        nowBuffering[i] = srcBuffer[i];
      }
    }
    console.log(newBuffer)
    return newBuffer;
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
    this.gainNodes = [];
    this.launchAudio();
  }

  pause() {
    this.track?.stop();
  }

  changeChannelGain(event: { channelId: number; volume: number }) {
    const theNode = this.gainNodes[event.channelId];
    theNode.gain.value = event.volume;
    console.log(theNode);
  }
}

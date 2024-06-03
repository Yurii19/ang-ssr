import { CommonModule, isPlatformBrowser } from '@angular/common';
//import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChannelComponent } from './channel/channel.component';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [ChannelComponent, CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  files = [
    'https://cdn.jsdelivr.net/gh/Yurii19/static@master/t1.mp3',
    'https://cdn.jsdelivr.net/gh/Yurii19/static@master/t2.mp3',
    'https://cdn.jsdelivr.net/gh/Yurii19/static@master/t3.mp3',
  ];

  audioContext: AudioContext | undefined;
  track: AudioBufferSourceNode | undefined;

  gainNodes: GainNode[] = [];
  visualNodes: Float32Array[] = [new Float32Array()];

  currentTime = 0;
  startTime = 0;

  isLoading = false;

  // startedTime = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: NonNullable<unknown>, // public http: HttpClient
    private audioService: AudioService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const AudioContext = window.AudioContext;
      this.audioContext = new AudioContext();
    }
  }

  play2() {
    this.audioService.startAudioFromUrls(this.files);
  }

  mute(channel: number) {
    const theNode = this.gainNodes[channel];
    theNode.gain.value = theNode.gain.value > 0 ? 0 : 1;
  }

  async launchAudio() {
    this.isLoading = true;
    const buffer = await this.audioService.mergeBuffers(this.files);
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

      this.gainNodes = Array.from(Array(numberOfChannels).keys()).map(() =>
        this.audioContext!.createGain()
      );

      this.visualNodes = Array.from(Array(numberOfChannels).keys()).map((i) =>
        // this.audioContext!.createGain()
        buffer.getChannelData(i)
      );

      const merger = this.audioContext.createChannelMerger(numberOfChannels);
      source.connect(splitter);
      this.gainNodes.forEach((node, i) => splitter.connect(node, i));

      for (let i = 0; i < numberOfChannels; i++) {
        this.gainNodes[i].connect(merger, 0, 0);
        this.gainNodes[i].connect(merger, 0, 1);
      }
      merger.connect(this.audioContext.destination);
      this.track = source;
      source.start();
      this.isLoading = false;
      this.startTime = Date.now();
    }
  }

  changeGain(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const newValue = Number.parseFloat(input.value);
    console.log(newValue);
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
  }
}

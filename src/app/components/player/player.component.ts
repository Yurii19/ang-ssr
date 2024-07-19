import { CommonModule, isPlatformBrowser } from '@angular/common';
//import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ChannelComponent } from './channel/channel.component';
import { AudioService } from '../../services/audio.service';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-player',
  standalone: true,
  imports: [ChannelComponent, CommonModule, MatButtonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit, OnDestroy {
  files = [
    'https://cdn.jsdelivr.net/gh/Yurii19/static@master/Letila_Soya/t1.mp3',
    'https://cdn.jsdelivr.net/gh/Yurii19/static@master/Letila_Soya/t2.mp3',
    'https://cdn.jsdelivr.net/gh/Yurii19/static@master/Letila_Soya/t3.mp3',
  ];

  audioContext: AudioContext | undefined;
  track: AudioBufferSourceNode | undefined;

  gainNodes: GainNode[] = [];
  generalGainNode: GainNode = {} as GainNode;
  visualNodes: Float32Array[] = [new Float32Array()];
  trackTimeLenght: number = 0;

  currentTime = 0;

  startTime = 0;

  pointerPosition = 0;

  isLoading = false;
  tracksReady = 0;
  // startedTime = 0;
  playProgress: ReturnType<typeof setInterval> | undefined;

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

  // play2() {
  //   this.audioService.startAudioFromUrls(this.files);
  // }

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
    this.trackTimeLenght = buffer.duration;
    if (this.audioContext && buffer) {
      const numberOfChannels = this.files.length;

      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;

      const splitter =
        this.audioContext.createChannelSplitter(numberOfChannels);

      this.gainNodes = Array.from(Array(numberOfChannels).keys()).map(() =>
        this.audioContext!.createGain()
      );

      this.visualNodes = Array.from(Array(numberOfChannels).keys()).map((i) => {
        return buffer.getChannelData(i);
      });

      const merger = this.audioContext.createChannelMerger(numberOfChannels);
      source.connect(splitter);
      this.gainNodes.forEach((node, i) => splitter.connect(node, i));

      for (let i = 0; i < numberOfChannels; i++) {
        this.gainNodes[i].connect(merger, 0, 0);
        this.gainNodes[i].connect(merger, 0, 1);
      }
      this.generalGainNode = this.audioContext.createGain();
      merger.connect(this.generalGainNode);
      this.generalGainNode.connect(this.audioContext.destination);
      this.track = source;
      this.isLoading = false;
      this.startTime = Date.now();
    }
  }

  onChannelReady() {
    this.tracksReady = this.tracksReady + 1;
    if (this.tracksReady === this.files.length) {
      this.track?.start();
      this.drawPointer();
    }
  }

  private drawPointer() {
    this.playProgress = setInterval(() => {
      if (this.pointerPosition < this.trackTimeLenght * 10) {
        this.pointerPosition = this.pointerPosition + 1;
      }
    }, 100);
  }

  changeGain(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const newValue = Number.parseFloat(input.value);
    this.generalGainNode.gain.value = newValue;
  }

  play() {
    this.gainNodes = [];
    this.pointerPosition = 0;
    this.launchAudio();
  }

  stop() {
    this.track?.stop();
    clearInterval(this.playProgress);
    this.tracksReady = 0;
    // console.log(this.playProgress)
  }

  changeChannelGain(event: { channelId: number; volume: number }) {
    const theNode = this.gainNodes[event.channelId];
    theNode.gain.value = event.volume;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}

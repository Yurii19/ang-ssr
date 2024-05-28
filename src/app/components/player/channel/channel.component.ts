import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
//import { EventEmitter } from 'stream';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent implements AfterViewInit {
  @Input() soundLevel: number = 10;

  @Input() name: number = 0;

  @Output() muteChannel = new EventEmitter<number>();
  @Output() gainChannel = new EventEmitter<{
    channelId: number;
    volume: number;
  }>();

  @ViewChild('visualizer')
  private myCanvas: ElementRef = {} as ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    const canvasContext = this.myCanvas.nativeElement.getContext('2d');
    const canvas = this.myCanvas.nativeElement;

    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = 'lime';
    canvasContext.beginPath();
    canvasContext.moveTo(0, canvas.height / 2);
    canvasContext.lineTo(300, 150);
    canvasContext.stroke();
  }

  mute(event: number) {
    this.muteChannel.emit(event);
  }

  changeGain(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const newValue = Number.parseFloat(input.value);
    this.gainChannel.emit({ channelId: this.name, volume: newValue });
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
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
export class ChannelComponent implements AfterViewInit, OnInit {
  @Input() duration: number = 0;
  @Input() name: number = 0;
  @Input() graph: Float32Array = new Float32Array();

  @Output() muteChannel = new EventEmitter<number>();
  @Output() inited = new EventEmitter();
  @Output() gainChannel = new EventEmitter<{
    channelId: number;
    volume: number;
  }>();

  @ViewChild('visualizer')
  private myCanvas: ElementRef = {} as ElementRef;
  soundLevel = 10;

  constructor() {}

  ngOnInit(): void {
    this.inited.emit();
  }


  ngAfterViewInit(): void {
    
    // console.log(this.graph)
    const canvasContext = this.myCanvas.nativeElement.getContext('2d');
    const canvas = this.myCanvas.nativeElement;
    canvas.width = this.duration * 10;

    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.lineWidth = 1;
    canvasContext.strokeStyle = 'lime';
    const mid = canvas.height / 2;


    const step = Math.round(this.graph.length / canvas.width);
    console.log(step)
    let j = 0;
    this.graph.forEach((el, i) => {
      if (i % step === 0) {
        j++;
        const n = el * 100;
        canvasContext.beginPath();
        canvasContext.moveTo(j, mid);
        canvasContext.lineTo(j, mid + n);
        canvasContext.moveTo(j, mid);
        canvasContext.lineTo(j, mid - n);
        canvasContext.stroke();
      }
    });

    // for(let i = 0; i < this.graph.length; i++){
    //   const  n = this.graph[i];
    //   canvasContext.moveTo(i, mid);
    //   canvasContext.lineTo(i, mid + n * 100);
    //   canvasContext.stroke();
    // }
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

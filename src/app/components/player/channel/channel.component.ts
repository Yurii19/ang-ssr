import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
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
export class ChannelComponent {
  @Input() soundLevel: number = 10;

  @Input() name: number = 0;

  @Output() muteChannel = new EventEmitter<number>();
  @Output() gainChannel = new EventEmitter<{
    channelId: number;
    volume: number;
  }>();

  mute(event: number) {
    this.muteChannel.emit(event);
  }

  changeGain(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const newValue = Number.parseFloat(input.value);
    this.gainChannel.emit({ channelId: this.name, volume: newValue });
  }
}

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
  @Input() soundLevel: number = 0;

  @Input() name: number = 0;

  @Output() muteChannel = new EventEmitter<number>();

  mute(event: number) {
    this.muteChannel.emit(event);
  }
}

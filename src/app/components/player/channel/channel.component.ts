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

  @Input() name: string = '';

  @Output() muteChannel = new EventEmitter<string>();

  mute(event: string) {
    this.muteChannel.emit(event);
  }
}

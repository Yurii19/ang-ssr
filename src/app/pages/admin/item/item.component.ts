import { Component, Input, OnInit } from '@angular/core';
//import { MatIconModule } from '@angular/material/icon';
import { RepoFile } from '../../../core/types';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent implements OnInit {
  @Input() item: RepoFile = { } as RepoFile;

  ngOnInit(): void {
    return;
  }
}

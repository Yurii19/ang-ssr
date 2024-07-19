import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatCardModule } from '@angular/material/card';
import { RepoFile } from '../../core/types';
import { RepoItemComponent } from './repo-item/repo-item.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RepoItemComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    AddItemDialogComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  data: RepoFile[] = [{} as RepoFile];

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.admin.getRepo().then((r) => {
     // console.log(r)
      this.data = r.data as RepoFile[];
    });
  }

  createNewFolder() {
  //  this.admin.creageFolder(this.)
  }
}

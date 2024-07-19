import { Component, Input } from '@angular/core';
import { RepoFile } from '../../../core/types';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ItemComponent } from '../item/item.component';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-repo-item',
  standalone: true,
  imports: [MatIconModule, MatCardModule, ItemComponent, MatButtonModule],
  templateUrl: './repo-item.component.html',
  styleUrl: './repo-item.component.scss',
})
export class RepoItemComponent {
  @Input() folder: RepoFile = {} as RepoFile;

  files: RepoFile[] = [];
  showFiles = false;

  isLoading = false;

  constructor(private admin: AdminService) {}

  showContent() {
    if (!this.files.length) {
      this.isLoading = true;
      this.admin.getFolder(this.folder.path).then((r) => {
        this.files = r.data as RepoFile[];
        this.isLoading = false;
        this.showFiles = true;
      });
    } else {
      this.showFiles = !this.showFiles;
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminService } from '../../../services/admin.service';
import { RepoFile } from '../../../core/types';

export interface DialogData {
  title: string;
  name: string;
}

@Component({
  selector: 'app-add-item-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './add-item-dialog.component.html',
  styleUrl: './add-item-dialog.component.scss',
})
export class AddItemDialogComponent {
  constructor(public dialog: MatDialog, private admin: AdminService) {}
  readonly name = '';
  @Input() folders: RepoFile[] = [];

  openDialog() {
    const dialogRef = this.dialog.open(DialogModalComponent, {
      data: { title: 'Add a new folder', name: this.name },
    });

    dialogRef.afterClosed().subscribe((d) => {
      const match = this.folders.filter((el: RepoFile) => el.name === d);
      if (match.length) {
        alert('The folder already exist !');
      }
      if (d === '') {
        return;
      }
      this.admin.createFolder(d).then((d) => console.log(d));
    });
  }
}

@Component({
  selector: 'app-dialog-modal',
  templateUrl: 'dialog-modal.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  addNewFolder() {
    this.dialogRef.close();
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  text1 = 'No data';
  isError = false;
  constructor(private apis: ApiService) {}
  ngOnInit(): void {
    this.apis.getNews().subscribe((d) => {
      this.text1 = d.data;
      this.isError = d.error;
    });
    //  this.apis.getExpeditions().subscribe((d) => console.log(d));
  }
}

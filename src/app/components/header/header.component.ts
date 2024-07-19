import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { filter, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    MatMenuModule,
    MatListModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  routs = ['home', 'player', 'admin'];
  currentRoute = '/home';

  private routeSub$: Subscription = Subscription.EMPTY;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routeSub$ = this.router.events
      .pipe(filter((ev) => ev instanceof NavigationEnd))
      .subscribe((ev) => {
        if (ev instanceof NavigationEnd) {
          this.currentRoute = ev.url;
        }
      });
  }
  ngOnDestroy() {
    if (this.routeSub$) {
      this.routeSub$.unsubscribe();
    }
  }
}

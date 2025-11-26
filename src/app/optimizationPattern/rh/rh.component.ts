import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { User, UsersService } from '../users.service';
import * as ChartJs from 'chart.js/auto';
@Component({
  standalone: false,
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RhComponent implements OnInit {
  oddUsers: User[];
  evenUsers: User[];
  chart: any;
  constructor(
    private userService: UsersService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {
    this.oddUsers = this.userService.getOddOrEven(true);
    this.evenUsers = this.userService.getOddOrEven();
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => this.createChart());
  }
  addUser(list: User[], newUser: string) {
    if (list === this.oddUsers) {
      this.oddUsers = this.userService.addUser(this.oddUsers, newUser);
    } else if (list === this.evenUsers) {
      this.evenUsers = this.userService.addUser(this.evenUsers, newUser);
    }
    this.cdr.markForCheck();
  }
  createChart() {
    const data = [
      { users: 'Workers', count: this.oddUsers.length },
      { users: 'Boss', count: this.evenUsers.length },
    ];
    this.chart = new ChartJs.Chart('MyChart', {
      type: 'bar',
      data: {
        labels: data.map((row) => row.users),
        datasets: [
          {
            label: 'Entreprise stats',
            data: data.map((row) => row.count),
          },
        ],
      },
    });
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BacktracingResult} from '../../../models/backtracing.model';

@Component({
  selector: 'app-backtracing-view',
  templateUrl: './backtracing-view.component.html',
  styleUrls: ['./backtracing-view.component.scss']
})
export class BacktracingViewComponent implements OnInit, OnDestroy {

  public mailAddress = '';
  public isLoading = false;
  public backtracingResult: BacktracingResult = null;
  public displayedColumns = ['date', 'email', 'area'];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private api: ApiService,
  ) { }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }

  ngOnInit(): void {
  }

  async lookup() {
    if (this.mailAddress === '') {
      return;
    }
    if (this.mailAddress.indexOf('@') === -1) {
      this.mailAddress = this.mailAddress + '@cronos.de';
    }
    console.log('Lookup for %s', this.mailAddress);
    this.isLoading = true;
    this.api.get(`/admin/users/${this.mailAddress}/covid-backtracing`)
      .pipe(takeUntil(this.unsubscribe$)).subscribe((next: BacktracingResult) => {
        this.backtracingResult = next;
        this.isLoading = false;
    }, err => {
      console.error(err);
      this.isLoading = false;
    });

  }
}

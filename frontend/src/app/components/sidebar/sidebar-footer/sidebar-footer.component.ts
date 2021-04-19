import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-sidebar-footer',
  templateUrl: './sidebar-footer.component.html',
  styleUrls: ['./sidebar-footer.component.scss']
})
export class SidebarFooterComponent implements OnInit, OnDestroy {

  public versionString: string;
  public isAuthed: boolean;
  private unsubscribe$: Subject<void>;

  constructor(
    private authService: AuthService,
  ) {
    this.unsubscribe$ = new Subject<void>();
    this.versionString = 'v' + environment.appVersion;
  }

  ngOnInit(): void {
    this.isAuthed = this.authService.authStateSnapshot;
    this.authService
      .authState$
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(next => this.isAuthed = next);
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public async signout(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.authService.logout();
      resolve();
    });
  }
}

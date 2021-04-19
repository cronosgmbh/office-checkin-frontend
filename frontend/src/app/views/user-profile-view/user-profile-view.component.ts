import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatProgressButtonOptions} from 'mat-progress-buttons';
import {AuthService} from '../../services/auth.service';
import {DialogHelperService} from '../../services/dialog-helper.service';
import {TranslateService} from '@ngx-translate/core';
import {take, takeUntil} from 'rxjs/operators';
import {fadeInAnimation} from 'src/app/animations/fade-in.animation';
import {UserService} from '../../services/user.service';
import {Navigation, NavigationService} from 'src/app/services/navigation.service';

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.scss'],
  animations: [fadeInAnimation],
})
export class UserProfileViewComponent implements OnInit, OnDestroy {

  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  private unsubscribe$ = new Subject<void>();
  public Navigation = Navigation;

  public userProfileForm: FormGroup;
  public readonly saveBtnOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Save changes',
    spinnerSize: 19,
    fullWidth: true,
    raised: true,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    mode: 'indeterminate',
    type: 'submit',
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private dialogHelper: DialogHelperService,
    private translateService: TranslateService,
    private navigationService: NavigationService,
  ) {
    this.translateService.stream('COMMON.BUTTONS.SAVE_CHANGES')
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe(text => {
      this.saveBtnOptions.text = text;
    });
  }

  async ngOnInit(): Promise<void> {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
      this.userProfileForm.setValue({
        first_name: user.first_name,
        last_name: user.last_name
      });
      console.log(user);
    }, error => {
      console.log(error);
    });

    this.userProfileForm = this.formBuilder.group({
      first_name: ['', [
        Validators.pattern(/^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=,()\[\]]{1,20}$/i),
      ]],
      last_name: ['', [
        Validators.pattern(/^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=,()\[\]]{1,20}$/i),
      ]],
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get form() {
    return this.userProfileForm.controls;
  }

  public fieldIsInvalid(fieldname: string) {
    return this.form[fieldname].invalid && (this.form[fieldname].touched || this.form[fieldname].dirty);
  }

  public async save() {
    if (this.userProfileForm.invalid) {
      return;
    }

    this.saveBtnOptions.active = true;

    try {
      await this.userService.updateCurrentUser(this.userProfileForm.value).toPromise();
      this.dialogHelper.showSuccessDialog({
        title: 'USER_PROFILE.DIALOGS.SUCCESS.TITLE',
        message: 'USER_PROFILE.DIALOGS.SUCCESS.MESSAGE',
      });

    } catch (error) {
      console.error(error);

      const dialogRef = this.dialogHelper.showErrorDialog({
        title: 'USER_PROFILE.DIALOGS.ERROR.MESSAGE',
        message: 'USER_PROFILE.DIALOGS.ERROR.TITLE',
      });
    } finally {
      this.saveBtnOptions.active = false;
    }
  }
}

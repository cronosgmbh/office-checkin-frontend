import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {from, Observable, ReplaySubject} from 'rxjs';
import {Router} from '@angular/router';
import {auth as firebaseAuth, User} from 'firebase/app';
import {AngularFirestore} from '@angular/fire/firestore';
import {AppUser} from '../models/user.model';
import {UserService} from './user.service';
import * as firebase from 'firebase';
import {ApiService} from './api.service';
import {DialogHelperService} from './dialog-helper.service';

export class UserNotVerifiedError extends Error {
  constructor(public credential: firebaseAuth.UserCredential) {
    super();
    Object.setPrototypeOf(this, UserNotVerifiedError.prototype);
  }
}

export class UserNotAuthenticatedError extends Error {
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private stateSubject: ReplaySubject<boolean>;

  public firebaseUser: User;
  private appUser: AppUser;

  public authState$: Observable<boolean>;
  public authStateSnapshot: boolean;

  public isAdmin = false;

  constructor(
    private auth: AngularFireAuth,
    private database: AngularFirestore,
    private router: Router,
    private api: ApiService,
    private dialogHelper: DialogHelperService,
    private userService: UserService) {
    this.stateSubject = new ReplaySubject<boolean>(1);
    this.authState$ = this.stateSubject.asObservable();
    this.auth.authState.subscribe(async next => {
      // should come first
      const newAuthState = next ? !next.isAnonymous && next.emailVerified : false;
      this.authStateSnapshot = newAuthState;
      this.stateSubject.next(newAuthState);
      if (newAuthState) {
        this.api.post('/users/is-admin').toPromise().then(result => {
          this.isAdmin = true;
        }).catch(err => {
          this.isAdmin = false;
        });
        this.api.get('/user').subscribe(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }, err => {
          if (err.code === 404) {
            console.log('user has no doucment. going to invite user to add user data now!');
            this.dialogHelper.showInfoDialog({
              title: 'Profil vervollständigen',
              message: 'Dein Profil muss vervollständigt werden, damit du den cronos Office Check-In vollständig nutzen kannst.',
              icon: 'account-alert'
            }).afterClosed().subscribe(_ => {
              this.router.navigateByUrl('/app/profile');
            });
          } else {
            console.error(err);
          }
        });
      }

      if (next) {
        this.firebaseUser = next;
        if (!next.isAnonymous && next.emailVerified) {
          this.appUser = await this.userService.getUser(this.firebaseUser);
          if (!this.appUser.email) {
            this.userService.updateUser(this.firebaseUser, {email: this.firebaseUser.email});
          }
        }
      } else {
        this.appUser = null;
      }
    });
  }

  public async getAuthenticatedUser(firebaseUser?: User): Promise<AppUser> {
    if (!(await this.isAuthenticated())) {
      throw new Error('No authenticated user found.');
    }

    const fireUser = firebaseUser || this.firebaseUser;
    if (!fireUser) {
      throw new Error('No firebase user given.');
    }

    // if (!this.appUser) {
    this.appUser = await this.userService.getUser(fireUser);
    // }

    return this.appUser;
  }

  public getAuthenticatedUserAsObservable(firebaseUser?: User): Observable<AppUser> {
    return from(this.getAuthenticatedUser(firebaseUser));
  }

  public async login(email: string, password: string): Promise<firebaseAuth.UserCredential> {
    const credential: firebaseAuth.UserCredential = await this.auth.signInWithEmailAndPassword(email, password);

    if (!credential?.user?.emailVerified) {
      throw new UserNotVerifiedError(credential);
    }

    const isAuthed = credential.user.emailVerified && !credential.user.isAnonymous;
    this.authStateSnapshot = isAuthed;


    // ensure the user object exists
    if (isAuthed) {
      const tResult = await this.database.firestore.runTransaction((t) => {
        return new Promise(async (resolve, reject) => {
          const userRef = this.database.firestore.doc(`users/${credential.user.uid}`);
          try {
            const userSnapshot = await userRef.get();
            if (!userSnapshot.exists) {
              const createUserFallback = await userRef.set({
                email: credential.user.email
              });
            }
            resolve();
          } catch (e) {
            console.log('ERROR CREATING FALLBACK USER', e);
            reject(e);
          }
        });
      });
    }

    this.stateSubject.next(isAuthed);

    return credential;
  }

  public async logout(): Promise<void> {
    return await this.auth.signOut();
  }

  public async signup(options: {
    email: string, password: string, teamname?: string, teamrole?: string
  }): Promise<firebaseAuth.UserCredential> {
    if (!options.email.endsWith('@cronos.de')) {
      return null;
    }
    const {email, password, teamname, teamrole} = options;

    const credential: firebaseAuth.UserCredential = await this.auth.createUserWithEmailAndPassword(email, password);

    const result = await firebase.functions().httpsCallable('register')({teamname, teamrole});
    if (!result.data.success) {
      return null;
    }

    await this.sendAccountVerificationEmail(credential.user);

    return credential;
  }

  public async sendAccountVerificationEmail(user: User): Promise<void> {
    return user.sendEmailVerification();
  }

  public async passwordReset(email: string): Promise<void> {
    return this.auth.sendPasswordResetEmail(email);
  }

  public async isAuthenticated(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const stateSub = this.stateSubject.subscribe(next => {
        window.setTimeout(() => {
          if (!this) {
            reject();
          }
          stateSub.unsubscribe();
          resolve(next);
        }, 0);
      });
    });
  }
}

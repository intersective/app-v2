import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable, concat } from 'rxjs';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NotificationService } from '@shared/notification/notification.service';
import { UtilsService } from '@services/utils.service';
import { NewRelicService } from '@shared/new-relic/new-relic.service';
import { SwitcherService } from '../../switcher/switcher.service';
import { PusherService } from '@shared/pusher/pusher.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-auth-login',
  templateUrl: 'auth-login.component.html',
  styleUrls: ['auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  isLoggingIn = false;
  showPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private utils: UtilsService,
    private newRelic: NewRelicService,
    private switcherService: SwitcherService,
    private pusherService: PusherService,
  ) {}

  ngOnInit() {
    this.newRelic.setPageViewName('login');
  }

  login() {
    if (this.utils.isEmpty(this.loginForm.value.username) || this.utils.isEmpty(this.loginForm.value.password)) {
      this.notificationService.alert({
        message: 'Your username or password is empty, please fill them in.',
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              this.isLoggingIn = false;
              return;
            }
          }
        ]
      });
      return;
    }
    this.isLoggingIn = true;

    const nrLoginTracer = this.newRelic.createTracer('login request started', (message) => {
      this.newRelic.setCustomAttribute('login status', message);
    });
    return this.authService.login({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    }).subscribe(
      globalRes => {
        return this.authService.globalLogin({
          apikey: globalRes.apikey,
          service: 'LOGIN'
        }).subscribe(
        res => {
          nrLoginTracer('login successful');
          this.newRelic.actionText('login successful');
          return this._handleNavigation(res.programs);
        },
        err => {
          nrLoginTracer(JSON.stringify(err));
          this._handleError(err, false);
        });
      },
      err => {
        nrLoginTracer(JSON.stringify(err));
        this._handleError(err, true);
      }
    );
  }

  private _handleError(err, isLoginApi: boolean) {
    this.newRelic.noticeError(`${JSON.stringify(err)}`);
    const statusCode = err.status;
    let msg = 'Your username or password is incorrect, please try again.';
    const passwordCompromisedMSG = `We’ve checked this password against a global database of insecure passwords and your password was on it. <br>
    Please try again. <br>
    You can learn more about how we check that <a href="https://haveibeenpwned.com/Passwords">database</a>`;
    // credential issue
    if (isLoginApi && (statusCode === 400 && err.error && err.error.passwordCompromised)) {
      msg = passwordCompromisedMSG;
    } else if (!isLoginApi && (this.utils.has(err, 'data.type') && err.data.type === 'password_compromised')) {
      msg = passwordCompromisedMSG;
    }
    this.isLoggingIn = false;
    this.notificationService.alert({
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            this.isLoggingIn = false;
          },
        },
      ],
    });
  }

  private async _handleNavigation(programs) {
    const route = await this.switcherService.switchProgramAndNavigate(programs);
    this.isLoggingIn = false;
    return this.router.navigate(route);
  }
}

import { Component } from '@angular/core';
import { TabsService } from './tabs.service';
import { UtilsService } from '@services/utils.service';
import { NativeStorageService } from '@services/native-storage.service';
import { RouterEnter } from '@services/router-enter.service';
import { AuthService } from '../auth/auth.service';
import { SwitcherService } from '../switcher/switcher.service';
import { ReviewListService } from '@app/review-list/review-list.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@services/shared.service';
import { EventListService } from '@app/event-list/event-list.service';
import { NewRelicService } from '@shared/new-relic/new-relic.service';
import { RequestService } from '@shared/request/request.service';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of, BehaviorSubject, Subscription } from 'rxjs';
import { tap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.component.html',
  styleUrls: ['tabs.component.scss']
})
export class TabsComponent extends RouterEnter {
  routeUrl = '/app';
  noOfTodoItems = 0;
  selectedTab = '';

  private _me$ = new BehaviorSubject<any>({});
  private _noOfChats$ = new BehaviorSubject<any>(0);
  private _showChat$ = new BehaviorSubject<any>(false);
  private _showEvents$ = new BehaviorSubject<any>(false);
  private _showReview$ = new BehaviorSubject<any>(false);
  me$ = this._me$.asObservable();
  noOfChats$ = this._noOfChats$.asObservable();
  showChat$ = this._showChat$.asObservable();
  showEvents$ = this._showEvents$.asObservable();
  showReview$ = this._showReview$.asObservable();

  constructor(
    public router: Router,
    private routes: ActivatedRoute,
    private tabsService: TabsService,
    public utils: UtilsService,
    private switcherService: SwitcherService,
    private reviewsService: ReviewListService,
    private sharedService: SharedService,
    private eventsService: EventListService,
    private newRelic: NewRelicService,
    private requestService: RequestService,
    private nativeStorage: NativeStorageService,
    private authService: AuthService
  ) {
    super(router);
    this.newRelic.setPageViewName('tab');

    this.utils.getEvent('notification').subscribe(event => {
      this.noOfTodoItems++;
    });
    this.utils.getEvent('event-reminder').subscribe(event => {
      this.noOfTodoItems++;
    });
    this.utils.getEvent('chat:new-message').subscribe(event => {
      this.tabsService.getNoOfChats().subscribe(noOfChats => {
        this._noOfChats$.next(noOfChats);
      });
    });
    this.utils.getEvent('chat-badge-update').subscribe(event => {
      this.tabsService.getNoOfChats().subscribe(noOfChats => {
        this._noOfChats$.next(noOfChats);
      });
    });

    this.routes.data.subscribe(data => {
      const { user } = data;
      if (!this.utils.isEqual(this._me$.value, user)) {
        this._me$.next(user);
      }
      this.hidingChatTab();

      // enforced inside tabComponent to guarantee successful retrieval of uuid
      if (!user.uuid) {
        this.authService.getUUID().subscribe(uuid => {
          this.nativeStorage.setObject('me', { uuid });
        });
      }
    });

    this.me$.subscribe(user => this.updateShowList(user));
  }

  onEnter() {
    this._checkRoute();
    this._stopPlayingVideos();
    this._topicStopReading();
    fromPromise(this.tabsService.getNoOfTodoItems()).subscribe(noOfTodoItems => {
      noOfTodoItems.subscribe(quantity => {
        this.noOfTodoItems = quantity;
      });
    });
  }

  private updateShowList(user) {
    const {
      teamId,
      hasReviews,
      hasEvents
    } = user;

    // only get the number of chats if user is in team
    if (teamId) {
      this.tabsService.getNoOfChats().subscribe(noOfChats => {
        this._noOfChats$.next(noOfChats);
      });
    }

    // display the chat tab if the user is in team
    if (teamId) {
      this._showChat$.next(true);
    } else {
      this._showChat$.next(false);
      this.switcherService.getTeamInfo().subscribe(() => {
        if (teamId) {
          this._showChat$.next(true);
        }
      });
    }
    if (hasReviews) {
      this._showReview$.next(true);
    } else {
      this._showReview$.next(false);
      this.reviewsService.getReviews().subscribe(data => {
        if (data.length) {
          this._showReview$.next(true);
        }
      });
    }

    if (hasEvents) {
      this._showEvents$.next(true);
    } else {
      this._showEvents$.next(false);
      this.eventsService.getEvents().subscribe(events => {
        this._showEvents$.next(!this.utils.isEmpty(events));
      });
    }
  }

  /**
   * highlight active tab (on focus)
   * @return void
   */
  private _checkRoute() {
    this.newRelic.actionText(`selected ${this.router.url}`);
    switch (this.router.url) {
      case '/app/home':
        this.selectedTab = 'overview';
        break;

      case '/app/events':
        this.selectedTab = 'events';
        break;

      case '/app/settings':
        this.selectedTab = 'settings';
        break;

      case '/app/chat':
        this.selectedTab = 'chat';
        break;

      default:
        if (this.router.url.includes('/app/home')) {
          this.selectedTab = 'overview';
        } else if (this.router.url.includes('/app/reviews')) {
          this.selectedTab = 'reviews';
        } else {
          this.selectedTab = '';
        }
        break;
    }
  }

  /**
   * stop any playing video
   */
  private _stopPlayingVideos() {
    this.sharedService.stopPlayingVideos();
  }

  private _topicStopReading() {
    // if user looking at topic mark it stop reading before go back.
    this.sharedService.markTopicStopOnNavigating();
  }

  /**
   * @name hidingChatTab
   * @description check if chat API respond HTTP200, otherwise
   *              hide chat tab when HTTP500 (API server's fatal error)
   *
   * @return void
   */
  hidingChatTab(): void {
    if (this.requestService.hideChatTab()) {
      this._showChat$.next(false);
    }
  }

}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { RequestModule } from '@shared/request/request.module';
import { NotificationModule } from '@shared/notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { FastFeedbackModule } from './fast-feedback/fast-feedback.module';
import { ReviewRatingModule } from './review-rating/review-rating.module';
import { GoMobileModule } from './go-mobile/go-mobile.module';
import { EventDetailModule } from './event-detail/event-detail.module';

import { AppComponent } from './app.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { UtilsService } from './services/utils.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmbedVideo } from 'ngx-embed-video';
import { environment } from '@environments/environment';
import { PusherModule } from '@shared/pusher/pusher.module';
import { IntercomModule } from 'ng-intercom';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AuthModule,
    RequestModule.forRoot({
      appkey: environment.appkey,
      prefixUrl: environment.APIEndpoint,
    }),
    AppRoutingModule,
    NgCircleProgressModule,
    EmbedVideo.forRoot(),
    NotificationModule,
    FastFeedbackModule,
    GoMobileModule,
    ReviewRatingModule,
    EventDetailModule,
    PusherModule.forRoot({
      apiurl: environment.APIEndpoint,
      pusherKey: environment.pusherKey,
    }),
    IntercomModule.forRoot({
      appId: "pef1lmo8", // from your Intercom config
      updateOnRouterChange: true // will automatically run `update` on router event changes. Default: `false`
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Custom
    UtilsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

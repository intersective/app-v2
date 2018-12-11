import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { RequestModule } from '@shared/request/request.module';
import { NotificationModule } from '@shared/notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { FastFeedbackModule } from './fast-feedback/fast-feedback.module';

import { AppComponent } from './app.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { UtilsService } from './services/utils.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmbedVideo } from 'ngx-embed-video';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AuthModule,
    RequestModule.forRoot({
      appkey: 'b11e7c189b',
      prefixUrl: 'https://sandbox.practera.com/',
    }),
    AppRoutingModule,
    NgCircleProgressModule,
    EmbedVideo.forRoot(),
    NotificationModule,
    FastFeedbackModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Custom
    UtilsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

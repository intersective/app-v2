import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeRoutingComponent } from './home-routing.component';
import { HomeRoutingModule } from './home-routing.module';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    NgCircleProgressModule.forRoot({
      "backgroundColor": "var(--ion-color-light)",
      "subtitleColor": "var(--ion-color-dark-tint)",
      "showInnerStroke": false,
      "startFromZero": false,
      "outerStrokeColor": "var(--ion-color-primary)",
      "subtitle": [
        "COMPLETE"
      ],
      "animation": true,
      "animationDuration": 1000,
      "titleFontSize": "32",
      "subtitleFontSize": "18",
    }),
    HomeRoutingModule,
  ],
  declarations: [HomeComponent, HomeRoutingComponent],
})
export class HomeModule {
}

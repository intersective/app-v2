import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { ActivityCardComponent } from '../components/activity-card/activity-card.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TodoCardComponent } from '../components/todo-card/todo-card.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgCircleProgressModule.forRoot({
      "backgroundColor": "#f4f5f8",
      "subtitleColor": "#444444",
<<<<<<< HEAD
      
    }),
    RouterModule.forChild([{ path: '', component: HomeComponent }])
=======
      "showInnerStroke": false,
      "startFromZero": false,
      "subtitle": [
        "COMPLETE"
      ],
      "animation": true,
      "animationDuration": 1000,
      "titleFontSize": "32",
      "subtitleFontSize": "18",
    })
>>>>>>> develop
  ],
  declarations: [HomeComponent, ActivityCardComponent, TodoCardComponent]
})
export class HomeModule {
}

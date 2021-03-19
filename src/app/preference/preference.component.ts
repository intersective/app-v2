import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '@services/utils.service';
import { RouterEnter } from '@services/router-enter.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PreferenceService } from './preference.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent extends RouterEnter {
  routeUrl = 'app/preference';
  loadingPreference = true;

  @ViewChild('preferenceList') preferenceList;
  @ViewChild('preferenceDetail') preferenceDetail;
  preferenceKey: string;
  constructor(
    public utils: UtilsService,
    public router: Router,
    private preferenceService: PreferenceService
  ) {
    super(router);
  }

  onEnter() {
    this.preferenceKey = null;
    this.loadingPreference = true;
    // trigger onEnter after the element get generated
    setTimeout(() => {
      this.preferenceList.onEnter();
    });
  }

  goto(event) {
    if (event.key) {
      this.preferenceKey = event.key;
    } else {
      this.preferenceKey = event;
    }
    setTimeout(() => {
      this.preferenceDetail.onEnter();
    });
  }

  currentPreference() {
    if (this.preferenceKey) {
      return {
        preferenceKey: this.preferenceKey,
      };
    }
    return null;
  }

}

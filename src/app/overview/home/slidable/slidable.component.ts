import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-slidable',
  templateUrl: './slidable.component.html',
  styleUrls: ['./slidable.component.scss']
})
export class SlidableComponent implements OnInit, OnChanges {
  @Input() notifications;
  // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    spaceBetween: 10,
    // width: 300,
    centeredSlides: true,
  };

  constructor() { }

  ngOnInit() {
    this.notifications = this.reorder(this.notifications);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.notifications = this.reorder(changes.notifications.currentValue);
  }

  reorder(raw) {
    const ordered = raw.sort((a, b) => {
      if (a.meta && a.meta.published_date && b.meta && b.meta.published_date) {
        return moment(a.meta.published_date).isAfter(b.meta.published_date);
      }
      return false;
    });
    return ordered;
  }
}

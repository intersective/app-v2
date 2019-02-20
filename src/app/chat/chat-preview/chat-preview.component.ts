import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'chat-preview',
  templateUrl: 'chat-preview.component.html',
  styleUrls: ['chat-preview.component.scss']
})
export class ChatPreviewComponent {
  url = '';

  constructor(
    public modalController: ModalController,
    public sanitizer: DomSanitizer
  ) {}

  close() {
    this.modalController.dismiss();
  }
}

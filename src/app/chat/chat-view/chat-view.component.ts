import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UtilsService } from '@services/utils.service';
import { RouterEnter } from '@services/router-enter.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent extends RouterEnter {

  teamMemberId?: Number;
  participantsOnly?: boolean;
  teamId: Number;
  chatName?: string;

  @ViewChild('chatList') chatList;
  @ViewChild('chatRoom') chatRoom;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public utils: UtilsService
  ) {
    super(router);
  }

  onEnter() {
    setTimeout(() => {
      this.chatList.onEnter();
    });
  }

  goto(event) {
    this.teamId = event.teamId;
    this.teamMemberId = event.teamMemberId;
    this.participantsOnly = event.participantsOnly;
    this.chatName = event.chatName;
    setTimeout(() => {
      this.chatRoom.onEnter();
    });
  }

  getCurrentChat() {
    return {
      teamId: this.teamId,
      chatName: this.chatName,
      teamMemberId: this.teamMemberId,
      participantsOnly: this.participantsOnly
    };
  }

  selectFirstChat(chats) {
    if (this.teamId) {
      return;
    }
    // navigate to the first chat
    this.goto({
      teamId: chats[0].team_id,
      teamMemberId: chats[0].team_member_id,
      participantsOnly: chats[0].participants_only,
      chatName: chats[0].name
    });
  }

}

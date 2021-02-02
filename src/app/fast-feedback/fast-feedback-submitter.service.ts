import { Injectable } from '@angular/core';
import { RequestService } from '@shared/request/request.service';
const api = {
  submit: 'api/v2/observation/slider/create.json',
};

@Injectable({
  providedIn: 'root'
})
export class FastFeedbackSubmitterService {
  constructor(
    private request: RequestService
  ) {}

  submit(data, params: {
    context_id: number;
    team_id?: number;
    target_user_id?: number;
  }) {
    return this.request.post(api.submit, data, { params });
  }

}

import { Injectable } from '@angular/core';
import { RequestService } from '@shared/request/request.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private request: RequestService) { }

  /**
   * @name login
   * @description login API specifically only accept request data in encodedUrl formdata, so must conver them into compatible formdata before submission
   * @param {object} { email, password } in string for each of the value
   */
  login({ email, password }) {
  	const body = new HttpParams()
  		.set('data[User][email]', email)
  		.set('data[User][password]', password);

    return this.request.post('api/auth.json', body.toString(), { 
    	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }
}
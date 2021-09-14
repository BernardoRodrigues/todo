import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';

@Injectable()
export class SubscriptionService {


  constructor(
    @Inject('PUBLIC_VAPID_KEY') private publicVapidKey: string,
    @Inject('BASE_API_URL') private apiUrl: string,
    private httpClient: HttpClient,
    private swPush: SwPush
    ) {
      this.swPush.messages.subscribe((notification: any) => {
        
      },
    
      err => {
        console.error(err);
      })
  }

  public subscribe(endpoint: string, auth: string | ArrayBuffer, p256dh: string | ArrayBuffer): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/subscription/subscribe`, {endpoint: endpoint, auth: auth, p256dh: p256dh})
  }

  // public unsubscribe(): void {
  //   this.swPush.unsubscribe()
  //     .catch((err) => console.error(err))
  //   this.swPush.
  //   this.httpClient.post(`${this.apiUrl}/subscription/unsubscribe`, {endpoint: })
  // }

  showNotification(title: string, options: NotificationOptions) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg == null) {
        console.log("reg is null")
      } else {

        reg.showNotification(title, options).then(res => {
          console.log("showed notification", res)
        }, err => {
          console.error(err)
        });
      }
   });
}
}

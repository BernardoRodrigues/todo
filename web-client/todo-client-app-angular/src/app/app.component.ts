import { Component, Inject, OnDestroy } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Subscription } from 'rxjs';
import { LoginSubjectService } from './services/login-subject/login-subject.service';
import { SubscriptionService } from './services/subscription/subscription.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  title = 'todo-client-app-angular';
  
  private subscription: Subscription;

  constructor(
    private loginSubjectService: LoginSubjectService,
    private swPush: SwPush,
    @Inject('PUBLIC_VAPID_KEY') private publicVapidKey: string,
    private subscriptionService: SubscriptionService
  ) {
    this.subscription = this.loginSubjectService.userLogInObservable().subscribe(() => {
      this.swPush.requestSubscription({serverPublicKey: this.publicVapidKey})
      .then((value) => {
        
        const authBuffer = value.getKey('auth')
        const p256dhBuffer = value.getKey("p256dh")
        if (authBuffer == null || p256dhBuffer == null) {
          console.error("auth or p256dh keys are null")
          return;
        }
        const auth = btoa(new Uint8Array(authBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        const p256dh = btoa(new Uint8Array(p256dhBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        this.subscriptionService.subscribe(value.endpoint, auth, p256dh).subscribe(() => {
          this.swPush.messages.subscribe((notification: any) => {
            console.log("received push notification", notification);
            let options = {
              body: notification.body,
              icon: "assets/icon/favicon.png",
              actions: <any>notification.actions,
              data: notification.data,
              vibrate: [100, 50, 10, 20, 20]
            };
            this.showNotification(notification.title, options)
          })
        })
      }).catch((err) => console.error(err))


    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private showNotification(title: string, options: NotificationOptions) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg == null || title == null) {
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

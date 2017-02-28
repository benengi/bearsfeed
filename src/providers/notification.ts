import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { UserModel, UserProvider } from './user';

import { AngularFire } from 'angularfire2';

export class NotificationModel {
  id        ?: string;
  activity  ?: string;
  user      ?: UserModel;
  createdAt ?: string;
}

export class ActivityModel {
  name        ?: string;
  description ?: string;
  icon        ?: string;
}

export const activityList = [
  { name: 'like',    description: 'Upvoted your post!',   icon: 'arrow-round-up' },
  { name: 'unlike',  description: 'Downvoted your post!', icon: 'arrow-round-down' },
  { name: 'comment', description: 'Commented your post!', icon: 'chatboxes' }
];


@Injectable()
export class NotificationProvider {
  data: Array<NotificationModel>;

  constructor(
    private userProvider : UserProvider,
    public af: AngularFire,
  ) {}

  get allNotifications(): Array<NotificationModel> {
    this.data = [];
    for (let i=0; i< 10; i++) {
      let user = this.userProvider.allUsers[i];

      if (!user)    
        continue;
      let notification = new NotificationModel();
      notification.user = user;
  
      notification.activity = activityList[Math.floor(Math.random() * 3)].name;
      this.data.push(notification);
    }
    
    return this.data;
  }

  get badgeCounts() {
    return this.userProvider.currentUser.flatMap(user => {
      return this.af.database.list('notifications/' + user.$key).map(notifications =>{
        return notifications.filter(notification => notification.hasRead !== true);
      });
    });
  }
}

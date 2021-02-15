import PushNotification from 'react-native-push-notification';

class Notification {
  static config() {
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    return PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION onNotification:', notification);
        console.log('ACTION onNotification:', notification.action);

        if (notification.action === 'OK') {
          console.log('NOTIFICATION ACTION OK!!! onNotification');
        }

        Notification.local(notification);
        // process the notification
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('NOTIFICATION onAction:', notification);
        console.log('ACTION onAction:', notification.action);

        if (notification.action === 'OK') {
          console.log('NOTIFICATION ACTION OK!!! onAction');
        }

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }

  static channel(channel) {
    PushNotification.channelExists(channel, function (exists) {
      if (!exists) {
        PushNotification.createChannel(
          {
            channelId: channel, // (required)
            channelName: channel, // (required)
            channelDescription: channel, // (optional) default: undefined.
            soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
          },
          (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
        );
      } else {
        return;
      }
    });

    PushNotification.getChannels(function (channel_ids) {
      console.log('NOTIFICATION CHANNELS:', channel_ids); // ['channel_id_1']
    });
  }

  static channelDelete(channel) {
    PushNotification.deleteChannel(channel);

    PushNotification.getChannels(function (channel_ids) {
      console.log(channel_ids); // ['channel_id_1']
    });
  }

  static list() {
    PushNotification.getDeliveredNotifications((callback) => {
      console.log(callback);
    });
    PushNotification.getScheduledLocalNotifications((callback) => {
      console.log(callback);
    });
  }

  static notifData(data) {
    return {
      /* Android Only Properties */
      channelId: data.channelId ? data.channelId : 'Weather', // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
      // ticker: 'My Notification Ticker', // (optional)
      showWhen: true, // (optional) default: true
      // autoCancel: true, // (optional) default: true
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
      largeIconUrl: data.largeIconUrl ? data.largeIconUrl : undefined, // (optional) default: undefined
      smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      // bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
      // subText: 'This is a subText', // (optional) default: none
      bigPictureUrl: data.bigPictureUrl ? data.bigPictureUrl : undefined, // (optional) default: undefined
      color: data.color ? data.color : '#5b97ff', // (optional) default: system default
      vibrate: data.vibrate ? data.vibrate : true, // (optional) default: true
      vibration: data.vibration ? data.vibration : 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      // tag: 'some_tag', // (optional) add tag to message
      // group: 'group', // (optional) add group to message
      // groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: data.ongoing ? data.ongoing : false, // (optional) set whether this is an "ongoing" notification
      // priority: 'high', // (optional) set notification priority, default: high
      visibility: data.visibility ? data.visibility : 'private', // (optional) set notification visibility, default: private
      // ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      // shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      // onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false

      when: data.when ? data.when : new Date(Date.now()), // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: data.usesChronometer ? data.usesChronometer : false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      timeoutAfter: data.timeoutAfter ? data.timeoutAfter : null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

      messageId: 'google:message_id', // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.

      actions: data.actions ? data.actions : undefined, //['Yes', 'No'], // (Android only) See the doc for notification actions to know more
      invokeApp: data.invokeApp ? data.invokeApp : true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      /* iOS only properties */
      // alertAction: 'view', // (optional) default: view
      // category: '', // (optional) default: empty string

      /* iOS and Android properties */
      id: data.id ? data.id : 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: data.title ? data.title : 'Weather', // (optional)
      message: data.message, // (required)
      // userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: data.playSound ? data.playSound : true, // (optional) default: true
      soundName: data.soundName ? data.soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    };
  }

  static local(data) {
    console.log('NOTIFICATION:', data);
    this.channel(data.channelId ? data.channelId : 'Weather');
    PushNotification.localNotification(this.notifData(data));
  }

  static schedule(data) {
    console.log('NOTIFICATION:', data);
    this.channel(data.channelId ? data.channelId : 'Weather');
    PushNotification.localNotificationSchedule({
      ...this.notifData(data),

      //... You can use all the options from localNotifications
      date: data.date ? data.date : new Date(Date.now() + 60 * 1000), // in 60 secs
      allowWhileIdle: data.allowWhileIdle ? data.allowWhileIdle : false, // (optional) set notification to work while on doze, default: false
    });
  }

  static cancel() {
    PushNotification.cancelLocalNotifications({id: '123'});
    PushNotification.cancelAllLocalNotifications();
    PushNotification.removeAllDeliveredNotifications();
    PushNotification.removeDeliveredNotifications('identifiers');
  }

  static initial() {
    PushNotification.popInitialNotification((notification) => {
      console.log('Initial Notification', notification);
    });
  }

  static badge(data) {
    PushNotification.setApplicationIconBadgeNumber(data.number);
  }
}

export default Notification;

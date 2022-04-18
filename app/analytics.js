import EmberRouter from '@ember/routing/router';

EmberRouter.reopen({
  notifyGoogleAnalytics: function () {
    if (typeof ga != 'function') {
      return;
    }
    return ga('send', 'pageview', {
      'page': this.get('url'),
      'title': this.get('url')
    });
  }.on('didTransition')
});

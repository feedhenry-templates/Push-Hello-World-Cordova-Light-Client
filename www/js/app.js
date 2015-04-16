var app = {
  messages: [],
  categories: [],
  messageTemplate: null,
  initialize: function () {
    var source = document.getElementById('category-template').innerText;
    var template = Handlebars.compile(source);
    this.messageTemplate = Handlebars.compile(document.getElementById('messageTemplate').innerText);
    $fh.cloud({
      path: '/api/',
      method: 'GET'
    }, function (res) {
      var html = template({categories: res.data});
      document.getElementById("list").innerHTML = html;
    });
  },

  selectionChanged: function (option) {
    if (option.checked) {
      var that = this;
      that.categories.push(option.id);

      ajax({
        url: "push-config.json",
        dataType: "text"
      }).then(function (result) {
        var pushConfig = JSON.parse(result.data);
        pushConfig.categories = that.categories;
        push.register(this.onNotification, function () {
          console.log('registration done');
        });
      });
    } else {
      this.categories.splice(this.categories.indexOf(option.id), 1);
    }
  },

  toggleTabs: function (message) {
    function toggle(id, show) {
      var e = document.getElementById(id);
      var tab = document.getElementById(id + 'Tab');
      if (show) {
        e.style.display = 'block';
        tab.setAttribute('class', 'active');
      }
      else {
        e.style.display = 'none';
        tab.removeAttribute('class');
      }
    }

    toggle('messages', message);
    toggle('categories', !message);
  },

  onNotification: function (event) {
    this.messages.push({date: new Date(), alert: event.alert});
    document.getElementById('messages').innerHTML = this.messageTemplate({messages: this.messages});
  }
};
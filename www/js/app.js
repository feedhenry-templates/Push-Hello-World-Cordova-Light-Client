var app = (function () {
  var messages = [],
    categories = [],
    messageTemplate = null;

  function onNotification(event) {
    messages.push({date: new Date(), alert: event.alert});
    document.getElementById('messages').innerHTML = messageTemplate({messages: messages});
    app.toggleTabs(true);
  }

  return {
    initialize: function () {
      var template = Handlebars.compile(document.querySelector('#category-template').innerHTML);
      messageTemplate = Handlebars.compile(document.querySelector('#messageTemplate').innerHTML);
      $fh.cloud({
        path: '/category/',
        method: 'GET'
      }, function (res) {
        document.getElementById("list").innerHTML = template({categories: res.data});
      });
    },

    selectionChanged: function (option) {
      if (option.checked) {
        categories.push(option.id);

        ajax({
          url: "push-config.json",
          dataType: "text"
        }).then(function (result) {
          var pushConfig = JSON.parse(result.data);
          pushConfig.categories = categories;
          push.register(onNotification, function () {
            console.log('registration done');
          }, function (err) {
            alert(err);
          }, pushConfig);
        });
      } else {
        categories.splice(categories.indexOf(option.id), 1);
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
    }
  }
}());
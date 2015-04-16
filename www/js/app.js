var app = {
  categories: [],
  initialize: function () {
    var source = document.getElementById('category-template').innerText;
    var template = Handlebars.compile(source);
    $fh.cloud({
      path: '/api/',
      method: 'GET'
    }, function (res) {
      var html = template({categories: res.data});
      document.getElementById("list").innerHTML = html;
    });
  },

  selectionChanged: function(option) {
    if (option.checked) {
      var that = this;
      that.categories.push(option.id);

      ajax({
        url: "push-config.json",
        dataType: "text"
      }).then(function(result) {
        var pushConfig = JSON.parse(result.data);
        pushConfig.categories = that.categories;
        push.register(this.onNotification, function() {
          console.log('registration done');
        });
      });
    } else {
      this.categories.splice(this.categories.indexOf(option.id), 1);
    }
  },

  onNotification: function (event) {
  }
};
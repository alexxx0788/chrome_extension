var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": function () {
    core.netrequest.register();
  },
  "update": {
    "toolbar": {
      "button": function () {
        var current = config.addon.state === "enabled" ? "ON" : "OFF";
        /*  */
        app.button.icon(null, config.addon.state);
        app.button.title(null, "Modify Header Value: " + current);
      }
    }
  },
  "netrequest": {
    "register": async function () {
      core.update.toolbar.button();
      /*  */
      await app.netrequest.display.badge.text(false);
      await app.netrequest.remove.action.type("modifyHeaders", "requestHeaders");
      /*  */
      if (config.addon.state === "enabled") {
        for (var i = 0; i < config.header.array.length; i++) {
          var header = config.header.array[i];
          if (header) {
            if (header.state === "active") {
              var target = {};
              var url = header.url !== '*' ? new URL(header.url) : '';
              /*  */
              if (header.checked_r) target = {"operation": "remove", "header": header.name};
              if (header.checked_m) target = {"operation": "set", "header": header.name, "value": header.value};
              if (header.checked_a) target = {"operation": "set", "header": header.name, "value": header.value}; // "append" is not supported for request headers
              /*  */
              app.netrequest.rules.add({
                "action": {
                  "type": "modifyHeaders",
                  "requestHeaders": [target]
                },
                "condition": {
                  "resourceTypes": header.checked_s ? ["main_frame", "sub_frame"] : ["main_frame"],
                  "urlFilter": url ? "||" + url.hostname + (header.checked_d ? '' : url.pathname) : '*'
                }
              });
            }
          }
        }
      }
      /*  */
      await app.netrequest.rules.update();
    }
  }
};

app.options.receive("store", function (e) {
  config.header.array = e.headerArray;
  core.netrequest.register();
});

app.popup.receive("load", function () {
  app.popup.send("storage", {
    "state": config.addon.state
  });
});

app.options.receive("load", function () {
  app.options.send("storage", {
    "log": config.addon.log,
    "headerArray": config.header.array
  });
});

app.popup.receive("state", function () {
  config.addon.state = config.addon.state === "disabled" ? "enabled" : "disabled";
  core.netrequest.register();
  /*  */
  app.popup.send("storage", {
    "state": config.addon.state
  });
});

app.popup.receive("reload", app.tab.reload);
app.popup.receive("options", app.tab.options);
app.popup.receive("support", function () {app.tab.open(app.homepage())});
app.popup.receive("donation", function () {app.tab.open(app.homepage() + "?reason=support")});

app.on.startup(core.start);
app.on.installed(core.install);

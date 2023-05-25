chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'User-Agent') {
          details.requestHeaders[i] = 'Chrome';
          break;
        }
      }
      return {requestHeaders: details.requestHeaders};
      },
      {urls: ["https://www.loopnet.com/"]},
      ["requestHeaders"]
  );

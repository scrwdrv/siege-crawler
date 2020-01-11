# siege-crawler
 This CLI tool will find same domain urls in a web page and requesting them to find even more urls until server crash (or at the end of benchmark). It is used to test maximun capacity of server or finding for glitches that users might encounter.


## Installation
```sh
npm i -g siege-crawler
```

## Usage
```sh
siege-crawler https://google.com 
# requesting `https://google.com` with default rate 50/sec until ^c is fired
```
```sh
siege-crawler --duration 5 --rate 10 https://google.com 
# or          -d 5 -r 10
# requesting `https://google.com` with custom rate 10/sec for 5 secs or ^c is fired
```

### Skip Specific URLs
Rule out urls by regular expression. Notice, regex will match **full url** not just path. 
```sh
siege-crawler --ruleout /google\.com\/search/ https://google.com 
```
```sh
siege-crawler --ruleout /^https://google\.com\/search\?.+$/i https://google.com 
```
### Ouput
```sh
[google.com] rate: 5/sec, duration: 5 secs, ruleout: /google\.com\/search/i

Sent: 26, Received: 26, Lost: 0 (0.00% loss)
Data received: 5,614,377 bytes
Response Time(ms): Max = 544, Min = 219, Avg = 311.00
```

### Request Log
siege-crawler will generate a complete log in current directory listed all the requested urls, status and response time in real order.
```log
 Status | Time(ms) | URL
     OK |      284 | https://google.com
     OK |      339 | https://google.com
     OK |      234 | https://google.com
     OK |      304 | https://google.com/
     OK |      246 | https://google.com/advanced_search?hl=en-US&fg=1
     OK |      396 | https://google.com/history/privacyadvisor/search/unauth?utm_source=googlemenu&fg=1
     OK |      319 | https://google.com/history/optout?hl=en-US&fg=1
     OK |      219 | https://google.com
     OK |      283 | https://google.com/
     OK |      246 | https://google.com/advanced_search?hl=en-US&fg=1
     OK |      485 | https://google.com/history/privacyadvisor/search/unauth?utm_source=googlemenu&fg=1
     OK |      265 | https://google.com/webhp?tab=ww
     OK |      318 | https://google.com/preferences?hl=en-US
     OK |      309 | https://google.com/history/optout?hl=en-US&fg=1
     OK |      265 | https://google.com/history/optout?utm_source=search-privacy-advisor
     OK |      230 | https://google.com
     OK |      265 | https://google.com/
     OK |      235 | https://google.com/advanced_search?hl=en-US&fg=1
     OK |      416 | https://google.com/history/privacyadvisor/search/unauth?utm_source=googlemenu&fg=1
     OK |      298 | https://google.com/webhp?tab=ww
     OK |      305 | https://google.com/preferences?hl=en-US
     OK |      301 | https://google.com/history/optout?hl=en-US&fg=1
     OK |      241 | https://google.com/webhp
     OK |      544 | https://google.com/support/websearch?p=ws_cookies_notif&hl=en-US
     OK |      265 | https://google.com/history/optout?hl=en-US
     OK |      474 | https://google.com/intl/en-US/help.html
```
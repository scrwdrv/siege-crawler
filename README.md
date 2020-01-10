# siege-crawler
 This CLI tool will find same domain urls in a web page and requesting them to find even more urls until server crash (or at the end of benchmark). It is used to test maximun capacity of server or finding for glitches that users might encounter.


## Installation
```sh
npm i -g siege-crawler
```

## Usage
```sh
siege-crawler https://google.com 
##requesting `https://google.com` with default rate 50/sec until ^c is fired
```
```sh
siege-crawler --duration 5 --rate 10 https://google.com 
##requesting `https://google.com` with custom rate 10/sec for 5 secs or ^c is fired
```

### Ouput
```sh
[google.com] rate: 10/sec, duration: 5 secs

Sent: 49, Received: 49, Lost: 0 (0.00% loss)
Response Time(ms): Max = 794, Min = 120, Avg = 402.24
```

### Request Log
siege-crawler will generate a complete log in current directory listed all the requested urls, status and response time in real order.
```sh
 Status | Time(ms) | URL
     OK |      326 | https://google.com
     OK |      332 | https://google.com
     OK |      569 | https://google.com/
     OK |      591 | https://google.com/advanced_search?hl=en-US&fg=1
     OK |      794 | https://google.com/history/privacyadvisor/search/unauth?utm_source=googlemenu&fg=1
     OK |      657 | https://google.com/history/optout?hl=en-US&fg=1
     OK |      377 | https://google.com/search/howsearchworks/?fg=1
     OK |      574 | https://google.com
     OK |      511 | https://google.com/
     OK |      519 | https://google.com/advanced_search?hl=en-US&fg=1
     OK |      602 | https://google.com/history/privacyadvisor/search/unauth?utm_source=googlemenu&fg=1
     OK |      623 | https://google.com/history/optout?hl=en-US&fg=1
     OK |      336 | https://google.com/search/howsearchworks/?fg=1
     OK |      397 | https://google.com
     OK |      368 | https://google.com/
     OK |      392 | https://google.com/webhp?tab=ww
     OK |      389 | https://google.com/preferences?hl=en-US
     OK |      371 | https://google.com/advanced_search?hl=en-US&fg=1
     OK |      315 | https://google.com/search/howsearchworks/
     OK |      293 | https://google.com/search/howsearchworks/crawling-indexing/
     OK |      257 | https://google.com/search/howsearchworks/algorithms/
     OK |      177 | https://google.com/search/howsearchworks/responses/
     OK |      171 | https://google.com/search/howsearchworks/mission/
     OK |      157 | https://google.com/search/howsearchworks/mission/users/
     OK |      149 | https://google.com/search/howsearchworks/mission/creators/
     OK |      120 | https://google.com/search/howsearchworks/mission/open-web/
     OK |      422 | https://google.com/history/privacyadvisor/search/unauth?utm_source=googlemenu&fg=1
     OK |      455 | https://google.com/history/optout?hl=en-US&fg=1
     OK |      465 | https://google.com/history/optout?utm_source=search-privacy-advisor
     OK |      287 | https://google.com/search/howsearchworks/?fg=1
     OK |      345 | https://google.com
     OK |      326 | https://google.com/
     OK |      358 | https://google.com/webhp?tab=ww
     OK |      428 | https://google.com/preferences?hl=en-US

     ...
```
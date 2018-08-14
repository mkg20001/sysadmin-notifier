# Sysadmin-Notifier

A tiny tool to notify the sysadmin of problems/alerts from multiple sources

## Usage

```
sysadmin-notifier /path/to/config.yaml
```

### Example Config

```yaml
global:
  dateFormat: 'hh:mm:ss DD.MM.YYYY'
  interval: 10000
source.netdata:
  interval: 1000 # global settings can be overriden per source
  timeout: 10000 # timeout for request
  hosts:
    - server1.tld
    - server2.tld
    - server3.tld:14396
source.uptimerobot:
  apikey: 'SEKRET'
notify.console: # prints to console
  enabled: true
notify.notifySend: # uses notify-send to send notifications
  enabled: true
```

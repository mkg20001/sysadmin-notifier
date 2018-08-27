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
  blacklist: # note: matches hostname, not url. ids and hostname are globs, see https://npm.im/minimatch
    - system.softnet_stat.*@* # block softnet_stat alerts for all servers
    - system.cpu.*@math-server # block system.cpu for math-server
    - disk_space.*@storage* # block all disk_space alerts for all storage servers
source.uptimerobot:
  apikey: 'SEKRET'
  blacklist:
    - id # blacklist a specific monitor by id
notify.console: # prints to console
  enabled: true
notify.notifySend: # uses notify-send to send notifications
  enabled: true
```

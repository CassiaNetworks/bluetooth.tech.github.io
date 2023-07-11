
| Description / Host OS | Asset / File |
|---------|---------|
|Windows x86-64|[cg-0.1.2-win64.zip](/cg/cg-0.1.2-win64.zip)|
|Linux x86-64|[cg-0.1.2-amd64_linux.zip](/cg/cg-0.1.2-win64.zip)|


```
$ cg.exe --help

Cassia gateway command tool.

Usage: cg.exe <COMMAND>

BLE Basic Commands:
  adv        -a  --adv          Advertising
  btaddr     -b  --btaddr       Update BT address
  connect    -c  --connect      Connect one device
  connlist   -l  --connlist     Connected devices list
  disconnect -d  --disconnect   Disconnect one device
  discover       --discover     Discover services and characteristics
  hs             --hs           Set chip high speed parameters
  hsx            --hsx          Set chip high speed extend parameters
  notify     -n  --notify       Subscribe to receive notifications (indications)
  pair       -p  --pair         Pair with device
  read       -r  --read         Read value
  rssi           --rssi         Subscribe to receive connection RSSI
  scan       -s  --scan         Scan devices
  state          --state        Subscribe to receive connection state
  unpair     -u  --unpair       Unpair with device
  write      -w  --write        Write value

Management Commands:
  app        -A  --app          Container APP operation
  config     -C  --config       Get gateway config
  container      --container    Container operation
  export     -E  --export       Export gateway data
  firmware   -F  --firmware     Update firmware
  info       -I  --info         Get gateway info
  reboot     -R  --reboot       Reboot gateway
  reset          --reset        Reset gateway
  help       -h  --help         Print help message

Options:
  -h  --help     Print help
  -V  --version  Print version

To get more help, check out our guides at https://github.com/CassiaNetworks/CassiaSDKGuide/wiki/RESTful-API

```
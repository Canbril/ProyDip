#! /bin/bash

iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination $IP_CLIENT:80
iptables -t nat -A POSTROUTING -p tcp -d $IP_CLIENT --dport 80 -j MASQUERADE

iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -t nat -A PREROUTING -p tcp --dport 4000 -j DNAT --to-destination $IP_CLIENT:4000
iptables -t nat -A POSTROUTING -p tcp -d $IP_CLIENT --dport 4000 -j MASQUERADE

iptables -A OUTPUT -j ACCEPT

while true; do sleep 1; done
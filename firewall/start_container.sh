#! /bin/bash

iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination $IP_FRONTEND:80
iptables -t nat -A POSTROUTING -p tcp -d $IP_FRONTEND --dport 80 -j MASQUERADE

iptables -A INPUT -p tcp --dport 4000 -j ACCEPT
iptables -t nat -A PREROUTING -p tcp --dport 4000 -j DNAT --to-destination $IP_BACKEND:4000
iptables -t nat -A POSTROUTING -p tcp -d $IP_BACKEND --dport 4000 -j MASQUERADE

iptables -A OUTPUT -j ACCEPT

while true; do sleep 1; done
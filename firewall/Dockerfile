FROM debian:latest

RUN apt-get update && \
    apt-get install -y shorewall net-tools && \
    apt-get clean

COPY zones interfaces rules policy snat /etc/shorewall/

CMD [ "/bin/bash", "-c", "while true; do sleep 1; done" ]

#Opción chatgpt
#CMD ["/usr/sbin/shorewall", "start", "-f"]

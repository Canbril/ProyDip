FROM debian:latest

RUN apt-get update && \
    apt-get install -y iptables

EXPOSE 4000 3000

CMD [ "/bin/bash", "-c", "while true; do sleep 1; done" ]
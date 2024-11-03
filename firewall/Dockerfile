FROM debian:latest

COPY start_container.sh .

RUN apt-get update && \
    apt-get install -y iptables; \
    chmod +x start_container.sh

EXPOSE 4000 3000

#CMD [ "/bin/bash", "-c", "while true; do sleep 1; done" ]
CMD [ "/bin/bash", "-c", "./start_container.sh" ]
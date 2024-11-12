FROM debian:latest

COPY start_container.sh .

RUN chmod +x start_container.sh; \
    apt-get update && apt-get install -y iptables;

EXPOSE 5000 3000

CMD [ "/bin/bash", "-c", "./start_container.sh" ]
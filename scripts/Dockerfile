FROM ubuntu:16.04

ENV DEBIAN_FRONTEND noninteractive


RUN apt-get update -q \
	&& apt-get install -yq \
		openjdk-8-jre bash

WORKDIR /opt/rcm-pull
COPY xml_fetch .

CMD [/bin/bash]

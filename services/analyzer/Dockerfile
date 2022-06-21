FROM ubuntu


WORKDIR /usr/src/app


RUN apt-get update
RUN apt-get install -y software-properties-common python3 python3-pip
RUN add-apt-repository ppa:chris-needham/ppa
RUN apt-get update
RUN apt-get install -y audiowaveform
RUN python3 -m pip install Flask Flask-Reuploaded aubio matplotlib mido

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=8080"]
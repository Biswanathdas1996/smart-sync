FROM python:3.11.4
#USER root
RUN python -m pip install --upgrade pip
WORKDIR /app
COPY . /app
RUN python -m pip install -r requirements.txt
#EXPOSE 5000
#CMD python ./app.py
CMD [ "python", "app.py" ]
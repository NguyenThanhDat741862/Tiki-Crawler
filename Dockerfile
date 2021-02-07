FROM node:14.15.4

MAINTAINER nguyenThanhDat741862 <nguyenThanhDat741862@gmail.com>

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
RUN apt update
RUN apt-get install -y libasound2
RUN apt-get install -y libnss3
RUN apt-get install -y libatk-adaptor
RUN apt-get install -y libcups2-dev
RUN apt-get install -y libgtk-3-0
RUN apt-get install -y libgbm-dev

COPY . .

CMD [ "node", "main.js" ]
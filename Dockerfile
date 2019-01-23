FROM mhart/alpine-node:10
COPY . /app
RUN cd /app               && \
    npm install node-sass && \
    yarn install

WORKDIR /app
ENTRYPOINT ["yarn"]
CMD ["start"]

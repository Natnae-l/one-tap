FROM node:alpine3.18

RUN mkdir /app

WORKDIR /app

COPY . .

RUN npm install

ENV port=4000 \
    db="mongodb+srv://Natnael:e840qPAaOMYxgeSC@cluster0.vs0kmkg.mongodb.net/one-tap?retryWrites=true&w=majority&appName=Cluster0" \
    secretJWT="sc$nc483nr4#z" \
    gatewayId=122123 \
    pulsarUrl="pulsar://196.188.120.21:30900" \
    serviceUrl="http:localhost:4000"

EXPOSE 4000

CMD [ "node", "app.js" ]
## iMeter Web App

#### Tech stack & notes:
* next.js (with redux) for the universal/isomorphic web application
* bulma as CSS framework
* Koa-based RESTful API
* Uses a single Nodejs instance to serve both the server-rendered UI as
  the RESTful API
* Add server-side live reload of the Koa components (without resorting
  to `nodemon`, as the shared NodeJS instance means restarts are slow)


#### Tech TODO:
* Experiment with Service Workers
* Experiment with GraphQL/Apollo

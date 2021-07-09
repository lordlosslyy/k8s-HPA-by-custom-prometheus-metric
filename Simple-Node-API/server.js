'use strict'; 

const express = require('express');
const app = express()
const PORT = 8080; 

// [START monitoring_sli_metrics_prometheus_setup]
const prometheus = require('prom-client'); 
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
const Registry = prometheus.Registry; 
const register = new Registry(); 
collectDefaultMetrics({register}); 

//const register = prometheus.register; 
// collectDefaultMetrics({}); 

const nodeRequestsCounter = new prometheus.Counter({
    name: 'ian_node_requests',
    help: 'total requests',
    registers: [register],
});


//collectDefaultMetrics({nodeRequestsCounter}); 
// [END monitoring_sli_metrics_prometheus_setup]




app.get('/', (req, res) => {
    nodeRequestsCounter.inc();
    //const date = new Date(1481361366000);
    // const currentTime = da
    const date = new Date(Date.now());
    console.log('Hello World from Kaohsiung');
    res.send(`Hello World from Kaohsiung ${date}`);
});

// [START monitoring_sli_metrics_prometheus_metrics_endpoint]
app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (ex) {
      res.status(500).end(ex);
    }
});
// [END monitoring_sli_metrics_prometheus_metrics_endpoint]

app.listen(PORT, () => {
    console.log('Listen to port ', PORT); 
})
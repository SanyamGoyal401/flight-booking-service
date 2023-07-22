const express = require('express')
const{ServerConfig, Logger, Queue} = require('./config');
const apiRoutes = require('./routes')
const app = express();

const Cron = require('./utils/common/cron-jobs');

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res)=>{
    return res.json({msg: "server is live"});
})


app.use('/api', apiRoutes);


app.listen(ServerConfig.PORT, async()=>{
    console.log(`Successfully started the port at ${ServerConfig.PORT}`);
    Logger.info('Successfully started server', {})
    Cron();
    await Queue.connectQueue();
})
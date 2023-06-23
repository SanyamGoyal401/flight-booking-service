const express = require('express')
const{ServerConfig, Logger} = require('./config');
const apiRoutes = require('./routes')

const app = express();

app.get('/', (req, res)=>{
    return res.json({msg: "server is live"});
})


app.use('/api', apiRoutes);


app.listen(ServerConfig.PORT, ()=>{
    console.log(`Successfully started the port at ${ServerConfig.PORT}`);
    Logger.info('Successfully started server', {})
})
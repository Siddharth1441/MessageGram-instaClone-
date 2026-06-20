require('dotenv').config()
const app = require("./src/app");
const connectToDb = require('./src/config/database');
const port = process.env.PORT || 3000
const dns =  require('dns')

dns.setServers([
    '1.1.1.1',
    '0.0.0.0'
])


connectToDb()
    .then(() => {
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`)
        })
    })
    .catch((error) => {
        console.error("Failed to connect to database", error)
        process.exit(1)
    })

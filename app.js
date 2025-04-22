if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routers/index')
const errorHandler = require('./middlewares/errorHandler')
const port = process.env.PORT || 2053


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/', router)
app.use(errorHandler)
app.listen(port, () => {
    console.log(`Example app is running on port ${port}`)
})
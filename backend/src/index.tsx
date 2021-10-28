import * as express from 'express'
import * as cors from 'cors'
import { v4 as uuidv4 } from 'uuid';

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const port = 3000
export const logging = true
export type Logger = (...args: any[]) => void
export const logger: Logger = function (...args) {
    if (logging === true) {
        console.log(...args)
    }
}

let cache = ['hello']
const myDB = {}

const origin = `http://localhost:1234`
const corsOptions = {
    origin,
    optionsSuccessStatus: 200 

}
app.use(cors(corsOptions))

app.listen(port, () => {
    logger(`Example app listening on port ${port}!`)
});
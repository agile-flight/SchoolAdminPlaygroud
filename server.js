/*
This file configures and starts the Express server to handle HTTP requests.

- Imports necessary libraries and modules.
- Sets up middleware for security, logging, CORS, and request parsing.
- Connects to the MongoDB database.
- Defines API routes.
- Starts the server and listens on the specified port.
*/

const { express, bodyParser, helmet, morgan, cors} = require('./middlewares');

const connectDB = require("./db");
const campus = require("./routes/api/campus");

const PORT = 4000;
const app = express();

app.use(
    cors({
        origin: "http://localhost:4000",
        credentials: true
    })
)

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan("dev"));
app.use(helmet());

connectDB();
app.use("/campus", campus)
app.listen(PORT, console.log(`API is listening on port ${PORT}`));


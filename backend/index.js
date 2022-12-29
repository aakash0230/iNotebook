const connectDb = require("./db")
const express = require("express")

connectDb();

const app = express()
const port = 5000

app.use(express.json());


// Available Routes
app.use("/api/auth", require("./routes/auth.js"))
app.use("/api/notes", require("./routes/notes.js"))
app.get("/", (req, res) => {
    res.send("Hello world");
})

app.listen(port, () => {
    console.log(`app running on http://localhost:${port}`)
})
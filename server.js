import express from "express";

const MOCK_PORT = process.env.PORT || 31337;

let app = express();
app.use(express.static("lib"));
app.listen(MOCK_PORT);

console.log(`Listening on port ${MOCK_PORT}`);

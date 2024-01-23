import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";

import Recog from "./Recog";
import { RowDataPacket } from "mysql2";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const analisedResults: Array<Recog> = []

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './dist/files')
    },
    filename: function (req, file, cb) {
        const nowDate = Date.now()
        cb(null, file.fieldname + "-" + nowDate + "." + file.originalname)
    }
})

const upload = multer({ storage: storage, });

app.get("/", (req, res) => { res.send("OK") });

app.get("/upload", (req, res) => { res.sendFile(__dirname + "/upload.html") });

app.get("/file/:f", (req, res) => {
    res.sendFile(__dirname + "/files/" + req.params.f);
});

app.get("/filestoanalise", async (req, res) => {

    var response = {toAnalise: false} as any

    const filesNames = (await Recog.getFileToAnalise())[0] as Array<RowDataPacket>
    if (filesNames.length > 0) {
        const fileid = filesNames[0].id
        const filename = filesNames[0].fname
        const _ = await Recog.statusWorking(fileid)
        response = {...response, fname: filename}
    }

    res.json(response)
});

app.post("/infoforfile",async (req, res) => {

    const completion = req.body;
    const _ = await Recog.completeRecogniton(completion)

    res.json({ answ: "ok" })
});

app.get("/results/:file", (req, res) => {
    const result = analisedResults.find(element => element.fname === req.params.file)
    res.json({ result: result })
});

app.post("/uploadfile", upload.single('photo'), async function (req, res) {

    const newrecog = new Recog(req.file?.filename!)
    const [dbres] = (await newrecog.save()) as Array<RowDataPacket>;

    res.json({ name: req.file?.filename, id: dbres.insertId })
});

app.post('/error',async (req, res) => {
    const {error, fname} = req.body

    const _ = await Recog.setFailed(fname, error);
    
    res.json({status: 'updated'})
});

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log("Started app on port: " + port);
})
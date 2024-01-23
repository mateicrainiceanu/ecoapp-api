"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const Recog_1 = __importDefault(require("./Recog"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const analisedResults = [];
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './dist/files');
    },
    filename: function (req, file, cb) {
        const nowDate = Date.now();
        cb(null, file.fieldname + "-" + nowDate + "." + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage, });
app.get("/", (req, res) => { res.send("OK"); });
app.get("/upload", (req, res) => { res.sendFile(__dirname + "/upload.html"); });
app.get("/file/:f", (req, res) => {
    res.sendFile(__dirname + "/files/" + req.params.f);
});
app.get("/filestoanalise", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var response = { toAnalise: false };
    const filesNames = (yield Recog_1.default.getFileToAnalise())[0];
    if (filesNames.length > 0) {
        const fileid = filesNames[0].id;
        const filename = filesNames[0].fname;
        const _ = yield Recog_1.default.statusWorking(fileid);
        response = Object.assign(Object.assign({}, response), { fname: filename });
    }
    res.json(response);
}));
app.post("/infoforfile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const completion = req.body;
    const _ = yield Recog_1.default.completeRecogniton(completion);
    res.json({ answ: "ok" });
}));
app.get("/results/:file", (req, res) => {
    const result = analisedResults.find(element => element.fname === req.params.file);
    res.json({ result: result });
});
app.post("/uploadfile", upload.single('photo'), function (req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const newrecog = new Recog_1.default((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename);
        const [dbres] = (yield newrecog.save());
        res.json({ name: (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename, id: dbres.insertId });
    });
});
app.post('/error', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, fname } = req.body;
    const _ = yield Recog_1.default.setFailed(fname, error);
    res.json({ status: 'updated' });
}));
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("Started app on port: " + port);
});

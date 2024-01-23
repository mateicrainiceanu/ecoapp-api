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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
class Recog {
    constructor(fname) {
        this.fname = fname;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = `
        INSERT INTO recog (
            fname
        ) VALUES (
            '${this.fname}'
        )`;
            return db_1.db.execute(sql);
        });
    }
    static getFileToAnalise() {
        let sql = `
        SELECT id, fname FROM recog WHERE recognised = 0;
        `;
        return db_1.db.execute(sql);
    }
    static statusWorking(id) {
        let sql = `
        UPDATE recog SET recognised = 1 WHERE id = ${id}
        `;
        db_1.db.execute(sql);
    }
    static completeRecogniton(completion) {
        var _a, _b, _c, _d, _e, _f;
        let sql = `UPDATE recog SET
        recognised = 2,
        recognitionName = '${completion.recognitionName}',
        recognitionConf = ${completion.recognitionConf},
        recognitionConfPrecent = '${completion.recognitionConfPrecent}',
        boxHeigth = ${(_a = completion.box) === null || _a === void 0 ? void 0 : _a.boxHeight},
        boxWidth = ${(_b = completion.box) === null || _b === void 0 ? void 0 : _b.boxWidth},
        boxX = ${(_c = completion.box) === null || _c === void 0 ? void 0 : _c.boxX}, 
        boxY = ${(_d = completion.box) === null || _d === void 0 ? void 0 : _d.boxY},
        midX = ${(_e = completion.box) === null || _e === void 0 ? void 0 : _e.boxMidX},
        midY = ${(_f = completion.box) === null || _f === void 0 ? void 0 : _f.boxMidY} 
        WHERE fname='${completion.fname}';`;
        return db_1.db.execute(sql);
    }
    static setFailed(fname, error) {
        let sql = `
        UPDATE recog SET 
        recognised = 3, error = '${error}'
        WHERE fname = '${fname}'`;
        return db_1.db.execute(sql);
    }
    static getInfoForFile(id) {
        let sql = `
        SELECT * FROM recog
        WHERE id = ${id};
        `;
        return db_1.db.execute(sql);
    }
}
exports.default = Recog;

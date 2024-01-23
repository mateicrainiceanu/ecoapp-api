import { db } from "./db";


interface Box {
    boxHeight: Number,
    boxWidth: Number,
    boxX: Number,
    boxY: Number,
    boxMidX: Number,
    boxMidY: Number
}

interface Recog{
    userKey?: string,
    dateCreated?: Date,
    fname: string,
    recognised?: boolean,
    recognitionName?: string,
    recognitionConf?: number,
    recognitionConfPrecent?: string,
    box?: Box
}

class Recog {
    constructor(fname: string){
        this.fname = fname;
        
    }

    async save() {
        let sql = `
        INSERT INTO recog (
            fname
        ) VALUES (
            '${this.fname}'
        )`

        return db.execute(sql);
    }

    static getFileToAnalise() {
        let sql= `
        SELECT id, fname FROM recog WHERE recognised = 0;
        `
        return db.execute(sql)
    }

    static statusWorking(id: number){
        let sql = `
        UPDATE recog SET recognised = 1 WHERE id = ${id}
        `
        db.execute(sql);
    }

    static completeRecogniton (completion: Recog) {
        let sql = `UPDATE recog SET
        recognised = 2,
        recognitionName = '${completion.recognitionName}',
        recognitionConf = ${completion.recognitionConf},
        recognitionConfPrecent = '${completion.recognitionConfPrecent}',
        boxHeigth = ${completion.box?.boxHeight},
        boxWidth = ${completion.box?.boxWidth},
        boxX = ${completion.box?.boxX}, 
        boxY = ${completion.box?.boxY},
        midX = ${completion.box?.boxMidX},
        midY = ${completion.box?.boxMidY} 
        WHERE fname='${completion.fname}';`

        return db.execute(sql)
    }

    static setFailed(fname: string, error: string) {
        let sql = `
        UPDATE recog SET 
        recognised = 3, error = '${error}'
        WHERE fname = '${fname}'`;

        return db.execute(sql);
    }
}

export default Recog;
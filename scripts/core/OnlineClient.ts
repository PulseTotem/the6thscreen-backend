/**
 * @author Simon Urli <simon@pulsetotem.fr>
 */

class OnlineClient {

    private _socketId : string = "";

    private _profilId : number = -1;

    private _sdiId : number = -1;

    private _ip : string = "";

    private _creationDate = new Date();

    private _hashValue : string = "";

    constructor() {
    }

    public setSocketId(socketId : string) {
        this._socketId = socketId;
    }

    public setProfilId(profilId : number) {
        this._profilId = profilId;
    }

    public setSDIid(SDIid : number) {
        this._sdiId = SDIid;
    }

    public setIp(ip : string) {
        this._ip = ip;
    }

    public setHashValue(hash : string) {
        this._hashValue = hash;
    }

    public getSocketId() : string {
        return this._socketId;
    }

    public getProfilId() : string {
        return this._profilId.toString();
    }

    public getSDIId() : string {
        return this._sdiId.toString();
    }

    public getIP() : string {
        return this._ip;
    }

    public getHash() : string {
        return this._hashValue;
    }

    public getCreationDate() : string {
        return this._creationDate.toDateString();
    }

    public toJSON() : Object {
        return {
            "id": this._socketId,
            "IP": this._ip,
            "profilId": this._profilId,
            "SDIId": this._sdiId,
            "creationDate": this._creationDate,
            "hash": this._hashValue
        };
    }
}
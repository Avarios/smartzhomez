
const IOBROKER_URL = "http://adfnas.local:8093";
const E3DC_DATA_URL = IOBROKER_URL + "/v1/states?filter=e3dc-rscp.0.BAT.*";


type pvData = {
    soc: number,
    asoc: number,
    batteryWatt: number,
    pv: number,
    wallbox: number,
    wallboxIsCharging: boolean,
    house: number,
    external: number
}

type tempSensorData = {

}

type smartHomeData = {
    pvData: pvData,
    temps: tempSensorData
}


interface IoBrokerResponse {
    [key: string]: {
        val: string,
        ack: boolean,
        ts: number,
        q: number,
        from: string,
        user: string,
        lc: number
    };
}


const getSmarthoemData = async (): Promise<smartHomeData> => {

    let data: smartHomeData = {
        pvData: await getIoBrokerDataPV(),
        temps: {

        }
    };
    return data;
}

const getIoBrokerDataPV = async (): Promise<pvData> => {
    let requestResult = await fetch(E3DC_DATA_URL, { headers: { "Access-Control-Allow-Origin": "*" } });
    let jsonResult: IoBrokerResponse = await requestResult.json();
    if (jsonResult === undefined) {
        throw new Error("No data found");
    }
    return {
        asoc: getValueOrDefault<number>("e3dc-rscp.0.BAT.BAT_0.ASOC", jsonResult, 0),
        batteryWatt: getValueOrDefault<number>("e3dc-rscp.0.BAT.BAT_0.ASOC", jsonResult,0),
        external: jsonResult["e3dc-rscp.0.BAT.BAT_0.ASOC"] ? Number.parseFloat(jsonResult["e3dc-rscp.0.BAT.BAT_0.ASOC"].val) : 0,
        house: jsonResult["e3dc-rscp.0.BAT.BAT_0.ASOC"] ? Number.parseFloat(jsonResult["e3dc-rscp.0.BAT.BAT_0.ASOC"].val) : 0,
        pv: jsonResult["e3dc-rscp.0.BAT.BAT_0.ASOC"] ? Number.parseFloat(jsonResult["e3dc-rscp.0.BAT.BAT_0.ASOC"].val) : 0,
        soc: jsonResult["e3dc-rscp.0.BAT.BAT_0.RSOC_REAL"] ? Number.parseFloat(jsonResult["e3dc-rscp.0.BAT.BAT_0.RSOC_REAL"].val) : 0,
        wallbox: jsonResult["e3dc-rscp.0.BAT.BAT_0.ASOC"] ? Number.parseFloat(jsonResult["e3dc-rscp.0.BAT.BAT_0.ASOC"].val) : 0,
        wallboxIsCharging: true //jsonResult["e3dc-rscp.0.BAT.BAT_0.ASOC"] ? jsonResult["e3dc-rscp.0.BAT.BAT_0.ASOC"].val.toLowerCase() === "true" : false,
    }
}

const getValueOrDefault = <T>(key: string, jsonResult: IoBrokerResponse, defaultValue: T): T => {
    return Object.keys(jsonResult).findIndex(x => key === x) > 0 ? jsonResult[key]?.val as T : defaultValue;
}

export {
    getIoBrokerDataPV
}

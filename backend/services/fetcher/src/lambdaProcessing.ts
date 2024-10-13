import {
    AmbientStateEnum, BoilerStateEnum,
    BufferState, EManagerErrorStateEnum, HeatPumpStateEnum, EManagerStateEnum, HeatingCircuitState, HeatPumpOperatingStateEnum, HeatPumpRequestType, IoBrokerResponse, LambdaData, SensorData
} from './models.ts'
import { writeToInfluxDB, mapToRecord } from './influx.ts';

const IOBROKER_URL = Deno.env.get("IOBROKER_URL") || "http://adfnas.local:8093";
const E3DC_DATA_URL = IOBROKER_URL + "/v1/states?filter=e3dc-rscp.0.BAT.*";
const LAMBDA_DATA_URL = IOBROKER_URL + "/v1/states?filter=modbus.0.holdingRegisters.*";
const TEMPSENSOR_DATA_URL = IOBROKER_URL + "/v1/states?filter=mqtt.0.adfhome.Temperature_*"

let lastLambdaResponse: Partial<LambdaData>;
let lastTempData: Array<Partial<SensorData>>;

const IoBrokerToLambdaModel = (iobrokerResponse: IoBrokerResponse): LambdaData => {
    let model: LambdaData = {
        Ambient_State: mapStringToEnum(AmbientStateEnum, iobrokerResponse["modbus.0.holdingRegisters.40002_Ambient_State"].val),
        Ambient_TemperatureCalculated: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.40005_Ambient_Calculated_Temp"].val),
        Boiler_HighTemp: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.42003_Boiler1_ActualHighTemp"].val),
        Boiler_LowTemp: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.42004_Boiler1_ActualLowTemp"].val),
        Boiler_MaxTemp: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.42051_Boiler1_MaximumTemp"].val),
        Boiler_State: mapStringToEnum(BoilerStateEnum, iobrokerResponse["modbus.0.holdingRegisters.42002_Boiler1_OperatingState"].val),
        Buffer_HighTemp: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.43003_Buffer1_ActualHighTemp"].val),
        Buffer_State: mapStringToEnum(BufferState, iobrokerResponse["modbus.0.holdingRegisters.43002_Buffer1_OperatingState"].val),
        Buffer_LowTemp: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.43004_Buffer1_ActualLowTemp"].val),
        Buffer_MaxTemp: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.43051_Buffer1_MaximumTemp"].val),
        EManager_PVPower: Number.parseInt(iobrokerResponse["modbus.0.holdingRegisters.40103_E-Manager_ExcessPower"].val) < 0 ? 0 : Number.parseInt(iobrokerResponse["modbus.0.holdingRegisters.40103_E-Manager_ExcessPower"].val),
        EManager_ActualPower: Number.parseInt(iobrokerResponse["modbus.0.holdingRegisters.40104_E_Manager_Actual"].val),
        EManager_OperatingState: mapStringToEnum(EManagerStateEnum, iobrokerResponse["modbus.0.holdingRegisters.40102_E_Manager_State"].val),
        EManager_PowerSetpoint: Number.parseInt(iobrokerResponse["modbus.0.holdingRegisters.40105_E_Manager_Setpoint"].val),
        HeatingCircuit_1_FlowTemp: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.45003_Heating1_T_Flow"].val),
        HeatingCircuit_1_State: mapStringToEnum(HeatingCircuitState, iobrokerResponse["modbus.0.holdingRegisters.45002_Heating1_OperatingState"].val),
        HeatingCircuit_2_FlowTemp: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.45103_Heating2_T_Flow"].val),
        HeatingCircuit_2_State: mapStringToEnum(HeatingCircuitState, iobrokerResponse["modbus.0.holdingRegisters.45102_Heating2_OperatingState"].val),
        Heatpump_ActualHeatingCapacity: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41012_HP1_QpHeating"].val),
        Heatpump_CompressorRating: Number.parseInt(iobrokerResponse["modbus.0.holdingRegisters.41011_HP1_CompressorRating"].val),
        Heatpump_CurrentCop: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41014_HP1_COP"].val),
        Heatpump_ElectricEnergy: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41021_HP1_VdA_E"].val),
        Heatpump_EnergySourceInletTemp: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41008_HP1_T_EQin"].val),
        Heatpump_ErrorNumber: Number.parseInt(iobrokerResponse["modbus.0.holdingRegisters.41002_HP1_Error"].val),
        Heatpump_ErrorState: mapStringToEnum(EManagerErrorStateEnum, iobrokerResponse["modbus.0.holdingRegisters.41001_HP1_Error_State"].val),
        Heatpump_FlowlineTemp: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41005_HP1_T_Flow"].val),
        Heatpump_HeatEnergy: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41023_HP1_VdA_Q"].val),
        Heatpump_InverterActualPower: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41013_HP1_FI_PowerConsumption"].val),
        Heatpump_OperatingState: mapStringToEnum(HeatPumpOperatingStateEnum, iobrokerResponse["modbus.0.holdingRegisters.41004_HP1_OperatingState"].val),
        Heatpump_RequestFlowTemp: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41017_HP1_RequestT_Flow"].val),
        Heatpump_RequestReturnTemp: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41018_HP1_RequestT_Return"].val),
        Heatpump_RequestTempDiff: Number.parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41019_HP1_RequestT_Diff"].val),
        Heatpump_RequestType: mapStringToEnum(HeatPumpRequestType, iobrokerResponse["modbus.0.holdingRegisters.41016_HP1_RequestType"].val),
        Heatpump_ReturnLineTemp: parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41006_HP1_T_Return"].val),
        Heatpump_State: mapStringToEnum(HeatPumpStateEnum, iobrokerResponse["modbus.0.holdingRegisters.41003_HP1_State"].val),
        Heatpump_VolumeSink: parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41007_HP1_Vol_Sink"].val),
        Heatpump_VolumeSourceFlow: parseFloat(iobrokerResponse["modbus.0.holdingRegisters.41010_HP1_Vol_Source"].val)
    };

    return model
}

const processLambdaData = async (): Promise<void> => {
    if (!IOBROKER_URL) {
        console.error("IOBROKER URL MISSING !")
        throw Error("IOBROKER URL MISSING !");
    }
    const data = await fetch(LAMBDA_DATA_URL);
    const jsonData = await data.json() as IoBrokerResponse;
    const lambdaResult = IoBrokerToLambdaModel(jsonData);
    console.log(lambdaResult);
    if (!lastLambdaResponse) {
        lastLambdaResponse = lambdaResult;
        //writeToInfluxDB("Heating", mapToRecord(lambdaResult));
        console.log(lastLambdaResponse);
    }
    const exceptions = [
        "Heatpump_InverterActualPower",
        "Heatpump_RequestType",
        "Heatpump_OperatingState",
        "Heatpump_State"]
    const changes = getChangedValues(lastLambdaResponse, lambdaResult, exceptions);
    if (changes) {
        console.log("Found Changes: \n", changes);
        //writeToInfluxDB("Heating", mapToRecord(changes));
    }
    lastLambdaResponse = lambdaResult;
}


type valType = {
    [key: string]: string | number | undefined
}

const getChangedValues = (original: valType, updated: valType, exception: Array<string>): valType | undefined => {
    let changes: valType | undefined = undefined;

    for (const key in original) {
        if (exception.includes(key)) {
            if (!changes) {
                changes = {}
            }
            changes[key] = updated[key];
        } else {
            // Check if the key exists in both objects
            if (original.hasOwnProperty(key) && updated.hasOwnProperty(key)) {
                // Compare values
                if (original[key] !== updated[key]) {
                    if (!changes) {
                        changes = {}
                    }
                    changes[key] = updated[key]; // Store the new value
                }
            }
        }

    }

    return changes;
}

const mapStringToEnum = <T>(enumObj: T, value: string): T[keyof T] => {
    const numValue = parseInt(value, 10);
    // @ts-ignore
    return enumObj[numValue];
}

export {
    processLambdaData
}
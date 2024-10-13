
type SensorData = {
    Id:string,
    Battery: number,
    Humidity: number
    Temperature: number
}

type AirQuality = SensorData & {
    PM2: number,
    VOC: number
}

enum AmbientStateEnum {
    OFF,
    AUTOMATIC,
    MANUAL,
    ERROR
}

enum EManagerStateEnum {
    OFF = 0,
    AUTOMATIK = 1,
    MANUAL = 2,
    ERROR = 3,
    OFFLINE = 4
}

enum EManagerErrorStateEnum {
    NONE = 0,
    MESSAGE = 1,
    WARNING = 2,
    ALARM = 3,
    FAULT = 4
}

enum HeatPumpStateEnum {
    INIT = 0,
    REFERENCE = 1,
    RESTART_BLOCK = 2,
    READY = 3,
    START_PUMPS = 4,
    START_COMPRESSOR = 5,
    PRE_REGULATION = 6,
    REGULATION = 7,
    NOT_USED = 8,
    COOLING = 9,
    DEFROSTING = 10,
    STOPPING = 20,
    FAULT_LOCK = 30,
    ALARM_BLOCK = 31,
    ERROR_RESET = 40
}

enum HeatPumpOperatingStateEnum {
    STBY = 0,
    CH = 1,
    DHW = 2,
    CC = 3,
    CIRCULATE = 4,
    DEFROST = 5,
    OFF = 6,
    FROST = 7,
    STBY_FROST = 8,
    NOT_USED = 9,
    SUMMER = 10,
    HOLIDAY = 11,
    ERROR = 12,
    WARNING = 13,
    INFO_MESSAGE = 14,
    TIME_BLOCK = 15,
    RELEASE_BLOCK = 16,
    MINTEMP_BLOCK = 17,
    FIRMWARE_DOWNLOAD = 18
}

enum HeatPumpRequestType {
    NO_REQUEST = 0,
    FLOW_PUMP_CIRCULATION = 1,
    CENTRAL_HEATING = 2,
    CENTRAL_COOLING = 3,
    DOMESTIC_HOT_WATER = 4
}

enum BoilerStateEnum {
    STBY = 0,
    DHW = 1,
    LEGIO = 2,
    SUMMER = 3,
    FROST = 4,
    HOLIDAY = 5,
    PRIO_STOP = 6,
    ERROR = 7,
    OFF = 8,
    PROMPT_DHW = 9,
    TRAILING_STOP = 10,
    TEMP_LOCK = 11,
    STBY_FROST = 12
}

enum BufferState {
    STBY = 0,
    HEATING = 1,
    COOLING = 2,
    SUMMER = 3,
    FROST = 4,
    HOLIDAY = 5,
    PRIO_STOP = 6,
    ERROR = 7,
    OFF = 8,
    STBY_FROST = 9
}

enum HeatingCircuitState {
    HEATING = 0,
    ECO = 1,
    COOLING = 2,
    FLOORDRY = 3,
    FROST = 4,
    MAX_TEMP = 5,
    ERROR = 6,
    SERVICE = 7,
    HOLIDAY = 8,
    CH_SUMMER = 9,
    CC_WINTER = 10,
    PRIO_STOP = 11,
    OFF = 12,
    RELEASE_OFF = 13,
    TIME_OFF = 14,
    STBY = 15,
    STBY_HEATING = 16,
    STBY_ECO = 17,
    STBY_COOLING = 18,
    STBY_FROST = 19,
    STBY_FLOORDRY = 20
}

type LambdaData = {
    Ambient_State: AmbientStateEnum
    Ambient_TemperatureCalculated: number
    EManager_OperatingState: EManagerStateEnum
    EManager_ActualPower: number
    EManager_PVPower:number,
    EManager_PowerSetpoint: number
    Heatpump_ErrorState: EManagerErrorStateEnum
    Heatpump_ErrorNumber: number
    Heatpump_State: HeatPumpStateEnum
    Heatpump_OperatingState: HeatPumpOperatingStateEnum
    Heatpump_FlowlineTemp: number
    Heatpump_ReturnLineTemp: number
    Heatpump_VolumeSink: number
    Heatpump_EnergySourceInletTemp: number
    Heatpump_VolumeSourceFlow: number
    Heatpump_CompressorRating: number
    Heatpump_ActualHeatingCapacity: number
    Heatpump_InverterActualPower: number
    Heatpump_CurrentCop: number
    Heatpump_RequestType: HeatPumpRequestType
    Heatpump_RequestFlowTemp: number
    Heatpump_RequestReturnTemp: number
    Heatpump_RequestTempDiff: number
    Heatpump_ElectricEnergy: number
    Heatpump_HeatEnergy: number
    Boiler_State: BoilerStateEnum
    Boiler_HighTemp: number
    Boiler_LowTemp: number
    Boiler_MaxTemp: number
    Buffer_State: BufferState
    Buffer_HighTemp: number
    Buffer_LowTemp: number
    Buffer_MaxTemp: number
    HeatingCircuit_1_State: HeatingCircuitState
    HeatingCircuit_2_State: HeatingCircuitState
    HeatingCircuit_1_FlowTemp: number
    HeatingCircuit_2_FlowTemp: number
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

export type {
    IoBrokerResponse,
    LambdaData,
    AirQuality,
    SensorData
}

export {
    BoilerStateEnum,
    HeatingCircuitState,
    HeatPumpOperatingStateEnum,
    EManagerErrorStateEnum,
    HeatPumpStateEnum,
    EManagerStateEnum,
    AmbientStateEnum,
    BufferState,
    HeatPumpRequestType
}
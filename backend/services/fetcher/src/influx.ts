import { InfluxDB, Point } from '@influxdata/influxdb-client'

const INFLUXDB_TOKEN = Deno.env.get("INFLUXDB_TOKEN") || "http://adfnas.local";
const INFLUXDB_URL = Deno.env.get("INFLUXDB_URL");
const ORG_NAME = "adf";
const BUCKETNAME = "smarthome";

async function writeToInfluxDB(
  measurement: string,
  fields: Record<string, number | string | boolean>
): Promise<void> {
  if(!INFLUXDB_TOKEN || !INFLUXDB_URL) {
    console.error("URL or Token for influx missing !")
    throw Error("URL or Token for influx missing !")
  }
  const client = new InfluxDB({ url: INFLUXDB_URL, token: INFLUXDB_TOKEN })
  const writeApi = client.getWriteApi(ORG_NAME, BUCKETNAME)

  const point = new Point(measurement)

  // Add fields
  Object.entries(fields).forEach(([key, value]) => {
    if (typeof value === 'number') {
      point.floatField(key, value)
    } else if (typeof value === 'boolean') {
      point.booleanField(key, value)
    } else {
      point.stringField(key, value)
    }
  })

  writeApi.writePoint(point)
  await writeApi.close()
}

function mapToRecord(input: object): Record<string, number | string | boolean> {
  const result: Record<string, number | string | boolean> = {};

  for (const [key, value] of Object.entries(input)) {
      if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
          result[key] = value;
      }
  }

  return result;
}

export {
  writeToInfluxDB,
  mapToRecord
}
//EXAMPLE:
/* await writeToInfluxDB
    'temperature',
    { location: 'room1' },
    { value: 22.5, unit: 'celsius' }
  )
    */
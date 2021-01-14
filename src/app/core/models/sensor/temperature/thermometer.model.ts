import { Sensor } from '../sensor.model';

export class Thermometer extends Sensor {
  constructor(
    public celsius: number,
    public id: number,
    public name: string,
    public sensor: string
  ) {
    super(id, name)
  }
}
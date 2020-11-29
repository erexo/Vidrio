import { Sensor } from '../sensor/sensor.model';

export class Blind extends Sensor {
  constructor(
    public id: number,
    public inputDownPin: number,
    public inputUpPin: number,
    public name: string,
    public outputDownPin: number,
    public outputUpPin: number
  ) {
    super(id, name)
  }
}
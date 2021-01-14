import { Sensor } from '../sensor.model';

export class Light extends Sensor {
  constructor(
    public id: number,
    public inputPin: number,
    public name: string,
    public outputPin: number,
    public position: boolean
  ) {
    super(id, name)
  }
}
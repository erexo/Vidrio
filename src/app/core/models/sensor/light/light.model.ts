import { Sensor } from '../sensor.model';

export class Light extends Sensor {
  constructor(
    public id: number,
    public inputpin: number,
    public name: string,
    public outputpin: number,
    public position: boolean
  ) {
    super(id, name)
  }
}
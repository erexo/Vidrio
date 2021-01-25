import { Sensor } from '@core/models/sensor/sensor.model';

export class Blind extends Sensor {
  constructor(
    public id: number,
    public inputdownpin: number,
    public inputuppin: number,
    public name: string,
    public outputdownpin: number,
    public outputuppin: number
  ) {
    super(id, name)
  }
}
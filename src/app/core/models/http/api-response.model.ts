import { HTTPStatusCode } from '@core/enums/http/http-status-code.enum';

export class APIResponse<T> {
  constructor(
    public body: T,
    public status: HTTPStatusCode
  ) {}
}
export class SuccessResult<T> {
  result: T;
  success: boolean;
  code = 200;
  constructor(result: T) {
    this.success = true;
    this.result = result;
  }
}

export class FialResult {
  success = false;
  message: string;
  code: number;
  result = null;
  constructor(msg: string, code: number) {
    this.message = msg;
    this.code = code;
  }
}

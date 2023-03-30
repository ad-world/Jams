export enum Status {
  SUCCESS = "sucess",
  FAIL = "fail",
}

export type GenericResponse<T> = {
  status: Status;
  data?: T | null;
  message?: string;
};

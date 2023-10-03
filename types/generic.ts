export enum Status {
  SUCCESS = "success",
  FAIL = "fail",
}

export type GenericResponse<T> = {
  status: Status;
  data?: T | null;
  message?: string;
};

export type NavConfig = {
  title: string;
  href: string;
}
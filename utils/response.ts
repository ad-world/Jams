import { GenericResponse, Status } from "@/types/generic";

export function buildGenericResponse<T>({
  status,
  data,
  message,
}: {
  status: Status;
  data?: T | null;
  message?: string;
}): GenericResponse<T> {
  return status === Status.SUCCESS
    ? {
        status,
        data: data ?? null,
      }
    : {
        status,
        message: message ?? "Undefined error",
      };
}

import {
  ArgsProps,
  NotificationInstance,
} from "antd/es/notification/interface";
import { AxiosError } from "axios";

export function HandleError(
  notification: NotificationInstance,
  config?: Partial<ArgsProps>
) {
  return function (err: AxiosError<{ errors?: string[] }>) {
    if (err.response?.data.errors?.length) {
      err.response.data.errors.forEach((err) =>
        notification.error({
          message: err,
          placement: "bottomLeft",
          ...config,
        })
      );
    } else {
      notification.error({
        message: err.message ?? "An error occurred, please try again later",
        placement: "bottomLeft",
        ...config,
      });
    }
  };
}

import React from "react";
import FlipNumbers from "react-flip-numbers";
import useSWR from "swr";
import { axiosInstance } from "util/axios";

export function TuitCoinCounter() {
  const { data } = useSWR(
    "/tuit",
    (url) =>
      axiosInstance.default.get<{ tuit: number }>(url).then((res) => res.data),
    { refreshInterval: 5000 }
  );

  return (
    <FlipNumbers
      height={40}
      width={40}
      color="white"
      play
      numbers={String(data?.tuit ?? 1000000)}
    />
  );
}

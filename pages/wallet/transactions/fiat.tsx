import { Result, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React from "react";
import useSWR from "swr";
import { ApiFiatTransaction, ApiPagination } from "types";
import { axiosInstance } from "util/axios";
import { FormatCurrency } from "util/functions";

export function FiatTransactions() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const { data, error, isLoading } = useSWR(
    `/api/transactions/fiat?page=${page}&limit=${pageSize}`,
    (url) =>
      axiosInstance.user
        .get<ApiPagination<ApiFiatTransaction>>(url)
        .then((res) => res.data)
  );

  if (error) {
    return (
      <Result
        style={{ width: "100%" }}
        status="error"
        title="An unexpected error has occurred, please reload the page"
      />
    );
  }

  const columns: ColumnsType<ApiFiatTransaction> = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, t) => <>{FormatCurrency(t.amount)} USD</>,
    },
    {
      title: "Description",
      dataIndex: "comments",
      key: "comments",
      render: (_, t) => t.comments.join(", "),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "fundsTransferType",
      render: (_, t) => <Tag>{t.fundsTransferType.toUpperCase()}</Tag>,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, t) =>
        `${dayjs(t.createdAt).format("MMMM DD, YYYY")} at ${dayjs(
          t.createdAt
        ).format("hh:mm A")}`,
    },
  ];

  return (
    <Table
      loading={isLoading || !data}
      style={{ width: "100%" }}
      rowKey={(t) => t.id}
      bordered
      dataSource={data?.data}
      columns={columns}
      pagination={{
        current: page,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 15, 20, 25],
        pageSize: data?.limit,
        total: data?.totalPage,
        onChange: (_page, _size) => {
          if (page !== _page) {
            setPage(_page);
          }

          if (pageSize !== _size) {
            setPageSize(_size);
          }
        },
      }}
      scroll={{ x: 800 }}
    />
  );
}

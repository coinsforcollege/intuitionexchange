import { Button, Result, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { NotificationContext } from "context/notification";
import dayjs from "dayjs";
import React from "react";
import useSWR from "swr";
import { ApiAssetTransfer, ApiPagination, TransferType } from "types";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";
import { FormatCurrency } from "util/functions";

export function AssetTransfers() {
  const { api: notification } = React.useContext(NotificationContext);

  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const { data, error, isLoading, mutate } = useSWR(
    `/api/transfers/asset?page=${page}&limit=${pageSize}`,
    (url) =>
      axiosInstance.user
        .get<ApiPagination<ApiAssetTransfer>>(url)
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

  const retry = async (id: string) => {
    setLoading(true);

    await axiosInstance.user
      .post<{ message: string }>(`/api/transfers/asset/${id}/retry`)
      .then((resp) => {
        notification.success({ message: resp.data.message });
      })
      .catch(HandleError(notification));

    mutate();
    setLoading(false);
  };

  const cancel = async (id: string) => {
    setLoading(true);

    await axiosInstance.user
      .post<{ message: string }>(`/api/transfers/asset/${id}/cancel`)
      .then((resp) => {
        notification.success({ message: resp.data.message });
      })
      .catch(HandleError(notification));

    mutate();
    setLoading(false);
  };

  const columns: ColumnsType<ApiAssetTransfer> = [
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, t) => (
        <>
          {dayjs(t.createdAt).format("MMMM DD, YYYY")} at
          {dayjs(t.createdAt).format("hh:mm A")}{" "}
          <Tag
            color={
              t.transferType === TransferType.Contribution ? "green" : "red"
            }
          >
            {t.transferType === TransferType.Contribution
              ? "Deposit"
              : "Withdrawal"}
          </Tag>
        </>
      ),
    },
    {
      align: "center",
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, t) => (
        <>
          {FormatCurrency(t.unitCount)} {t.assetCode}
        </>
      ),
    },
    {
      align: "center",
      title: "Network",
      dataIndex: "network",
      key: "network",
      render: (_, t) => <Tag>{t.assetTransferType.toUpperCase()}</Tag>,
    },
    {
      align: "center",
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, t) => (
        <>
          <Tag
            style={{ background: "none", textTransform: "capitalize" }}
            bordered={false}
            color={
              t.status === "settled"
                ? "green"
                : t.status === "pending"
                ? "yellow"
                : "red"
            }
          >
            {t.status}
          </Tag>
        </>
      ),
    },
    {
      align: "center",
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, t) => (
        <>
          {t.transferType === TransferType.Disbursement &&
          t.status === "pending" ? (
            <Space>
              {t.disbursementStatus === "authorized" ? (
                <Tag color="green">Authorized</Tag>
              ) : (
                <Button
                  type="primary"
                  disabled={
                    t.status !== "pending" ||
                    t.disbursementStatus === "authorized"
                  }
                  onClick={() => retry(t.id)}
                >
                  Resend Authorization Email
                </Button>
              )}
              <Button
                type="primary"
                danger
                disabled={t.status !== "pending"}
                onClick={() => cancel(t.id)}
              >
                Cancel
              </Button>
            </Space>
          ) : (
            "-"
          )}
        </>
      ),
    },
  ];

  return (
    <Table
      loading={isLoading || !data || loading}
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
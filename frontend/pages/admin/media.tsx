import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import {
  Table,
  Button,
  Space,
  message,
  Upload,
  Modal,
  Typography,
  Input,
  Card,
  Image,
  Tooltip,
  Popconfirm,
  Tag,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  FileOutlined,
  FileImageOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  SoundOutlined,
  ReloadOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { listMedia, uploadMedia, deleteMediaFile, MediaFile } from '@/services/api/admin';

const { Text, Paragraph } = Typography;
const { Dragger } = Upload;

// Helper to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// API base URL for resolving upload paths
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace('/api', '');

// Get full URL for a file - uses API base for /api/ paths
function getFullUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/api/')) return `${API_BASE}${url}`;
  // Fallback for legacy paths
  if (typeof window !== 'undefined') return `${window.location.origin}${url}`;
  return url;
}

// Get icon for file type
function getFileIcon(type: string) {
  switch (type) {
    case 'image':
      return <FileImageOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
    case 'video':
      return <VideoCameraOutlined style={{ fontSize: 24, color: '#722ed1' }} />;
    case 'audio':
      return <SoundOutlined style={{ fontSize: 24, color: '#13c2c2' }} />;
    case 'document':
      return <FileTextOutlined style={{ fontSize: 24, color: '#fa8c16' }} />;
    default:
      return <FileOutlined style={{ fontSize: 24, color: '#8c8c8c' }} />;
  }
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listMedia();
      if (response.success) {
        setFiles(response.files);
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (fileList: File[]) => {
    if (fileList.length === 0) return;

    setUploading(true);
    try {
      const response = await uploadMedia(fileList);
      if (response.success) {
        message.success(response.message);
        fetchFiles();
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      const response = await deleteMediaFile(filename);
      if (response.success) {
        message.success('File deleted');
        setFiles((prev) => prev.filter((f) => f.filename !== filename));
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to delete file');
    }
  };

  const handleCopyUrl = (url: string) => {
    const fullUrl = getFullUrl(url);
    navigator.clipboard.writeText(fullUrl);
    message.success('URL copied to clipboard');
  };

  const handlePreview = (file: MediaFile) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  // Custom upload props
  const uploadProps: UploadProps = {
    multiple: true,
    showUploadList: false,
    beforeUpload: (file, fileList) => {
      // Collect all files and upload together
      if (fileList.indexOf(file) === fileList.length - 1) {
        handleUpload(fileList as unknown as File[]);
      }
      return false; // Prevent default upload
    },
  };

  const columns = [
    {
      title: 'Preview',
      dataIndex: 'filename',
      key: 'preview',
      width: 80,
      render: (filename: string, record: MediaFile) => (
        <div
          style={{
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            borderRadius: 4,
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={() => handlePreview(record)}
        >
          {record.type === 'image' ? (
            <img
              src={getFullUrl(record.url)}
              alt={filename}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            getFileIcon(record.type)
          )}
        </div>
      ),
    },
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
      render: (filename: string, record: MediaFile) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ wordBreak: 'break-all' }}>
            {filename}
          </Text>
          <Tag color={record.type === 'image' ? 'blue' : record.type === 'video' ? 'purple' : 'default'}>
            {record.type}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url: string) => (
        <Space>
          <Text
            copyable={{
              text: getFullUrl(url),
              tooltips: ['Copy URL', 'Copied!'],
            }}
            style={{ maxWidth: 200 }}
            ellipsis
          >
            {url}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Uploaded',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) =>
        new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: MediaFile) => (
        <Space>
          <Tooltip title="Preview">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="Copy URL">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCopyUrl(record.url)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this file?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.filename)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Media Manager - Admin - InTuition Exchange</title>
      </Head>
      <AdminLayout selectedKey="media">
        {/* Upload Area */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Dragger {...uploadProps} disabled={uploading}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag files to upload
            </p>
            <p className="ant-upload-hint">
              Upload multiple files at once. Any file type, no size limit.
            </p>
          </Dragger>
        </Card>

        {/* Actions Bar */}
        <Space style={{ marginBottom: 16 }}>
          <Upload {...uploadProps} disabled={uploading}>
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload Files
            </Button>
          </Upload>
          <Button icon={<ReloadOutlined />} onClick={fetchFiles}>
            Refresh
          </Button>
          <Text type="secondary">{files.length} file(s)</Text>
        </Space>

        {/* Files Table */}
        <Table
          columns={columns}
          dataSource={files}
          loading={loading}
          rowKey="filename"
          pagination={{
            showSizeChanger: true,
            showTotal: (t) => `Total ${t} files`,
            defaultPageSize: 20,
          }}
        />

        {/* Preview Modal */}
        <Modal
          title="File Details"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={[
            <Button key="copy" icon={<CopyOutlined />} onClick={() => previewFile && handleCopyUrl(previewFile.url)}>
              Copy URL
            </Button>,
            <Button key="close" type="primary" onClick={() => setPreviewVisible(false)}>
              Close
            </Button>,
          ]}
          width={700}
        >
          {previewFile && (
            <div>
              {/* Preview */}
              <div
                style={{
                  marginBottom: 16,
                  textAlign: 'center',
                  background: '#f5f5f5',
                  padding: 16,
                  borderRadius: 8,
                  minHeight: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {previewFile.type === 'image' ? (
                  <Image
                    src={getFullUrl(previewFile.url)}
                    alt={previewFile.filename}
                    style={{ maxHeight: 400 }}
                  />
                ) : previewFile.type === 'video' ? (
                  <video
                    src={getFullUrl(previewFile.url)}
                    controls
                    style={{ maxWidth: '100%', maxHeight: 400 }}
                  />
                ) : previewFile.type === 'audio' ? (
                  <audio src={getFullUrl(previewFile.url)} controls />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    {getFileIcon(previewFile.type)}
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">Preview not available</Text>
                    </div>
                  </div>
                )}
              </div>

              {/* File Details */}
              <Card size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary">Filename:</Text>
                    <br />
                    <Text strong>{previewFile.filename}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Type:</Text>
                    <br />
                    <Tag>{previewFile.type}</Tag>
                  </div>
                  <div>
                    <Text type="secondary">Size:</Text>
                    <br />
                    <Text>{formatFileSize(previewFile.size)}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Full URL:</Text>
                    <br />
                    <Paragraph
                      copyable
                      style={{ margin: 0, background: '#f5f5f5', padding: 8, borderRadius: 4 }}
                    >
                      {getFullUrl(previewFile.url)}
                    </Paragraph>
                  </div>
                  <div>
                    <Text type="secondary">Uploaded:</Text>
                    <br />
                    <Text>
                      {new Date(previewFile.createdAt).toLocaleString()}
                    </Text>
                  </div>
                </Space>
              </Card>
            </div>
          )}
        </Modal>
      </AdminLayout>
    </>
  );
}


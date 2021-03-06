import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Space, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage, formatMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormList,
  ProFormGroup,
  ProFormDigit,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule } from '@/services/ant-design-pro/api';
import { getOrders, createOrder, updateOrder, removeOrder } from '@/services/order/api';
import { EditOutlined } from '@ant-design/icons';
import { format } from '@/utils';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await createOrder({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  const sss = await removeOrder({
    key: selectedRows.map((row) => row.key),
  });
  console.log('selectedRows', selectedRows);
  try {
    await removeOrder({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const form = (
    <>
      <ProFormText label={formatMessage({ id: 'pages.order.orderName' })} name="id" hidden />
      <ProFormText
        label={formatMessage({ id: 'pages.order.orderName' })}
        rules={[
          {
            required: true,
            message: <FormattedMessage id="pages.order.orderName" />,
          },
        ]}
        name="name"
      />
      <ProFormText
        label={formatMessage({ id: 'pages.order.customerName' })}
        rules={[
          {
            required: true,
            message: <FormattedMessage id="pages.order.customerName" />,
          },
        ]}
        name="customer"
      />
      <ProFormList
        name="products"
        label={formatMessage({ id: 'pages.order.product' })}
        copyIconProps={{
          tooltipText: 'Sao chép',
        }}
        deleteIconProps={{
          tooltipText: 'Xoá',
        }}
        creatorButtonProps={{
          position: 'bottom',
          creatorButtonText: 'Thêm mới',
        }}
      >
        <ProFormGroup>
          <ProFormText
            width="xs"
            name="name"
            label={formatMessage({ id: 'pages.order.productName' })}
          />
          <ProFormDigit width="xs" name="quantity" label="Số lượng" />
          <ProFormDigit width="xs" name="priceInput" label="Giá nhập" />
          <ProFormDigit width="xs" name="priceOutput" label="Giá xuất" />
        </ProFormGroup>
      </ProFormList>
    </>
  );

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: <FormattedMessage id="pages.order.orderId" />,
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.order.orderId" />,
      dataIndex: 'orderId',
    },
    {
      title: <FormattedMessage id="pages.order.orderName" />,
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id="pages.order.customerName" />,
      dataIndex: 'customer',
      // valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.order.total" />,
      dataIndex: 'totalAmountOutput',
      renderText: (text) => {
        return `${format.currency(text)} đ`;
      },
    },
    {
      title: <FormattedMessage id="pages.order.createDate" />,
      dataIndex: 'createDate',
      valueType: 'dateTime',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <ModalForm<{
            name: string;
            company: string;
          }>
            title="Sửa đơn hàng"
            trigger={
              <Button type="dashed" size="small">
                <EditOutlined />
                Sửa
              </Button>
            }
            initialValues={record}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log('run'),
            }}
            onFinish={async (values) => {
              const res = await updateOrder(values);
              if (res.code === 1) {
                message.success(formatMessage({ id: 'pages.order.message.edit.success' }));
                actionRef?.current?.reload();
                return true;
              } else {
                message.error(formatMessage({ id: 'pages.order.message.edit.fail' }));
              }
            }}
          >
            {form}
          </ModalForm>
          <Popconfirm
            title="Title"
            // visible={visible}
            onConfirm={async () => {
              const res = await removeOrder(record);
              if (res.code === 1) {
                message.success(formatMessage({ id: 'pages.order.message.delete.success' }));
                actionRef?.current?.reload();
              } else {
                message.error(formatMessage({ id: 'pages.order.message.delete.fail' }));
              }
            }}
            // onCancel={handleCancel}
          >
            <Button type="primary">Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.order.orderListing',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (
          // The first parameter params is the combination of the query form and params parameters
          // The first parameter will always have pageSize and current, which are antd specifications
          params: T & {
            pageSize: number;
            current: number;
          },
          sort,
          filter,
        ) => {
          // Here you need to return a Promise, and you can transform the data before returning it
          // If you need to transform the parameters you can change them here
          const msg = await getOrders({
            limit: params.pageSize,
            page: params.current,
          });
          return {
            data: msg.results,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.order.createNew',
        })}
        width="620px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        {form}
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;

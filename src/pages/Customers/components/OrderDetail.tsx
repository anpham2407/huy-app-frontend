import React from 'react';
import {
  Button,
  message,
  Input,
  Drawer,
  Space,
  Popconfirm,
  Descriptions,
  PageHeader,
  Paragraph,
  Row,
  List,
  Table,
  Col,
} from 'antd';

export type UpdateFormProps = {
  updateModalVisible: boolean;
};

const OrderDetail: React.FC<UpdateFormProps> = (props) => {
  const { data } = props;
  console.log('props', props);
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Giá nhập',
      dataIndex: 'priceInput',
    },
    {
      title: 'Giá xuất',
      dataIndex: 'priceOutput',
    },
  ];

  return (
    <div>
      <PageHeader
        ghost={false}
        // onBack={() => window.history.back()}
        title={data?.orderId}
        subTitle={data?.name}
        extra={[
          <Button key="3">In</Button>,
          <Button key="2">Báo giá</Button>,
          <Button key="1" type="primary">
            Xuất hoá đơn
          </Button>,
        ]}
      >
        <Descriptions size="small" column={4}>
          <Descriptions.Item label="Khách hàng" span={2}>
            {data?.customer}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo" span={2}>
            {data?.createDate}
          </Descriptions.Item>
        </Descriptions>

        <Table
          columns={columns}
          dataSource={data?.products}
          size="small"
          bordered
          pagination={false}
          style={{ marginTop: 20 }}
        />

        <table style={{ marginTop: 10, marginLeft: 'auto', border: '1px solid gray' }}>
          <tbody className="ant-table-tbody">
            <tr className="ant-table-row ant-table-row-level-0">
              <td className="ant-table-cell">Lợi nhuận sau thuế:</td>
              <td className="ant-table-cell">
                <b>{data?.profitAfterTaxes}</b>
              </td>
            </tr>
            <tr className="ant-table-row ant-table-row-level-0">
              <td className="ant-table-cell">Lợi nhuận trước thuế:</td>
              <td className="ant-table-cell">
                <b>{data?.profitBeforeTaxes}</b>
              </td>
            </tr>
            <tr className="ant-table-row ant-table-row-level-0">
              <td className="ant-table-cell">Tổng tiền nhập:</td>
              <td className="ant-table-cell">
                <b>{data?.totalAmountInput}</b>
              </td>
            </tr>
            <tr className="ant-table-row ant-table-row-level-0">
              <td className="ant-table-cell">Tổng tiền xuất:</td>
              <td className="ant-table-cell">
                <b>{data?.totalAmountOutput}</b>
              </td>
            </tr>
            <tr className="ant-table-row ant-table-row-level-0">
              <td className="ant-table-cell">Tổng tiền sau thưế:</td>
              <td className="ant-table-cell">
                <b>{data?.totalAmountAfterTaxes}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </PageHeader>
    </div>
  );
};

export default OrderDetail;

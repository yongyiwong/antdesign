import React, { useRef } from 'react';
import { useIntl } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import { Button, Divider, Form, Input, Select, Space } from "antd";
import { useHistory } from "react-router-dom";
import ProCard from '@ant-design/pro-card';
import { plusOutlined, searchOutlined } from '@/rules/outlined';
import { Option } from 'rc-select';
import { getOwners } from '@/services/gbo/owners';
import { SortOrder } from 'antd/lib/table/interface';
import OwnerStyles from './styles/owners.less';

const TableList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const history = useHistory();

    /**
     * @en-US International configuration
     * @zh-CN 国际化配置
     * */

    const columns: ProColumns<API.OwnerRecord>[] = [
        {
            title: 'Username',
            dataIndex: 'username',
            sorter: true,
        },
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true,
        },
        {
            title: 'Last Login Time/Last Login IP',
            dataIndex: 'lastLogin',
            sorter: true,
            valueType: 'dateTime',
        },
        {
            title: 'Actions',
            key: 'option',
            valueType: 'option',
            render: () => [
                <Space split={<Divider type="vertical" />}>
                    <a key="link" onClick={() => {
                        history.push('/owners/detail');
                    }}>View</a>
                    <a key="link2" onClick={() => {
                        history.push('/owners/detail');
                    }}>Edit</a>
                </Space>
            ],
        },
    ];

    const onFinish = (values: any) => {
    }

    const requestOwners = async ({ params, sort, filter }: { params: API.RequestParams, sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null> }) => {
        const requestParams = {
            page: params && params.current ? params.current : 1,
            limit: params && params.pageSize ? params.pageSize : 20,
        }
        const result = await getOwners(requestParams);
        return result;
    }
    return (
        <PageContainer>
            <ProCard className={OwnerStyles.marginBottom}>
                <ProForm.Group>
                    <Button
                        type="primary"
                        size="middle"
                        onClick={() => history.push(`/owners/add`)}
                        icon={plusOutlined}
                    >
                        Add Platform Owners
                    </Button>
                </ProForm.Group>
            </ProCard>
            <ProCard>
                <Form name="owners" layout="inline" onFinish={onFinish}>
                    <Form.Item name="userQuery" label="Username：">
                        <Input placeholder="Please enter a name" suffix={searchOutlined} style={{ minWidth: "140px" }} />
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                        <Select placeholder="ALL">
                            <Option value="ALL">ALL</Option>
                            <Option value="active">Active</Option>
                            <Option value="active">Inactive</Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" size="middle" htmlType="submit">
                        Search
                    </Button>
                    <Button size="middle" style={{ margin: '0 8px' }}>
                        Clear
                    </Button>
                </Form>
            </ProCard>
            <ProCard>
                <ProTable<API.OwnerRecord>
                    actionRef={actionRef}
                    rowKey="id"
                    request={async (params = {}, sort, filter) => {
                        console.log(params, sort, filter);
                        return requestOwners({ params, sort, filter });
                    }}
                    columns={columns}
                    toolBarRender={false}
                    search={false}
                />
            </ProCard>
        </PageContainer>
    );
};

export default TableList;

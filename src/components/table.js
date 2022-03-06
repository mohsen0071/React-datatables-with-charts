import React from "react";
import { Table } from "antd";
import PropTypes from "prop-types";

let uniqueId = 0;

const columns = [
    {
        title: "HOTEL",
        dataIndex: "HOTEL",
        key: "HOTEL",
        fixed: "left",
        width: 100,
    },
    {
        title: "BUSINESS_DATE",
        dataIndex: "BUSINESS_DATE",
        key: "BUSINESS_DATE",
    },
    {
        title: "NIGHTS",
        dataIndex: "NIGHTS",
        key: "NIGHTS",
    },
    {
        title: "REVENUE",
        dataIndex: "REVENUE",
        key: "REVENUE",
    },
    {
        title: "COUNTRY",
        dataIndex: "COUNTRY",
        key: "COUNTRY",
    },
];
const Datatable = ({ data }) => {
    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5, showSizeChanger: false }}
            scroll={{ x: 700 }}
            rowKey={(record) => {
                if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
                return record.__uniqueId;
            }}
        />
    );
};

Datatable.propTypes = {
    data: PropTypes.array.isRequired,
};

export default Datatable;

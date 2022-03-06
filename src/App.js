import React, { useState } from "react";
import { Layout, Row, Col } from "antd";
import { get } from "lodash";
import dataOfHotels from "./initData/BusinessByCountry.json";
import Datatable from "./components/table";
import Chart from "./components/chart";
import SearchForm from "./components/searchForm";

const { Content } = Layout;

const App = () => {
    const [showChart, setShowChart] = useState(false);
    const [data, setData] = useState(
        get(dataOfHotels, "BusinessByCountry", [])
    );
    const [dataFiltered, setDataFiltered] = useState(data);

    const handleSearch = (data) => {
        setShowChart(false);
        setDataFiltered(data);
        setShowChart(true);
    };

    return (
        <Layout>
            <Content style={{ margin: "24px 16px 0" }}>
                <Row>
                    <Col span={24}>
                        <SearchForm data={data} onChange={handleSearch} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Datatable data={dataFiltered} />
                    </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <Col span={24}>
                        {showChart && <Chart data={dataFiltered} />}
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default App;

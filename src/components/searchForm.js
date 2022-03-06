import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Row, Col, DatePicker, Select, Form, Button } from "antd";
import moment from "moment";
import { getISOWeekDates, getDaysInMonth } from "../helpers/getDates";
import { map, orderBy } from "lodash";

const { Option } = Select;

const SearchForm = ({ data, onChange }) => {
    const [form] = Form.useForm();
    const [type, setType] = useState("date");
    const [hotels, setHotels] = useState([]);
    const [countries, setCountries] = useState([]);
    const [dateString, setDateString] = useState("");

    useEffect(() => {
        getHotelsAndCountries();
    }, []);

    const getHotelsAndCountries = () => {
        let Hotels = [];
        let Countries = [];
        map(data, (item) => {
            Hotels.push(item.HOTEL);
            Countries.push(item.COUNTRY);
        });
        setHotels([...new Set(Hotels)]);
        setCountries([...new Set(Countries)]);
    };

    const filterData = (filter) => {
        const { hotel, bussinessDate, country } = filter;

        let startDate = null;
        let endDate = null;
        let year = dateString.split("-")[0];

        if (type === "date") {
            startDate = moment(bussinessDate).format("YYYY-MM-DD");
            endDate = moment(bussinessDate).format("YYYY-MM-DD");
        } else if (type === "week") {
            let weekNumber = dateString.split("-")[1];
            weekNumber = weekNumber.match(/\d+/g);
            let daysOfWeek = getISOWeekDates(weekNumber[0], year);
            startDate = moment(daysOfWeek[0]).format("YYYY-MM-DD");
            endDate = moment(daysOfWeek[6]).format("YYYY-MM-DD");
        } else if (type === "month") {
            let monthNumber = dateString.split("-")[1];
            let endNumberOfMonth = getDaysInMonth(monthNumber, year);
            startDate = moment(`${dateString}-01`).format("YYYY-MM-DD");
            endDate = moment(`${dateString}-${endNumberOfMonth}`).format(
                "YYYY-MM-DD"
            );
        }

        let selectedFilter = [];
        let filters = {
            hotel: (item) => item.HOTEL === hotel,
            country: (item) => item.COUNTRY === country,
            bussinessDate: (item) =>
                Date.parse(item.BUSINESS_DATE) >= Date.parse(startDate) &&
                Date.parse(item.BUSINESS_DATE) <= Date.parse(endDate),
        };
        if (hotel) selectedFilter.push(filters.hotel);
        if (country) selectedFilter.push(filters.country);
        if (bussinessDate) selectedFilter.push(filters.bussinessDate);

        let filteredData = data.filter((item) =>
            selectedFilter.every((f) => f(item))
        );

        onChange(orderBy(filteredData, ["BUSINESS_DATE"], ["asc"]));
    };
    const onReset = () => {
        onChange(data);
        form.resetFields();
    };
    return (
        <Form
            form={form}
            onFinish={filterData}
            initialValues={{
                ["type"]: type,
            }}
        >
            <Row
                gutter={[
                    { xs: 8, sm: 8, md: 8, lg: 16 },
                    { xs: 0, sm: 16, md: 0, lg: 32 },
                ]}
            >
                <Col xxl={4} lg={4} md={6} xs={12}>
                    <Form.Item
                        label="Hotels"
                        name="hotel"
                        rules={[{ required: true }]}
                    >
                        <Select showSearch allowClear>
                            {hotels.map((item, index) => (
                                <Option key={index} value={item}>
                                    {item}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xxl={4} lg={4} md={5} xs={12}>
                    <Form.Item label="Country" name="country">
                        <Select showSearch allowClear>
                            {countries.map((item, index) => (
                                <Option key={index} value={item}>
                                    {item}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xxl={4} lg={4} md={5} xs={12}>
                    <Form.Item label="Date by" name="type">
                        <Select onChange={setType}>
                            <Option value="date">Day</Option>
                            <Option value="week">Week</Option>
                            <Option value="month">Month</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xxl={4} lg={4} md={8} xs={12}>
                    <Form.Item label="Bussiness Date" name="bussinessDate">
                        <DatePicker
                            picker={type}
                            onChange={(value, dateString) =>
                                setDateString(dateString)
                            }
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </Col>

                <Col xxl={2} lg={2} md={3} xs={12}>
                    <Form.Item>
                        <Button
                            style={{
                                marginRight: "5px",
                                marginBottom: "5px",
                            }}
                            htmlType="button"
                            onClick={onReset}
                            block
                        >
                            Reset
                        </Button>
                    </Form.Item>
                </Col>
                <Col xxl={2} lg={2} md={3} xs={12}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Search
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

SearchForm.propTypes = {
    data: PropTypes.array.isRequired,
};

export default SearchForm;

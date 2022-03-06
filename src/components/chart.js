import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { map } from "lodash";
import { getDayNameByDate } from "../helpers/getDates";
import PropTypes from "prop-types";

const Chart = ({ data }) => {
    const [hotels, setHotels] = useState([]);
    const [dates, setDates] = useState([]);
    const [series, setSeries] = useState([]);

    useEffect(() => {
        getHotelsAndCountries();
    }, []);

    const getRevenueByHotel = (hotel) => {
        let revenue = [];
        let result = data.filter((item) => item.HOTEL === hotel);
        let holder = {};
        result.forEach(function (d) {
            if (holder.hasOwnProperty(d.BUSINESS_DATE)) {
                holder[d.BUSINESS_DATE] += d.REVENUE;
            } else {
                holder[d.BUSINESS_DATE] = d.REVENUE;
            }
        });
        for (var prop in holder) {
            if (renderWeekend(prop)) {
                revenue.push({
                    value: holder[prop].toFixed(2),
                    // Specify the style for single bar
                    itemStyle: {
                        color: "#F6868A",
                        shadowColor: "#F6868A",
                        borderType: "dashed",
                        opacity: 0.7,
                    },
                });
            } else {
                revenue.push(holder[prop].toFixed(2));
            }
        }

        return revenue;
    };
    const renderWeekend = (date) => {
        if (
            getDayNameByDate(date) === "Sat" ||
            getDayNameByDate(date) === "Sun"
        )
            return true; // isWeekEnd
        return false; // isNotWeekEnd
    };
    const getHotelsAndCountries = () => {
        let Hotels = [];
        let Dates = [];
        let Series = [];
        map(data, (item) => {
            Hotels.push(item.HOTEL);
            Dates.push(item.BUSINESS_DATE);
            if (Series.findIndex((x) => x.name === item.HOTEL) < 0)
                Series.push({
                    name: item.HOTEL,
                    type: "bar",
                    barGap: 0,

                    label: labelOption,
                    emphasis: {
                        focus: "series",
                    },
                    data: getRevenueByHotel(item.HOTEL),
                });
        });
        setHotels([...new Set(Hotels)]);
        setDates([...new Set(Dates)]);
        setSeries(Series);
    };

    const labelOption = {
        show: true,
        position: "top",
        distance: 5,
        align: "left",
        verticalAlign: "middle",
        rotate: 90,
        formatter: "{c}  {name|{a}}",
        fontSize: 16,
        rich: {
            name: {},
        },
    };
    const option = {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
            },
        },
        legend: {
            data: hotels,
        },
        toolbox: {
            show: true,
            orient: "vertical",
            left: "right",
            top: "center",
            feature: {
                magicType: { show: true, type: ["line", "bar"] },
                saveAsImage: { show: true },
            },
        },
        xAxis: [
            {
                type: "category",
                axisTick: { show: false },
                data: dates,
            },
        ],
        yAxis: [
            {
                type: "value",
            },
        ],
        series: series,
    };
    return <ReactEcharts option={option} />;
};

Chart.propTypes = {
    data: PropTypes.array.isRequired,
};

export default Chart;

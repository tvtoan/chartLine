import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const Chart = () => {
  const [series, setSeries] = useState([
    {
      name: "Price",
      data: [{ x: new Date(), y: 3430.96 }],
    },
  ]);

  const [currentPrice, setCurrentPrice] = useState(3430.96);
  const [horizontalLineValue] = useState(3435); // Fixed horizontal value
  const [priceTrend, setPriceTrend] = useState("");

 const [options, setOptions] = useState({
     chart: {
       type: "line",
       animations: {
         enabled: true,
         easing: "easeinout", 
         dynamicAnimation: {
           speed: 3000, 
         },
       },
       toolbar: {
         show: false,
       },
       zoom: {
         enabled: false,
       },
     },
     xaxis: {
       type: "datetime",
       labels: {
         datetimeUTC: false,
       },
     },
     yaxis: {
       decimalsInFloat: 2,
       labels: {
         formatter: (value) => `$${value.toFixed(2)}`, // show value money
       },
     },
     stroke: {
       curve: "smooth", // 
       width: 3,
       colors: ["#FFFF00"], // color chart
     },
     tooltip: {
       enabled: true,
       x: {
         format: "HH:mm:ss", // time tooltip
       },
     },
     grid: {
       borderColor: "#404040",
     },
     theme: {
       mode: "dark",
     },
     annotations: {
       yaxis: [
         {
           y: horizontalLineValue, // value horizontal
           borderColor: "#FF0000", 
           label: {
             borderColor: "#FF0000",
             style: {
               color: "#fff",
               background: "#FF0000",
             },
             text: `Threshold: $${horizontalLineValue}`, // label horizontal
           },
           strokeDashArray: 5, 
         },
       ],
     },
   });
 

  const generateRandomValue = (prevValue) => {
    const change = Math.random() * 5;
    const direction = Math.random() > 0.5 ? 1 : -1;
    return parseFloat((prevValue + direction * change).toFixed(2));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeries((prevSeries) => {
        const lastValue = prevSeries[0].data[prevSeries[0].data.length - 1].y;
        const newValue = generateRandomValue(lastValue);
        setCurrentPrice(newValue);
        return [
          {
            ...prevSeries[0],
            data: [...prevSeries[0].data, { x: new Date(), y: newValue }].slice(
              -15
            ),
          },
        ];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const difference = currentPrice - horizontalLineValue;
    if (difference > 0) {
      setPriceTrend(`Increase ${difference.toFixed(2)} $`);
    } else if (difference < 0) {
      setPriceTrend(`Decrease ${Math.abs(difference).toFixed(2)} $`);
    } else {
      setPriceTrend("Balance");
    }
  }, [currentPrice, horizontalLineValue]);

  return (
    <div style={{ width: "80%", margin: "0 auto", textAlign: "center" }}>
      <h2 style={{ color: "#00FF00", fontSize: "36px" }}>
        ${currentPrice.toFixed(2)}
      </h2>
      <h3 style={{ color: priceTrend.includes("Increase") ? "green" : "red" }}>
        {priceTrend}
      </h3>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={550}
      />
    </div>
  );
};

export default Chart;

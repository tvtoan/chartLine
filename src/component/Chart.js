import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const Chart = () => {
  const initialPrice = 3430.96;
  const initTime = 30;
  const [series, setSeries] = useState([
    {
      name: "Price",
      data: [{ x: new Date().getTime(), y: initialPrice }],
    },
  ]);

  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [oldPriceValue, setOldPriceValue] = useState(initialPrice);
  const [priceTrend, setPriceTrend] = useState("");

  const [endTime, setEndTime] = useState(
    new Date().getTime() + initTime * 1000
  );
  const [firstTime, setFirstTime] = useState(series[0]?.data[0]?.x);
  const [countdown, setCountdown] = useState(
    Math.ceil((endTime - new Date().getTime()) / 1000)
  );

  useEffect(() => {
    if(countdown > 0) {
      const timeCountDown = setInterval(() => {
        setCountdown((prev) => prev - 1 )
      },1000);
      return () => clearInterval(timeCountDown);
    }
    else {

      const delayReset = setTimeout(() => {
        setEndTime(new Date().getTime() + initTime * 1000); 
        setCountdown(initTime); // Reset về 30 giây
      }, 2000);
      return () => clearTimeout(delayReset);
    }
  },[countdown])
  
  
 
  const [options, setOptions] = useState({
    chart: {
      type: "line",
      animations: {
        enabled: true,
        easing: "easeinout",
        dynamicAnimation: {
          speed: 2000, // slow animation
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
        formatter: (value) => `$${value.toFixed(2)}`,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#FFFF00"],
    },
    tooltip: {
      enabled: true,
      x: {
        format: "HH:mm:ss",
      },
    },
    grid: {
      borderColor: "#404040",
      padding: {
        right: 50,
      },
    },
    theme: {
      mode: "dark",
    },
    annotations: {
      xaxis: [
        {
          x: endTime,
          borderColor: "#fd853a",
          label: {
            borderColor: "#00FF00",
            style: {
              color: "#fff",
              background: "#00FF00",
            },
            text: "End",
          },
          strokeDashArray: 5,
        },
        {
          x: firstTime,
          borderColor: "#fd853a",
          label: {
            borderColor: "#00FF00",
            style: {
              color: "#fff",
              background: "#00FF00",
            },
            text: "Current",
          },
          strokeDashArray: 5,
        },
      ],
      yaxis: [
        {
          y: oldPriceValue,
          borderColor: "#fd853a",
          label: {
            borderColor: "#00BFFF",
            style: {
              color: "#fff",
              background: "#00BFFF",
            },
            text: `Current: $${oldPriceValue}`,
          },
          strokeDashArray: 5,
        },
      ],
    },
  });

  const generateRandomValue = (prevValue) => {
    const change = Math.random() * 2;
    const direction = Math.random() > 0.5 ? 1 : -1;
    return parseFloat((prevValue + direction * change).toFixed(2));
  };

  useEffect(() => {
    const updateData = () => {
      const currentTime = new Date().getTime();

      
      setSeries((prevSeries) => {
        const lastValue = prevSeries[0].data[prevSeries[0].data.length - 1].y;
        const newValue = generateRandomValue(lastValue);

        if (currentTime >= endTime) {
          setTimeout(() => {
            setFirstTime(endTime);
            setEndTime(currentTime + initTime * 1000);
            setOldPriceValue(newValue);
          }, 1000); // Delay of 1 seconds
        }

        setCurrentPrice(newValue);

        return [
          {
            ...prevSeries[0],
            data: [
              ...prevSeries[0].data,
              { x: currentTime, y: newValue },
            ].slice(-35),
          },
        ];
      });
    };

    const interval = setInterval(updateData, 2000);
    return () => clearInterval(interval);
  }, [endTime]);

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      annotations: {
        ...prevOptions.annotations,
        xaxis: [
          {
            x: endTime,
            borderColor: "#fd853a",
            label: {
              borderColor: "#00FF00",
              style: {
                color: "#fff",
                background: "#00FF00",
              },
              text: "End",
            },
            strokeDashArray: 5,
          },
          {
            x: firstTime,
            borderColor: "#fd853a",
            label: {
              borderColor: "#00FF00",
              style: {
                color: "#fff",
                background: "#00FF00",
              },
              text: "Current",
            },
            strokeDashArray: 5,
          },
        ],
        yaxis: [
          {
            y: oldPriceValue,
            borderColor: "#fd853a",
            label: {
              borderColor: "#00BFFF",
              style: {
                color: "#fff",
                background: "#00BFFF",
              },
              text: `Current: $${oldPriceValue}`,
            },
            strokeDashArray: 5,
          },
        ],
      },
    }));
  }, [endTime, firstTime, oldPriceValue]);

  useEffect(() => {
    const difference = currentPrice - oldPriceValue;
    if (difference > 0) {
      setPriceTrend(`Increase ${difference.toFixed(2)} $`);
    } else if (difference < 0) {
      setPriceTrend(`Decrease ${Math.abs(difference).toFixed(2)} $`);
    } else {
      setPriceTrend("Balance");
    }
  }, [currentPrice, oldPriceValue]);

  return (
    <div
      style={{
        width: "80%",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#00FF00", fontSize: "36px" }}>
        ${currentPrice.toFixed(2)}
      </h2>
      {countdown ? 

      <h3 style={{color:'green'}}>{countdown} seconds</h3> : <h3 style={{color: 'red'}}>Time Out</h3>
      }
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

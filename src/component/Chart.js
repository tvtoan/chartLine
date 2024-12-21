import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const Chart = () => {
  const initialPrice = 3430.96;

  const [series, setSeries] = useState([
    {
      name: "Price",
      data: [{ x: new Date().getTime(), y: initialPrice }],
    },
  ]);

  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [horizontalLineValue] = useState(3435); // fixed horizontal value
  const [oldPriceValue] = useState(3432); // old price
  const [priceTrend, setPriceTrend] = useState("");

  const [endTime] = useState(new Date().getTime() + 40 * 1000); // time running
  const [delayAfterEnd] = useState(2200); // Delay 2 seconds
  const [isRunning, setIsRunning] = useState(true); // 

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
        right: 50, //padding right 50px
      },
    },
    theme: {
      mode: "dark",
    },
    annotations: {
      xaxis: [
        {
          x: endTime,
          borderColor: "#00FF00",
          label: {
            borderColor: "#00FF00",
            offsetX: 250, 
            style: {
              color: "#fff",
              background: "#00FF00",
            },
            text: "End",
          },
        },
      ],
      yaxis: [
        {
          y: horizontalLineValue,
          borderColor: "#FF0000",
          label: {
            borderColor: "#FF0000",
            style: {
              color: "#fff",
              background: "#FF0000",
            },
            text: `Threshold: $${horizontalLineValue}`,
          },
          strokeDashArray: 5,
        },
        {
          y: oldPriceValue,
          borderColor: "#00BFFF",
          label: {
            borderColor: "#00BFFF",
            style: {
              color: "#fff",
              background: "#00BFFF",
            },
            text: `Old Price: $${oldPriceValue}`,
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
      const currentTime = new Date().getTime();

      // logic stop
      if (currentTime < endTime + delayAfterEnd) {
        setSeries((prevSeries) => {
          const lastValue =
            prevSeries[0].data[prevSeries[0].data.length - 1].y;
          const newValue = generateRandomValue(lastValue);

          setCurrentPrice(newValue);

          return [
            {
              ...prevSeries[0],
              data: [
                ...prevSeries[0].data,
                { x: currentTime, y: newValue },
              ].slice(-15),
            },
          ];
        });
      } else {
        // Stop program
        setIsRunning(false);
        clearInterval(interval);
      }
    }, 3000); // update

    return () => clearInterval(interval);
  }, [endTime, delayAfterEnd]);

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
    <div
      style={{
        width: "80%",
        margin: "0 auto",
        textAlign: "center",
        paddingRight: "150px", // Tạo khoảng cách 150px ở bên phải
      }}
    >
      <h2 style={{ color: "#00FF00", fontSize: "36px" }}>
        ${currentPrice.toFixed(2)}
      </h2>
      <h3 style={{ color: priceTrend.includes("Increase") ? "green" : "red" }}>
        {priceTrend}
      </h3>
      {isRunning ? (
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={550}
        />
      ) : (
        <h3 style={{ color: "orange" }}>Stopped at End Time</h3>
      )}
    </div>
  );
};

export default Chart;

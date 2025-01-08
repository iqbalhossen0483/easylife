import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { style } from "../../css/home";
import { Fetch } from "../../services/common";
import { modifyCashReport } from "../../services/report";
import BDT from "../utilitise/BDT";
import Button from "../utilitise/Button";
import { LoadingOnComponent } from "../utilitise/Loading";
import P from "../utilitise/P";
import { DropDown } from "../utilitise/SelectDropdown";

const CashReport = ({ data }) => {
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [methods, setMethods] = useState({ name: "Days" });
  const [report, setReport] = useState(data);
  const store = useStore();

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: date || new Date(),
      onChange: (_, selectedDate) => {
        const currentDate = selectedDate;
        if (methods.name === "Clear") setMethods({ name: "Days" });
        setDate(currentDate);
      },
      mode: "date",
      is24Hour: true,
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const method = methods.name;
        let base = "/admin?cashReport=true&";
        const url =
          method === "Month"
            ? (base += `method=month&date=${date.toLocaleString("en-us", {
                month: "long",
              })}&year=${date.getFullYear()}`)
            : method === "Year"
            ? (base += `method=year&date=${date.getFullYear()}`)
            : (base += `method=date&date=${date.toISOString()}`);
        const report = await Fetch(store.database.name, url, "GET");
        const modified = modifyCashReport(report);
        setReport(modified);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        setLoading(false);
      }
    }
    if (date) fetchData();
  }, [date]);

  useEffect(() => {
    if (methods.name === "Clear") {
      setReport(data);
      setDate(null);
    }
  }, [methods.name]);

  useEffect(() => {
    setReport(data);
  }, [data]);

  return (
    <View style={style.totalReportContainer}>
      <P bold style={{ ...commonStyles.heading, width: "100%", marginTop: 0 }}>
        At a glance your business Of {"\n"}
        <P size={15} style={{ color: "#8f1391" }}>
          {date ? prittyDate(date, methods) : prittyDate(new Date(), methods)}
        </P>
      </P>
      {report &&
        report.map((item) => (
          <View
            style={{ ...style.totalReportItem, backgroundColor: item.bgColor }}
            key={item.id}
          >
            <P bold style={{ color: item.textColor }}>
              {item.name}
            </P>
            <BDT
              style={{ fontSize: 16, color: item.textColor }}
              amount={item.amount}
            />
          </View>
        ))}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          columnGap: 10,
        }}
      >
        <Button
          onPress={showDatepicker}
          style={{ width: "65%" }}
          title='Be Specific'
        />
        <DropDown
          options={[
            { value: "Days", label: "Days" },
            { value: "Month", label: "Month" },
            { value: "Year", label: "Year" },
            { value: "Clear", label: "Clear" },
          ]}
          setValue={(value) => {
            if (value === "Clear") setDate(new Date());
            else setMethods({ name: value });
          }}
        />
      </View>

      {loading ? <LoadingOnComponent /> : null}
    </View>
  );
};

export default CashReport;

function prittyDate(date, method) {
  if (method.name === "Month") {
    return (
      date.toLocaleDateString("en-GB", { month: "long" }) +
      " " +
      date.getFullYear()
    );
  } else if (method.name === "Year") {
    return date.getFullYear();
  }
  return date.toLocaleDateString("en-GB");
}

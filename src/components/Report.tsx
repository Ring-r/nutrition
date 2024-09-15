import { useEffect, useState } from "react";
import { Button, DateRangePicker, FlexboxGrid, Loader, VStack } from "rsuite";
import { dbReportStore } from "../data";
import { ProcessedFood, ProcessedFoodListToString, ProcessedFoodListView } from "./FoodView";

const formatedDate = (date: Date) => {
  return date.toISOString().substring(0, 10);
}

export interface ReportDay {
  date: Date;
  food_list: ProcessedFood[][];
}

export function ReportDayView({ report_day }: { report_day: ReportDay }) {
  return (
    <>
      <h2>{report_day.date.toDateString()}</h2>
      <VStack>
        {
          report_day.food_list.map((food_list, index) =>
            <ProcessedFoodListView key={index} food_list={food_list} />
          )
        }
      </VStack>
    </>
  );
}

export function ReportFullView({ db, last_update_date }: { db: IDBDatabase, last_update_date?: Date }) {
  const [dateRange, setDateRange] = useState<[Date, Date] | null>();
  const [reportDayList, setReportDayList] = useState<ReportDay[]>();

  useEffect(() => {
    async function initDateRange() {
      const today = new Date(new Date().toDateString());
      setDateRange([today, today]);
    }
    initDateRange();
  }, []);

  useEffect(() => {
    async function initReportDayList() {
      if (!db) return;
      if (!dateRange) return;

      const request = db.transaction([dbReportStore], "readonly").objectStore(dbReportStore).getAll();
      request.onsuccess = () => {
        const data: ReportDay[] = request.result ?? [];
        const dataFiltered = dateRange ? data.filter(item => dateRange[0] <= item.date && item.date <= dateRange[1]) : data;
        setReportDayList(dataFiltered);
      };
      request.onerror = () => {
        console.error("Unable to retrieve data:", request.error);
      };
    }
    initReportDayList();
  }, [db, dateRange, last_update_date]);

  function ReportDayListView() {
    return !reportDayList ? <Loader content="report day list..." /> : (
      <VStack>
        {
          reportDayList.map(report_day =>
            <ReportDayView key={report_day.date.toDateString()} report_day={report_day} />
          )
        }
      </VStack>
    );
  }

  const download = () => {
    if (!dateRange) return;
    if (!reportDayList) return;

    const markdownString = reportDayList.map(report_day =>
      `## ${formatedDate(report_day.date)}\n`
      + report_day.food_list.map(food_list => `- ${ProcessedFoodListToString(food_list)}\n`).join("")
      + "\n"
    ).join("");
    const blob = new Blob([markdownString], { type: "text/markdown" });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const formated_date0 = formatedDate(dateRange[0]);
    const formated_date1 = formatedDate(dateRange[1]);
    const filename = formated_date0 !== formated_date1 ? `${formated_date0}-${formated_date1}` : `${formated_date0}`
    a.download = `${filename}.mk`;

    // Append the anchor to the body (it must be in the DOM for the click to work in some browsers)
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <>
      {!dateRange ? <Loader content="data range..." /> : <DateRangePicker cleanable={false} value={dateRange} onChange={setDateRange} />}
      < FlexboxGrid justify="end">
        <Button appearance="primary" color="green" onClick={download}>download</Button>
      </FlexboxGrid>
      <ReportDayListView />
    </>
  );
}

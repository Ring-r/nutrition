import { useEffect, useState } from "react";
import { DateRangePicker, Loader, VStack } from "rsuite";
import { dbReportStore } from "../data";
import { ProcessedFood, ProcessedFoodListView } from "./FoodView";

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

  return (
    <>
      {!dateRange ? <Loader content="data range..." /> : <DateRangePicker cleanable={false} value={dateRange} onChange={setDateRange} />}
      <ReportDayListView />
    </>
  );
}

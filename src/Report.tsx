import { useEffect, useState } from "react";
import { DateRangePicker, HStack, Loader, VStack } from "rsuite";
import { ProcessedFood, dbReportStore } from "./data";

function FoodAsTextView({ food }: { food: ProcessedFood }) {
  const food_name = food.name === food.name_real ? food.name : `${food.name_real} / ${food.name}`;
  const food_value = food.value === food.value_real ? food.value : `${food.value_real}/${food.value}`;
  return <span>{food_name} ({food_value}{food.value_name}); </span>
}

function FoodListAsTextView({ food_list }: { food_list: ProcessedFood[] }) {
  const food_list_view = food_list.map(report_food =>
    <FoodAsTextView key={report_food.name} food={report_food} />
  );
  return (
    <HStack wrap>{food_list_view}</HStack>
  );
}

function ReportDayFoodListView({ report_day_food_list }: { report_day_food_list: ProcessedFood[][] }) {
  const report_day_food_list_view = report_day_food_list.map((food_list, index) =>
    <FoodListAsTextView key={index} food_list={food_list} />
  );
  return (
    <VStack>
      {report_day_food_list_view}
    </VStack>
  );
}

export interface ReportDay {
  date: Date;
  food_list: ProcessedFood[][];
}

export function ReportDayView({ report_day }: { report_day: ReportDay }) {
  return (
    <>
      <h2>{report_day.date.toDateString()}</h2>
      <ReportDayFoodListView report_day_food_list={report_day.food_list} />
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
    const report_day_list_view = (reportDayList ?? []).map(report_day =>
      <ReportDayView key={report_day.date.toDateString()} report_day={report_day} />
    );
    return (
      <VStack>
        {report_day_list_view}
      </VStack>
    );
  }

  return !dateRange || !reportDayList ? <Loader /> : (
    <>
      <DateRangePicker cleanable={false} value={dateRange} onChange={setDateRange} />
      <ReportDayListView />
    </>
  );
}

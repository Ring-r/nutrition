import { useEffect, useState } from 'react';
import { Button, FlexboxGrid, Panel, Tabs, Tag } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './App.css';
import ChosenFoodView, { ChosenFood } from './ChosenFoodView';
import { dbName, dbReportStore, dbVersion, getMealReveptionDataList, MealReceptionData } from './data';
import { PreparedFood, PreparedFoodListView, ProcessedFood } from './FoodView';
import MealReceptionView, { Choise, MealReception } from './MealReceptionView';
import { ReportDay, ReportDayView, ReportFullView } from './Report';

const getToday = () => new Date(new Date().toDateString());

function App() {
  const [mealReceptionDataList] = useState<MealReceptionData[]>(getMealReveptionDataList);

  const [db, setDB] = useState<IDBDatabase>();
  const [today, setToday] = useState<Date>(getToday);

  const [chosenFood, setChosenFood] = useState<ChosenFood | null>(null);
  const [preparedFoodList, setPreparedFoodList] = useState<PreparedFood[]>();
  const [processedFoodList, setProcessedFoodList] = useState<ProcessedFood[][]>();

  const [mealReceptionList, setMealReceptionList] = useState<MealReception[]>();
  const [lastUpdateDate, setLastUpdateDate] = useState<Date>();

  useEffect(() => {
    async function initDB() {
      const request = indexedDB.open(dbName, dbVersion);

      request.onerror = () => {
        console.error("Database error:", request.error);
      };

      request.onsuccess = () => {
        const db_ = request.result;
        setDB(db_);
      };

      request.onupgradeneeded = function () {
        const db_ = request.result;
        if (!db_.objectStoreNames.contains(dbReportStore)) {
          db_.createObjectStore(dbReportStore, { keyPath: "date", autoIncrement: false });
          console.log("Object store created");
        }
      }
    }
    initDB();
  }, []);

  useEffect(() => {
    async function initReportDay() {
      if (!db) return;
      if (!today) return;

      const request = db.transaction([dbReportStore], "readonly").objectStore(dbReportStore).get(today);
      request.onsuccess = () => {
        const data: ReportDay = request.result ?? { date: today, food_list: [] };

        setChosenFood(null);
        setPreparedFoodList([])
        setProcessedFoodList(data.food_list);
      };
      request.onerror = () => {
        console.error("Unable to retrieve data:", request.error);
      };
    }
    initReportDay();
  }, [db, today]);

  useEffect(() => {
    if (processedFoodList === undefined) return;
    if (preparedFoodList === undefined) return;

    function calcChoiseValue(choise_name: string, fixedFoodList: PreparedFood[][], unfixedFoodList: PreparedFood[]) {
      let choise_value = 1;
      const filtered_fixed_food_list = fixedFoodList.flat(1).filter(item => item.choise_name === choise_name);
      for (const food of filtered_fixed_food_list) {
        choise_value -= food.value_real / food.value;
      }
      const filtered_unfixed_food_list = unfixedFoodList.filter(item => item.choise_name === choise_name);
      for (const food of filtered_unfixed_food_list) {
        choise_value -= food.value_real / food.value;
      }
      return choise_value;
    }

    const meal_reception_list: MealReception[] = [];
    for (const meal_reception_data of mealReceptionDataList) {
      const choise_list: Choise[] = [];
      for (const choise_data of meal_reception_data.choise_data_list) {
        // todo: can be optimized to calculate dict before
        const choise_value = calcChoiseValue(choise_data.name, processedFoodList, preparedFoodList);

        if (choise_value <= 0) continue;

        choise_list.push({
          name: choise_data.name,
          value: choise_value,
          food_data_list: choise_data.food_data_list,
        });
      }

      if (choise_list.length === 0) continue;

      meal_reception_list.push({
        name: meal_reception_data.name,
        choise_list: choise_list,
      });
    }

    setMealReceptionList(meal_reception_list);
  }, [processedFoodList, preparedFoodList]);


  const prepareChosenFood = (choise_name: string, food_name: string) => {
    if (mealReceptionList === undefined) throw new Error("something wrong. the `mealReceptionList` is undefined.");

    let choise = null;
    for (const meal_reception of mealReceptionList) {
      choise = meal_reception.choise_list.find(item => item.name === choise_name);
      if (choise) break;
    }
    if (!choise) throw new Error("something wrong. there is not necessary `choise_name`.");

    const food_data = choise.food_data_list.find(item => item.name === food_name);
    if (!food_data) throw new Error("something wrong. there is not necessary `food_name`.");

    const editing_food: ChosenFood = {
      ...food_data,
      choise_name: choise.name,
      choise_value: choise.value,
    }
    setChosenFood(editing_food);
  }

  const applyChosenFood = (chosen_food: ChosenFood, food_name: string, food_value: number) => {
    if (preparedFoodList === undefined) throw new Error();

    const prepared_food: PreparedFood = {
      choise_name: chosen_food.choise_name,

      name: chosen_food.name,
      value: chosen_food.value,
      value_name: chosen_food.value_name,

      name_real: food_name,
      value_real: food_value,
    };
    setPreparedFoodList([...preparedFoodList, prepared_food]);
    setChosenFood(null);
  }

  const cancelChosenFood = () => {
    setChosenFood(null);
  }

  const applyPreparedFoodList = () => {
    if (processedFoodList === undefined) throw new Error();
    if (preparedFoodList === undefined) throw new Error();

    const food_list = [...processedFoodList, preparedFoodList]
    async function saveReportDay() {
      if (!db) return;
      if (!today) return;

      const report_day: ReportDay = {
        date: today,
        food_list: food_list,
      }
      const request = db.transaction([dbReportStore], "readwrite").objectStore(dbReportStore).put(report_day);
      request.onsuccess = () => {
        setLastUpdateDate(new Date());
      };
      request.onerror = () => {
        console.error("Unable to retrieve data:", request.error);
      };
    }
    saveReportDay();

    setProcessedFoodList(food_list);
    setPreparedFoodList([])
  }

  const cancePreparedFood = (food: PreparedFood) => {
    if (preparedFoodList === undefined) throw new Error();

    setPreparedFoodList(preparedFoodList.filter(item => item !== food));
  }

  return (
    <div className="App">
      <Tabs defaultActiveKey="1">
        <Tabs.Tab eventKey="1" title="main">
          {processedFoodList ? <ReportDayView report_day={{ date: today, food_list: processedFoodList }} /> : <Tag>`fixedFoodList` is not ready...</Tag>}
          <FlexboxGrid justify="end">
            <Button appearance="primary" color="orange" onClick={() => setToday(getToday())}>start this day</Button>
          </FlexboxGrid>
          {preparedFoodList ? <PreparedFoodListView food_list={preparedFoodList} onApply={applyPreparedFoodList} onCancelFood={cancePreparedFood} /> : <Tag>`unfixedFoodList` is not ready...</Tag>}
          {chosenFood ? (
            <ChosenFoodView food={chosenFood} onApply={applyChosenFood} onCancel={cancelChosenFood} />
          ) : (
            <Panel header="meal receptions (recommendation)">
              {
                mealReceptionList?.map(mealReception =>
                  <MealReceptionView key={mealReception.name} meal_reception={mealReception} onApplyFood={prepareChosenFood} />
                )
              }
            </Panel>
          )}
        </Tabs.Tab>
        <Tabs.Tab eventKey="2" title="report">
          {db ? <ReportFullView db={db} last_update_date={lastUpdateDate} /> : <Tag>db is not ready...</Tag>}
        </Tabs.Tab>
      </Tabs>
    </div>
  );

}

export default App;

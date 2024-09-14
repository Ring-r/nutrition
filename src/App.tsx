import { useEffect, useState } from 'react';
import { Button, FlexboxGrid, Panel, Tabs, Tag } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './App.css';
import ChoiseEdit from './ChoiseEdit';
import { Choise, dbName, dbReportStore, dbVersion, EditingFood, getMealReveptionDataList, MealReception, MealReceptionData, ProcessedFood } from './data';
import MealReceptionView from './MealReceptionView';
import ProcessedMealReceptionView from './ProcessedMealReceptionView';
import { ReportDay, ReportDayView, ReportFullView } from './Report';

const getToday = () => new Date(new Date().toDateString());

function App() {
  const [meal_reception_data_list] = useState<MealReceptionData[]>(getMealReveptionDataList);

  const [db, setDB] = useState<IDBDatabase>();
  const [today, setToday] = useState<Date>(getToday);

  const [editingFood, setEditingFood] = useState<EditingFood | null>(null);
  const [fixedFoodList, setFixedFoodList] = useState<ProcessedFood[][]>();
  const [unfixedFoodList, setUnfixedFoodList] = useState<ProcessedFood[]>();

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

        setEditingFood(null);
        setUnfixedFoodList([])
        setFixedFoodList(data.food_list);
      };
      request.onerror = () => {
        console.error("Unable to retrieve data:", request.error);
      };
    }
    initReportDay();
  }, [db, today]);

  useEffect(() => {
    async function saveReportDay() {
      if (!db) return;
      if (!today) return;
      if (fixedFoodList === undefined) return;

      const report_day: ReportDay = {
        date: today,
        food_list: fixedFoodList,
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
  }, [fixedFoodList]);

  useEffect(() => {
    if (fixedFoodList === undefined) return;
    if (unfixedFoodList === undefined) return;

    function calcChoiseValue(choise_name: string, fixedFoodList: ProcessedFood[][], unfixedFoodList: ProcessedFood[]) {
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
    for (const meal_reception_data of meal_reception_data_list) {
      const choise_list: Choise[] = [];
      for (const choise_data of meal_reception_data.choise_data_list) {
        // todo: can be optimized to calculate dict before
        const choise_value = calcChoiseValue(choise_data.name, fixedFoodList, unfixedFoodList);

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
  }, [fixedFoodList, unfixedFoodList]);


  const editFood = (choise_name: string, food_name: string) => {
    if (mealReceptionList === undefined) throw new Error("something wrong. the `mealReceptionList` is undefined.");

    let choise = null;
    for (const meal_reception of mealReceptionList) {
      choise = meal_reception.choise_list.find(item => item.name === choise_name);
      if (choise) break;
    }
    if (!choise) throw new Error("something wrong. there is not necessary `choise_name`.");

    const food_data = choise.food_data_list.find(item => item.name === food_name);
    if (!food_data) throw new Error("something wrong. there is not necessary `food_name`.");

    const editing_food: EditingFood = {
      ...food_data,
      choise_name: choise.name,
      choise_value: choise.value,
    }
    setEditingFood(editing_food);
  }

  const applyEditingFood = (editing_food: EditingFood, food_name: string, food_value: number) => {
    if (unfixedFoodList === undefined) throw new Error();

    const unfixed_food: ProcessedFood = {
      choise_name: editing_food.choise_name,

      name: editing_food.name,
      value: editing_food.value,
      value_name: editing_food.value_name,

      name_real: food_name,
      value_real: food_value,
    };
    setUnfixedFoodList([...unfixedFoodList, unfixed_food]);
    setEditingFood(null);
  }

  const cancelEditingFood = () => {
    setEditingFood(null);
  }

  const applyMealReception = () => {
    if (fixedFoodList === undefined) throw new Error();
    if (unfixedFoodList === undefined) throw new Error();

    setFixedFoodList([...fixedFoodList, unfixedFoodList]);
    setUnfixedFoodList([])
  }

  const cancelUnfixedFood = (food: ProcessedFood) => {
    if (unfixedFoodList === undefined) throw new Error();

    setUnfixedFoodList(unfixedFoodList.filter(item => item !== food));
  }

  const meal_reception_data_list_view = mealReceptionList?.map(mealReception => (
    <MealReceptionView key={mealReception.name} meal_reception={mealReception} onApplyFood={editFood} />
  ));

  return (
    <div className="App">
      <Tabs defaultActiveKey="1">
        <Tabs.Tab eventKey="1" title="main">
          {fixedFoodList ? <ReportDayView report_day={{ date: today, food_list: fixedFoodList }} /> : <Tag>`fixedFoodList` is not ready...</Tag>}
          <FlexboxGrid justify="end">
            <Button appearance="primary" color="orange" onClick={() => setToday(getToday())}>start this day</Button>
          </FlexboxGrid>
          {unfixedFoodList ? <ProcessedMealReceptionView food_list={unfixedFoodList} onApply={applyMealReception} onCancelFood={cancelUnfixedFood} /> : <Tag>`unfixedFoodList` is not ready...</Tag>}
          {editingFood ? (
            <ChoiseEdit editing_food={editingFood} onApply={applyEditingFood} onCancel={cancelEditingFood} />
          ) : (
            <Panel header="meal receptions (recommendation)">
              {meal_reception_data_list_view}
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

import { useEffect, useState } from 'react';
import { Button, FlexboxGrid, HStack, Panel, Tabs } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './App.css';
import ChoiseEdit from './ChoiseEdit';
import { Choise, EditingFood, getMealReveptionDataList, MealReception, MealReceptionData, ProcessedFood, ProcessedMealReception } from './data';
import MealReceptionView from './MealReceptionView';
import ProcessedMealReceptionView from './ProcessedMealReceptionView';

function App() {
  const [meal_reception_data_list] = useState<MealReceptionData[]>(getMealReveptionDataList());

  const [editingFood, setEditingFood] = useState<EditingFood | null>(null);
  const [unfixedFoodList, setUnfixedFoodList] = useState<ProcessedFood[]>([]);
  const [fixedFoodList, setFixedFoodList] = useState<ProcessedFood[]>([]);

  const [mealReceptionList, setMealReceptionList] = useState<MealReception[]>(initMealReceptionList);

  const [fixedMealReceptionList, setFixedMealReceptionList] = useState<ProcessedMealReception[]>([]);


  function calcChoiseValue(choise_name: string) {
    let choise_value = 1;
    const filtered_fixed_food_list = fixedFoodList.filter(item => item.choise_name === choise_name);
    for (const food of filtered_fixed_food_list) {
      choise_value -= food.value_real / food.value;
    }
    const filtered_unfixed_food_list = unfixedFoodList.filter(item => item.choise_name === choise_name);
    for (const food of filtered_unfixed_food_list) {
      choise_value -= food.value_real / food.value;
    }
    return choise_value;
  }

  function initMealReceptionList() {
    const meal_reception_list: MealReception[] = [];
    for (const meal_reception_data of meal_reception_data_list) {
      const choise_list: Choise[] = [];
      for (const choise_data of meal_reception_data.choise_data_list) {
        const choise_value = calcChoiseValue(choise_data.name);

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
    return meal_reception_list;
  }

  useEffect(() => {
    setMealReceptionList(initMealReceptionList);
  }, [unfixedFoodList, fixedFoodList]);


  const initDefault = () => {
    setMealReceptionList(initMealReceptionList());

    setEditingFood(null);
    setFixedFoodList([]);
    setUnfixedFoodList([])
  }

  const editFood = (choise_name: string, food_name: string) => {
    let choise = null;
    for (const meal_reception of mealReceptionList) {
      choise = meal_reception.choise_list.find(item => item.name === choise_name);
      if (choise) break;
    }
    console.log(choise);
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
    const fixedMealReceprion: ProcessedMealReception = {
      date: new Date(),
      food_list: unfixedFoodList,
    }
    setFixedMealReceptionList([...fixedMealReceptionList, fixedMealReceprion]);

    setFixedFoodList([...fixedFoodList, ...unfixedFoodList]);
    setUnfixedFoodList([])
  }

  const cancelUnfixedFood = (food: ProcessedFood) => {
    setUnfixedFoodList(unfixedFoodList.filter(item => item !== food));
  }

  const meal_reception_data_list_view = mealReceptionList.map(mealReception => (
    <MealReceptionView key={mealReception.name} meal_reception={mealReception} onApplyFood={editFood} />
  ));

  const report = fixedMealReceptionList.map(item => {
    const text = item.food_list.map(food => {
      const food_name = food.name === food.name_real ? food.name : `${food.name_real} / ${food.name}`;
      const food_value = food.value === food.value_real ? food.value : `${food.value_real}/${food.value}`;
      return <span>{food_name} ({food_value}{food.value_name}); </span>
    });
    return <HStack><span >{item.date.toLocaleDateString("ua-UA")}: </span>{text}</HStack>
  })

  return (
    <div className="App">
      <Tabs defaultActiveKey="1">
        <Tabs.Tab eventKey="1" title="main">
          <FlexboxGrid justify="end">
            <Button appearance="primary" color="orange" onClick={() => initDefault()}>start new day</Button>
          </FlexboxGrid>
          <ProcessedMealReceptionView food_list={unfixedFoodList} onApply={applyMealReception} onCancelFood={cancelUnfixedFood} />
          {editingFood && <ChoiseEdit editing_food={editingFood} onApply={applyEditingFood} onCancel={cancelEditingFood} />}
          {!editingFood && (
            <Panel header="meal receptions (recommendation)">
              {meal_reception_data_list_view}
            </Panel>
          )}
        </Tabs.Tab>
        <Tabs.Tab eventKey="2" title="report">
          {report}
        </Tabs.Tab>
      </Tabs>
    </div>
  );

}

export default App;

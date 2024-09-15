import { Button, HStack, Input, Panel } from 'rsuite';

export interface FoodBase {
  choise_name: string;
  name: string;
  value: number;
  value_name: string;
}

export interface PreparedFood extends FoodBase {
  name_real: string;
  value_real: number;
}

function PreparedFoodToString(food: PreparedFood) {
  const food_name = food.name === food.name_real ? food.name : `${food.name_real} / ${food.name}`;
  const food_value = food.value === food.value_real ? food.value : `${food.value_real}/${food.value}`;
  return `${food_name} (${food_value}${food.value_name})`;
}

export interface PreparedFoodListViewParams {
  food_list: PreparedFood[];
  onApply: () => void;
  onCancelFood: (food: PreparedFood) => void;
}

export function PreparedFoodListView({ food_list, onApply, onCancelFood }: PreparedFoodListViewParams) {
  return (
    <Panel header='meal reception' bordered>
      {
        food_list.map(food => (
          <HStack key={`${food.choise_name}_${food.name}`}>
            <Button appearance="ghost" color="red" onClick={() => onCancelFood(food)}>X</Button>
            <Input disabled defaultValue={PreparedFoodToString(food)} />
          </HStack>
        )
        )
      }
      {food_list.length > 0 && <Button appearance="primary" color="red" onClick={() => onApply()}>save</Button>}
    </Panel>
  );
}

export interface ProcessedFood extends PreparedFood {
}

function ProcessedFoodView({ food }: { food: ProcessedFood }) {
  return <span>{PreparedFoodToString(food)}; </span>
}

export function ProcessedFoodListView({ food_list }: { food_list: ProcessedFood[] }) {
  return (
    <HStack wrap>
      {
        food_list.map(report_food =>
          <ProcessedFoodView key={report_food.name} food={report_food} />
        )
      }
    </HStack>
  );
}

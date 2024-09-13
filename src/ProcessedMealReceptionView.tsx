import { Button, HStack, Input, Panel } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './App.css';
import { ProcessedFood } from './data';

interface ProcessedMealReceptionParams {
  food_list: ProcessedFood[];
  onApply: () => void;
  onCancelFood: (food: ProcessedFood) => void;
}

function ProcessedMealReceptionView({ food_list, onApply, onCancelFood }: ProcessedMealReceptionParams) {
  const food_element_list = food_list.map(food => {
    const food_name = food.name === food.name_real? food.name: `${food.name_real} / ${food.name}`;
    const food_value = food.value === food.value_real? food.value: `${food.value_real}/${food.value}`;
    return (
      <HStack key={`${food.choise_name}_${food.name}`}>
        <Button appearance="ghost" color="red" onClick={() => onCancelFood(food)}>X</Button>
        <Input color="blue" disabled defaultValue={`${food_name} (${food_value}${food.value_name})`} />
      </HStack>
    );
  });

  return (
    <Panel header='meal reception' bordered>
      {food_element_list}
      <Button disabled>upload image</Button>
      {food_list.length > 0 && <Button appearance="primary" color="red" onClick={() => onApply()}>save</Button>}
    </Panel>
  );
}

export default ProcessedMealReceptionView;

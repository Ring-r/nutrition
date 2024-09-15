import { useEffect, useState } from 'react';
import { Button, HStack, Panel, Text } from 'rsuite';
import { FoodData } from '../data';

export interface Choise {
  name: string;
  value: number;
  food_data_list: FoodData[];
}

interface ChoiseViewParams {
  choise: Choise;
  onApplyChoise: (choise_name: string, food_name: string) => void;
}

function ChoiseView({ choise, onApplyChoise }: ChoiseViewParams) {
  const [isFull, setIsFull] = useState<boolean>(true);

  useEffect(() => {
    setIsFull(choise.value === 1);
  }, [choise.value]);

  return (
    <HStack wrap>
      <Text weight="bold">{choise.name}: </Text>
      {
        choise.food_data_list.map(food_data => (
          <Button key={food_data.name} appearance={!isFull ? "ghost" : undefined} color={!isFull ? "orange" : undefined} onClick={() => onApplyChoise(choise.name, food_data.name)}>
            {food_data.name} {Math.floor(choise.value * food_data.value)}{food_data.value_name}
          </Button>
        ))
      }
    </HStack>
  );
}

export interface MealReception {
  name: string;
  choise_list: Choise[];
}

interface MealReceptionViewParams {
  meal_reception: MealReception;
  onApplyFood: (choise_name: string, food_name: string) => void;
}

function MealReceptionView({ meal_reception, onApplyFood }: MealReceptionViewParams) {
  return (
    <Panel header={meal_reception.name}>
      {
        meal_reception.choise_list.map(choise => (
          <ChoiseView key={choise.name} choise={choise} onApplyChoise={onApplyFood} />
        ))
      }
    </Panel>
  );
}

export default MealReceptionView;

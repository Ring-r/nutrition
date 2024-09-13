import { useEffect, useState } from 'react';
import { Button, HStack, Input, InputNumber } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './App.css';
import { EditingFood } from './data';

interface ChoiseParams {
  editing_food: EditingFood;
  onApply: (editing_food: EditingFood, food_name: string, food_value: number) => void;
  onCancel: () => void;
}

export function ChoiseEdit({ editing_food, onApply, onCancel }: ChoiseParams) {
  const [foodName, setFoodName] = useState<string>(editing_food.name);
  const food_value_max = editing_food.choise_value * editing_food.value;
  const [foodValue, setFoodValue] = useState<string | number | null>(food_value_max);
  const [foodValueError, setFoodValueError] = useState<boolean>(false);
  const [foodValueTypeError, setFoodValueTypeError] = useState<boolean>(false);

  const getFoodValue = () => {
    if (foodValue == null) return null;

    if (typeof foodValue === "number") {
      return foodValue;
    }

    const res = parseInt(foodValue);
    if (isNaN(res)) return null;

    return res;
  }

  useEffect(() => {
    const food_value = getFoodValue();
    if (food_value == null || food_value <= 0) {
      setFoodValueTypeError(true);
      setFoodValueError(true);
      return;
    }
    setFoodValueTypeError(false);
    if (food_value > food_value_max) {
      setFoodValueError(true);
      return;
    }
    setFoodValueError(false);
  }, [foodValue]);

  return (
    <HStack>
      <Button appearance="ghost" color="green" disabled={foodValueTypeError} onClick={() => onApply(editing_food, foodName, getFoodValue() ?? 0)}>V</Button>

      <Input color="blue" disabled defaultValue={`${editing_food.name} (${food_value_max}${editing_food.value_name})`} />

      <Input value={foodName} onChange={setFoodName} />
      <InputNumber color='red' value={foodValue} onChange={setFoodValue} formatter={value => `${value} ${editing_food.value_name}`} style={foodValueError ? { borderColor: "red" } : undefined} />

      <Button appearance="ghost" color="red" onClick={() => onCancel()}>X</Button>
    </HStack>
  );
}

export default ChoiseEdit;

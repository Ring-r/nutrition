import { useEffect, useState } from 'react';
import { Button, HStack, Text } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './App.css';
import { Choise } from './data';

interface ChoiseParams {
  choise: Choise;
  onApplyChoise: (choise_name: string, food_name: string) => void;
}

function ChoiseView({ choise, onApplyChoise }: ChoiseParams) {
  const [isFull, setIsFull] = useState<boolean>(true);

  useEffect(() => {
    setIsFull(choise.value === 1);
  }, [choise.value]);

  const choise_elements = choise.food_data_list.map(food_data => (
    <Button key={food_data.name} appearance={!isFull ? "ghost" : undefined} color={!isFull ? "orange" : undefined} onClick={() => onApplyChoise(choise.name, food_data.name)}>
      {food_data.name} {Math.round(choise.value * food_data.value)}{food_data.value_name}
    </Button>
  ));

  return (
    <HStack>
      <Text weight="bold">{choise.name}: </Text>
      {choise_elements}
    </HStack>
  );
}

export default ChoiseView;

import { Panel } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './App.css';
import ChoiseView from './ChoiseView';
import { MealReception } from './data';

interface MealReceptionParams {
  meal_reception: MealReception;
  onApplyFood: (choise_name: string, food_name: string) => void;
}

function MealReceptionView({ meal_reception, onApplyFood }: MealReceptionParams) {
  const choises_elements = meal_reception.choise_list.map(choise => (
    <ChoiseView key={choise.name} choise={choise} onApplyChoise={onApplyFood} />
  ));

  return (
    <Panel header={meal_reception.name}>
      {choises_elements}
    </Panel>
  );
}

export default MealReceptionView;

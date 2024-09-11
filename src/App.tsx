import { useEffect, useState } from 'react';
import { Button, HStack, Panel, Text } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './App.css';



interface Food {
  name: string;
  value: number;
  value_name: string;
}

interface Choise {
  name: string;
  food: Food;
}

interface ChoiseData {
  name: string;
  foods: Food[];
}

const choises_data: ChoiseData[] = [
  {
    name: "а",
    foods: [
      {name: "бобові", value: 45, value_name: "г"},
      {name: "картопля", value: 150, value_name: "г"},
      {name: "кукурудза свіжа", value: 150, value_name: "г"},
      {name: "пластівці", value: 45, value_name: "г"},
      {name: "булгур", value: 45, value_name: "г"},
      {name: "гречка", value: 45, value_name: "г"},
      {name: "рис (не шліфований)",value: 45, value_name: "г"},
      {name: "будь-яка крупа",value: 45, value_name: "г"},
      {name: "цільнозернове борошно",value: 45, value_name: "г"},
      {name: "хлібці", value: 65, value_name: "г"},
      {name: "цільнозерновий хліб", value: 70, value_name: "г"},
      {name: "макарони т.с.", value: 45, value_name: "г"},
      {name: "лаваш", value: 65, value_name: "г"},    
    ],
  },
  {
    name: "б",
    foods: [
      {name: "молоко (1,5-2,5%)", value: 200, value_name: "г"},
      {name: "кефір (1,5-2,5%)", value: 200, value_name: "г"},
      {name: "несолодкий йогурт (1,5-2,5%)", value: 200, value_name: "г"},  
    ],
  },
  {
    name: "в",
    foods: [
      {name: "будь-що (солодощі, снеки, ковбаса тощо)", value: 75, value_name: "г"},
    ],
  },
  {
    name: "г",
    foods: [
      {name: "бобові", value: 45, value_name: "г"},
      {name: "картопля", value: 150, value_name: "г"},
      {name: "кукурудза свіжа", value: 150, value_name: "г"},
      {name: "пластівці", value: 45, value_name: "г"},
      {name: "булгур", value: 45, value_name: "г"},
      {name: "гречка", value: 45, value_name: "г"},
      {name: "рис (не шліфований)", value: 45, value_name: "г"},
      {name: "будь-яка крупа", value: 45, value_name: "г"},
      {name: "цільнозернове борошно", value: 45, value_name: "г"},
      {name: "хлібці", value: 65, value_name: "г"},
      {name: "цільнозерновий хліб", value: 70, value_name: "г"},
      {name: "макарони т.с.", value: 45, value_name: "г"},
      {name: "лаваш", value: 65, value_name: "г"},
    ],  
  },
  {
    name: "д",
    foods: [
      {name: "телятина", value: 150, value_name: "г"},
      {name: "печінка", value: 150, value_name: "г"},
      {name: "куряче або індиче філе", value: 175, value_name: "г"},
      {name: "риба (до 5% жиру)", value: 180, value_name: "г"},
      {name: "риба (від 5% жиру)", value: 120, value_name: "г"},
      {name: "яйця", value: 3, value_name: "шт"},
      {name: "морепродукти", value: 200, value_name: "г"},  
    ],  
  },
  {
    name: "е",
    foods: [
      {name: "овочі (квашені також і зелень)", value: 300, value_name: "г"},
    ],  
  },
  {
    name: "є",
    foods: [
      {name: "будь-яка олія", value: 10, value_name: "г"},
      {name: "майонез", value: 13, value_name: "г"},
      {name: "авокадо", value: 55, value_name: "г"},
      {name: "оливки", value: 70, value_name: "г"},
      {name: "гірчиця", value: 24, value_name: "г"},
      {name: "кетчуп", value: 36, value_name: "г"},  
    ],  
  },
  {
    name: "ж",
    foods: [
      {name: "сир зернистий (творог) 5% жиру", value: 160, value_name: "г"},
      {name: "сири м‘які, тверді, плавлені ", value: 55, value_name: "г"},
      {name: "сметана 15%", value: 110, value_name: "г"},
      {name: "масло", value: 27, value_name: "г"},
      {name: "сало", value: 19, value_name: "г"},
      {name: "кефір 2.5%", value: 360, value_name: "г"},
      {name: "несолодкий йогурт 1,6% жиру", value: 370, value_name: "г"},
      {name: "молоко 2.5%", value: 360, value_name: "г"},  
    ],  
  },
  {
    name: "з",
    foods: [
      {name: "фрукти та ягоди (окрім банани, виноград, хурма чи манго)", value: 300, value_name: "г"},
      {name: "фрукти та ягоди (якщо це банани, виноград, хурма чи манго)", value: 250, value_name: "г"},  
    ],  
  },
  {
    name: "и",
    foods: [
      {name: "грецьких горіхи", value: 3, value_name: "шт"},
      {name: "будь-які горіхів або насіння", value: 20, value_name: "г"},  
    ],  
  },
  {
    name: "і",
    foods: [
      {name: "телятина", value: 150, value_name: "г"},
      {name: "печінка", value: 150, value_name: "г"},
      {name: "куряче або індиче філе", value: 175, value_name: "г"},
      {name: "риба (до 5% жиру)", value: 180, value_name: "г"},
      {name: "риба (від 5% жиру)", value: 120, value_name: "г"},
      {name: "яйця", value: 3, value_name: "шт"},
      {name: "морепродукти", value: 200, value_name: "г"},  
    ],  
  },
  {
    name: "ї",
    foods: [
      {name: "овочі (квашені також і зелень)", value: 300, value_name: "г"},
    ],  
  },
  {
    name: "й",
    foods: [
      {name: "будь-яка олія", value: 10, value_name: "г"},
      {name: "майонез", value: 13, value_name: "г"},
      {name: "авокадо", value: 55, value_name: "г"},
      {name: "оливки", value: 70, value_name: "г"},
      {name: "гірчиця", value: 24, value_name: "г"},
      {name: "кетчуп", value: 36, value_name: "г"},  
    ],  
  },
]

// todo: use to auto generate components
// const meal_reception_data = [
//   [0, 1, 2, ],
//   [3, 4, 5, 6, ],
//   [7, 8, 9, ],
//   [10, 11, 12, ],
// ]

interface MealReception {
  date: Date;
  choises: Choise[];
}

function MealReceptionView({currentChoises, delChoise, saveMealReception}: {currentChoises: Choise[], delChoise: (choise: Choise) => void, saveMealReception: () => void}) {

  const choises_elements = currentChoises.map(choise => (
    <Button onClick={() => delChoise(choise)}>{choise.food.name} ({choise.food.value}{choise.food.value_name})</Button>
  ));

  return (
    <Panel header='meal reception' bordered>
      {choises_elements}
      {currentChoises.length > 0 && <Button appearance="primary" color="red" onClick={() => saveMealReception()}>save</Button>}
    </Panel>
  );
}

function ChoiseView({choise, choises, addChoise}: {choise: ChoiseData, choises: Choise[], addChoise: (choise_name: string, food: Food) => void}) {
  const [visibility, setVisibility] = useState<boolean>(true);

  useEffect(() => {
    setVisibility(!choises.find(item => item.name === choise.name));
  }, [choises]);

  const choise_elements = choise.foods.map(item => (
    <Button onClick={() => addChoise(choise.name, item)}>{item.name} {item.value}{item.value_name}</Button>
  ));

  return visibility? (
    <HStack>
      <Text weight="bold">{choise.name}: </Text>
      {choise_elements}
    </HStack>
  ):<></>;
}

function App() {
  const [currentChoises, setCurrentChoises] = useState<Choise[]>([]);
  const [choises, setChoises] = useState<Choise[]>([]);
  const [mealReceptions, setMealReceptions] = useState<MealReception[]>([]);

  const addChoise = (choise_name: string, food: Food) => {
    setChoises([...choises, {name: choise_name, food: food}])
    setCurrentChoises([...currentChoises, {name: choise_name, food: food}])
  }

  const delChoise = (choise: Choise) => {
    setChoises(
      choises.filter(item => {return item.name !== choise.name && item.food.name !== choise.food.name})
    );
    setCurrentChoises(
      currentChoises.filter(item => {return item.name !== choise.name && item.food.name !== choise.food.name})
    );
  }

  const saveMealReception = () => {
    const mealReceprion: MealReception = {
      date: new Date(),
      choises: currentChoises,
    }
    setMealReceptions([...mealReceptions, mealReceprion]);
    setCurrentChoises([]);
  }

  const startNewDay = () => {
    setChoises([]);
    setCurrentChoises([]);
  }

  const choises_elements_1 = choises_data.slice(0, 3).map(choise_data => (<ChoiseView choise={choise_data} choises={choises} addChoise={addChoise} />));
  const choises_elements_2 = choises_data.slice(3, 7).map(choise_data => (<ChoiseView choise={choise_data} choises={choises} addChoise={addChoise} />));
  const choises_elements_3 = choises_data.slice(7, 10).map(choise_data => (<ChoiseView choise={choise_data} choises={choises} addChoise={addChoise} />));
  const choises_elements_4 = choises_data.slice(10, 13).map(choise_data => (<ChoiseView choise={choise_data} choises={choises} addChoise={addChoise} />));

  const report = mealReceptions.slice(-6).map(item => {
    const text = item.choises.map(choise => <span>{choise.food.name} ({choise.food.value}{choise.food.value_name}), </span>);
    return <HStack><span >{item.date.toDateString()}: </span>{text}</HStack>
  })

  return (
    <div className="App">
      <Panel header="choise">
        {report}
      </Panel>
      <MealReceptionView currentChoises={currentChoises} delChoise={delChoise} saveMealReception={saveMealReception} />
      <Panel header="choise">
        <Panel header="meal reception 1">
          {choises_elements_1}
        </Panel>
        <Panel header="meal reception 2">
          {choises_elements_2}
        </Panel>
        <Panel header="meal reception 3">
          {choises_elements_3}
        </Panel>
        <Panel header="meal reception 4">
          {choises_elements_4}
        </Panel>
      </Panel>
      <Panel>
        <Button appearance="primary" color="orange" onClick={() => startNewDay()}>start new day</Button>
      </Panel>
    </div>
  );
}

export default App;

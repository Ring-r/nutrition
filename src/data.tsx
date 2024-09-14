export interface FoodData {
  name: string;
  value: number;
  value_name: string;
}

export interface ChoiseData {
  name: string;
  food_data_list: FoodData[];
}

export interface MealReceptionData {
  name: string;
  choise_data_list: ChoiseData[];
}

const data: MealReceptionData[] = [
  {
    name: "харчування 1",
    choise_data_list: [
      {
        name: "а",
        food_data_list: [
          { name: "бобові", value: 45, value_name: "г" },
          { name: "картопля", value: 150, value_name: "г" },
          { name: "кукурудза свіжа", value: 150, value_name: "г" },
          { name: "пластівці", value: 45, value_name: "г" },
          { name: "булгур", value: 45, value_name: "г" },
          { name: "гречка", value: 45, value_name: "г" },
          { name: "рис (не шліфований)", value: 45, value_name: "г" },
          { name: "будь-яка крупа", value: 45, value_name: "г" },
          { name: "цільнозернове борошно", value: 45, value_name: "г" },
          { name: "хлібці", value: 65, value_name: "г" },
          { name: "цільнозерновий хліб", value: 70, value_name: "г" },
          { name: "макарони т.с.", value: 45, value_name: "г" },
          { name: "лаваш", value: 65, value_name: "г" },
        ],
      },
      {
        name: "б",
        food_data_list: [
          { name: "молоко (1,5-2,5%)", value: 200, value_name: "г" },
          { name: "кефір (1,5-2,5%)", value: 200, value_name: "г" },
          { name: "несолодкий йогурт (1,5-2,5%)", value: 200, value_name: "г" },
        ],
      },
      {
        name: "в",
        food_data_list: [
          { name: "будь-що (солодощі, снеки, ковбаса тощо)", value: 75, value_name: "г" },
        ],
      },
    ],
  },
  {
    name: "харчування 2",
    choise_data_list: [
      {
        name: "г",
        food_data_list: [
          { name: "бобові", value: 45, value_name: "г" },
          { name: "картопля", value: 150, value_name: "г" },
          { name: "кукурудза свіжа", value: 150, value_name: "г" },
          { name: "пластівці", value: 45, value_name: "г" },
          { name: "булгур", value: 45, value_name: "г" },
          { name: "гречка", value: 45, value_name: "г" },
          { name: "рис (не шліфований)", value: 45, value_name: "г" },
          { name: "будь-яка крупа", value: 45, value_name: "г" },
          { name: "цільнозернове борошно", value: 45, value_name: "г" },
          { name: "хлібці", value: 65, value_name: "г" },
          { name: "цільнозерновий хліб", value: 70, value_name: "г" },
          { name: "макарони т.с.", value: 45, value_name: "г" },
          { name: "лаваш", value: 65, value_name: "г" },
        ],
      },
      {
        name: "д",
        food_data_list: [
          { name: "телятина", value: 150, value_name: "г" },
          { name: "печінка", value: 150, value_name: "г" },
          { name: "куряче або індиче філе", value: 175, value_name: "г" },
          { name: "риба (до 5% жиру)", value: 180, value_name: "г" },
          { name: "риба (від 5% жиру)", value: 120, value_name: "г" },
          { name: "яйця", value: 3, value_name: "шт" },
          { name: "морепродукти", value: 200, value_name: "г" },
        ],
      },
      {
        name: "е",
        food_data_list: [
          { name: "овочі (квашені також і зелень)", value: 300, value_name: "г" },
        ],
      },
      {
        name: "є",
        food_data_list: [
          { name: "будь-яка олія", value: 10, value_name: "г" },
          { name: "майонез", value: 13, value_name: "г" },
          { name: "авокадо", value: 55, value_name: "г" },
          { name: "оливки", value: 70, value_name: "г" },
          { name: "гірчиця", value: 24, value_name: "г" },
          { name: "кетчуп", value: 36, value_name: "г" },
        ],
      },
    ],
  },
  {
    name: "харчування 3",
    choise_data_list: [
      {
        name: "ж",
        food_data_list: [
          { name: "сир зернистий (творог) 5% жиру", value: 160, value_name: "г" },
          { name: "сири м‘які, тверді, плавлені ", value: 55, value_name: "г" },
          { name: "сметана 15%", value: 110, value_name: "г" },
          { name: "масло", value: 27, value_name: "г" },
          { name: "сало", value: 19, value_name: "г" },
          { name: "кефір 2.5%", value: 360, value_name: "г" },
          { name: "несолодкий йогурт 1,6% жиру", value: 370, value_name: "г" },
          { name: "молоко 2.5%", value: 360, value_name: "г" },
        ],
      },
      {
        name: "з",
        food_data_list: [
          { name: "фрукти та ягоди (окрім банани, виноград, хурма чи манго)", value: 300, value_name: "г" },
          { name: "фрукти та ягоди (якщо це банани, виноград, хурма чи манго)", value: 250, value_name: "г" },
        ],
      },
      {
        name: "и",
        food_data_list: [
          { name: "грецьких горіхи", value: 3, value_name: "шт" },
          { name: "будь-які горіхів або насіння", value: 20, value_name: "г" },
        ],
      },
    ],
  },
  {
    name: "харчування 4",
    choise_data_list: [
      {
        name: "і",
        food_data_list: [
          { name: "телятина", value: 150, value_name: "г" },
          { name: "печінка", value: 150, value_name: "г" },
          { name: "куряче або індиче філе", value: 175, value_name: "г" },
          { name: "риба (до 5% жиру)", value: 180, value_name: "г" },
          { name: "риба (від 5% жиру)", value: 120, value_name: "г" },
          { name: "яйця", value: 3, value_name: "шт" },
          { name: "морепродукти", value: 200, value_name: "г" },
        ],
      },
      {
        name: "ї",
        food_data_list: [
          { name: "овочі (квашені також і зелень)", value: 300, value_name: "г" },
        ],
      },
      {
        name: "й",
        food_data_list: [
          { name: "будь-яка олія", value: 10, value_name: "г" },
          { name: "майонез", value: 13, value_name: "г" },
          { name: "авокадо", value: 55, value_name: "г" },
          { name: "оливки", value: 70, value_name: "г" },
          { name: "гірчиця", value: 24, value_name: "г" },
          { name: "кетчуп", value: 36, value_name: "г" },
        ],
      },
    ],
  },
]

export const getMealReveptionDataList = () => {
  return data;
}

export interface Choise {
  name: string;
  value: number;
  food_data_list: FoodData[];
}

export interface MealReception {
  name: string;
  choise_list: Choise[];
}


interface DefaultFood {
  choise_name: string;
  name: string;
  value: number;
  value_name: string;
}

export interface EditingFood extends DefaultFood {
  choise_value: number;
}

export interface ProcessedFood extends DefaultFood {
  name_real: string;
  value_real: number;
}


export const dbName = "nutrition";
export const dbReportStore = "report";
export const dbVersion = 1;

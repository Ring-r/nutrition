import { useEffect, useRef, useState } from 'react';
import { Button, FlexboxGrid, HStack, Input, Panel } from 'rsuite';

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
  const [stream, setStream] = useState<MediaStream | null>();
  const [imageSourceData, setImageSourceData] = useState<string>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef?.current) return;

    if (stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
    else {
      // todo: ???
    }
  }, [videoRef, stream]);


  useEffect(() => {
    if (!imageSourceData) return;
    if (!imageRef?.current) return;

    imageRef.current.setAttribute("src", imageSourceData);
  }, [imageSourceData]);


  const onPhotoClick = () => {
    if (!stream) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: 'environment'
          }
        })
        .then((stream_) => {
          setStream(stream_);
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
      return;
    }

    if (!canvasRef?.current) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    if (!videoRef?.current) return;

    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    context.drawImage(videoRef.current, 0, 0, width, height);

    const data = canvasRef.current.toDataURL("image/png");
    setImageSourceData(data);

    stream.getTracks().forEach((track) => {
      if (track.readyState == 'live' && track.kind === 'video') {
        track.stop();
      }
    });
    setStream(null);
  }

  return (
    <Panel header='meal reception' bordered>
      <FlexboxGrid justify="center">
        <video hidden={!stream} ref={videoRef} />
        <canvas hidden ref={canvasRef} />
        <img hidden={stream !== null || !imageSourceData} ref={imageRef} alt="The screen capture will appear in this box." />
      </FlexboxGrid>
      <FlexboxGrid justify="center">
        <Button onClick={onPhotoClick}>photo</Button>
      </FlexboxGrid>
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

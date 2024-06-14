import { useState } from 'react'
import './App.css'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

interface Item {
  id: number;
  name: string;
  age: number;
}

interface Data {
  [key: string]: Item[];
}

function App() {
  
  const items: Item[] = [
    {
      id: 1,
      name: "K. Brito",
      age: 31,
    },
    {
      id: 2,
      name: "A. Linares",
      age: 26,
    },
    {
      id: 3,
      name: "L. Ruiz",
      age: 27,
    },
  ];

  const items2: Item[] = [
    {
      id: 4,
      name: "V. Molina",
      age: 45,
    },
    {
      id: 5,
      name: "A. Garcia",
      age: 50,
    },
  ];

  const [data, setData] = useState<Data>({
    off: [...items, ...items2],
    home: [],
    firstBase: [],
    secondBase: [],
    thirdBase: [],
  });

  const handleDragEnd = (result: DropResult) => {
    // console.log(result);
    if(!result?.destination) return;
    const startIndex = result?.source?.index;
    const endIndex = result?.destination?.index;
    const startId = result?.source?.droppableId;
    const endId = result?.destination?.droppableId;
    // console.log("Start Droppable ID: ",startId);
    // console.log("End Droppable ID: ", endId);
    if (startId == endId) {
      const copyState = [...data[startId]];
      const [reorderData] = copyState.splice(startIndex, 1);
      copyState.splice(endIndex, 0, reorderData);
      setData({
        ...data,
        [startId]: copyState,
      });
      return;
    }
    const copyStateStart = [...data[startId]];
    const copyStateEnd = [...data[endId]];
    const [reorderDataStart] = copyStateStart.splice(startIndex, 1);
    // console.log(reorderDataStart);
    copyStateEnd?.splice(endIndex, 0, reorderDataStart);
    // console.log(copyStateStart);
    // console.log(copyStateEnd);
    setData({
      ...data,
      [startId]: copyStateStart,
      [endId]: copyStateEnd,
    });
  }

  const droppableContent = (itemData: Item[], itemId: string) => (
    <Droppable droppableId={itemId}>
      {(droppableProvider) => (
        <div
          ref={droppableProvider?.innerRef}
          {...droppableProvider?.droppableProps}
          className='droppable-container'
        >
          {itemData?.map((el, index) => (
            <Draggable
              index={index}
              key={el?.id}
              draggableId={el?.id.toString()}
            >
              {(draggableProvider) => (
                <div
                  ref={draggableProvider?.innerRef}
                  {...draggableProvider?.draggableProps}
                  {...draggableProvider?.dragHandleProps}
                  className='draggable-container'
                >
                  <p>
                    <span>{el?.name}</span>
                    <br />
                    <span>#{el?.age}</span>
                  </p>
                </div>
              )}
            </Draggable>
          ))}
          {droppableProvider?.placeholder}
        </div>
      )}
    </Droppable>
  )

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="container">
          {droppableContent(data?.off, "off")}
          <div className="field">
            <div className="base-unique">
              {droppableContent(data?.secondBase, "secondBase")}
            </div>
            <div className="base-two">
              {droppableContent(data?.thirdBase, "thirdBase")}
              {droppableContent(data?.firstBase, "firstBase")}
            </div>
            <div className="base-unique">
              {droppableContent(data?.home, "home")}
            </div>
          </div>
        </div>
      </DragDropContext>
    </>
  )
}

export default App

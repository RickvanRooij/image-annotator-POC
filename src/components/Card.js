import React from "react";
import { useDrag } from "react-dnd";

// Item types
const ItemTypes = {
  CARD: "card",
};

const Card = ({ id, text, position, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    item: id,
    type: ItemTypes.CARD,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    // end: (item, monitor) => {
    //   const dropResult = monitor.getDropResult();
    //   if (item && dropResult) {
    //     const { left, top } = dropResult;
    //     onMove(item, left, top);
    //   }
    // },
  });
  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {text}
    </div>
  );
};

export default Card;

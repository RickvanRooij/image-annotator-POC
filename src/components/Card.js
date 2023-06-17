import React from "react";
import { useDrag } from "react-dnd";

// Item types
const ItemTypes = {
  CARD: "card",
};

const Card = ({ id, text, position, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id, type: ItemTypes.CARD },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        border: "2px solid black",
        borderRadius: "5px",
        padding: "10px",
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

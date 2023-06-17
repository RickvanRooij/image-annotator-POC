import React from "react";
import { useDrag } from "react-dnd";

// Define the draggable item types
const ItemTypes = {
  CARD: "card",
};

// This component represents a draggable card
const Card = ({ id, text, position, onMove }) => {
  // Hook to set up drag functionality
  // useDrag returns a collect function and a drag function
  // The collect function is used to collect data about the current drag state
  // The drag function is used to assign the drag functionality to the component's DOM node
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id, type: ItemTypes.CARD }, // the data being dragged

    // collect function to update the isDragging state
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Render the card
  // The drag function is used as the ref to assign the drag functionality to the div
  // The card's opacity is reduced when it is being dragged
  return (
    <div
      ref={drag} // assign the drag functionality to this div
      style={{
        border: "2px solid black",
        borderRadius: "5px",
        padding: "10px",
        position: "absolute",
        left: position.x,
        top: position.y,
        opacity: isDragging ? 0.5 : 1, // reduce opacity when the card is being dragged
      }}
    >
      {text} // the card's text
    </div>
  );
};

export default Card;

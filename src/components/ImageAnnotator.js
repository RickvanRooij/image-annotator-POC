import React, { useCallback, useState } from "react";
import Card from "./Card";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const json = {
  imageUrl:
    "https://img.freepik.com/premium-vector/hoge-kwaliteit-kleurrijke-gelabelde-kaart-van-nederland-met-randen_97886-10506.jpg?w=2000",
  annotations: [
    { x: 198.39999389648438, y: 289, text: "Bodegraven" },
    { x: 361.3999938964844, y: 276, text: "Arnhem" },
    { x: 261.3999938964844, y: 328, text: "den Bosch" },
  ],
};

const ImageAnnotator = () => {
  const [image, setImage] = useState(json.imageUrl);
  const [annotations, setAnnotations] = useState(json.annotations);
  const [jsonInput, setJsonInput] = useState(json);
  console.log(image, annotations, jsonInput);

  const moveCard = useCallback((id, left, top) => {
    setAnnotations((prevAnnotations) => {
      const newAnnotations = [...prevAnnotations];
      const index = newAnnotations.findIndex(
        (annotation) => annotation.id === id
      );
      newAnnotations[index].position = { x: left, y: top };
      return newAnnotations;
    });
  }, []);

  const [{ isOver }, drop] = useDrop({
    accept: "card",
    drop: (item, monitor) => {
      if (!monitor.isOver()) {
        return;
      }
      const offset = monitor.getClientOffset();
      moveCard(item, offset.x, offset.y);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleImageUrlInput = (event) => {
    setImage(event.target.value);
  };

  const handleImageClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setAnnotations((prevAnnotations) => [
      ...prevAnnotations,
      { x, y, text: "" },
    ]);
  };

  const handleTextAdd = (annotationId, text) => {
    setAnnotations((prevAnnotations) =>
      prevAnnotations.map((annotation, index) =>
        index === annotationId ? { ...annotation, text } : annotation
      )
    );
  };

  const handleLoad = () => {
    try {
      const data = JSON.parse(jsonInput);
      setImage(data.imageUrl);
      setAnnotations(data.annotations);
    } catch (e) {
      console.error("Failed to parse JSON: ", e);
    }
  };

  const handleSave = () => {
    const data = {
      imageUrl: image,
      annotations: annotations,
    };
    const json = JSON.stringify(data);
    console.log(json);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <input
          type="text"
          placeholder="Enter image URL"
          onChange={handleImageUrlInput}
        />
        <input
          type="text"
          placeholder="Enter JSON"
          value={jsonInput}
          onChange={(event) => setJsonInput(event.target.value)}
        />
        <button onClick={handleLoad}>Load from JSON</button>

        {image && (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              ref={drop}
              src={image}
              alt="Upload preview"
              style={{ maxWidth: "500px" }}
            />
            {annotations.map((annotation, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: annotation.x,
                  top: annotation.y,
                  width: "10px",
                  height: "10px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
            {/* {annotations.map((annotation, index) => (
            <input
              key={index}
              type="text"
              placeholder="Add text here"
              onChange={(e) => handleTextAdd(index, e.target.value)}
            />
          ))} */}
            {annotations.map((annotation, index) => (
              <Card
                key={index}
                id={index}
                text={annotation.text}
                position={annotation.position} // Adjust this to position the cards to the right of the image
                onMove={moveCard}
              />
            ))}
          </div>
        )}
        <button onClick={handleSave}>Save to JSON</button>
      </div>
    </DndProvider>
  );
};

export default ImageAnnotator;

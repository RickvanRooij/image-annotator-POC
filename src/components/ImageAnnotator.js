import React, { useState } from "react";
import Card from "./Card";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";

const json = {
  imageUrl:
    "https://img.freepik.com/premium-vector/hoge-kwaliteit-kleurrijke-gelabelde-kaart-van-nederland-met-randen_97886-10506.jpg?w=2000",
  annotations: [
    {
      id: 0,
      x: 198.39999389648438,
      y: 289,
      text: "Bodegraven",
      finished: false,
    },
    { id: 1, x: 361.3999938964844, y: 276, text: "Arnhem", finished: false },
    { id: 2, x: 261.3999938964844, y: 328, text: "den Bosch", finished: false },
  ],
};

const ImageAnnotator = () => {
  const [image, setImage] = useState(json.imageUrl ? json.imageUrl : null);
  const [annotations, setAnnotations] = useState(
    json.annotations ? json.annotations : []
  );
  const [jsonInput, setJsonInput] = useState(JSON.stringify(json));

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

  const ImageAnnotatorContent = ({
    imageUrl,
    annotations,
    setImage,
    setAnnotations,
    jsonInput,
    setJsonInput,
  }) => {
    const [, drop] = useDrop({
      accept: "card",
      drop: (item, monitor) => {
        console.warn("dropping");
        const dropPosition = monitor.getClientOffset();
        let annotationIndex = annotations.findIndex((a) => a.id === item.id);
        if (annotationIndex !== -1) {
          const deltaX = dropPosition.x - annotations[annotationIndex].x;
          const deltaY = dropPosition.y - annotations[annotationIndex].y;
          if (deltaX <= 50 && deltaY <= 50) {
            console.log("Dropped on annotation");
            setAnnotations((prevAnnotations) =>
              prevAnnotations.map((annotation, index) =>
                index === annotationIndex
                  ? { ...annotation, finished: true }
                  : annotation
              )
            );
            console.log(annotations);
          } else {
            console.log("Wrong");
          }
        }
      },
    });

    return (
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
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={image}
            alt="User provided"
            onClick={handleImageClick}
            style={{ maxWidth: "500px" }}
            ref={drop}
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
                backgroundColor: annotation.finished ? "green" : "red",
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
          {annotations.map((annotation, index) => {
            if (!annotation.finished) {
              return (
                <Card
                  key={index}
                  id={index}
                  text={annotation.text}
                  position={{ x: 600, y: 50 * index }} // Adjust this to position the cards to the right of the image
                />
              );
            }
          })}
        </div>
        <button onClick={handleSave}>Save to JSON</button>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {image && annotations.length ? (
        <ImageAnnotatorContent
          image={image}
          annotations={annotations}
          setImage={setImage}
          setAnnotations={setAnnotations}
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
        />
      ) : null}
    </DndProvider>
  );
};

export default ImageAnnotator;

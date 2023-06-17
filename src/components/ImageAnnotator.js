// Importing necessary dependencies and hooks
import React, { useState, useRef, useEffect } from "react";
import Card from "./Card";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";

// JSON data for image URL and annotations (markers on the image)
const json = {
  imageUrl:
    "https://img.freepik.com/premium-vector/hoge-kwaliteit-kleurrijke-gelabelde-kaart-van-nederland-met-randen_97886-10506.jpg?w=2000",
  annotations: [
    { id: 1, x: 0.714, y: 0.5435999984741211, text: "Arnhem" },
    { id: 2, x: 0.494, y: 0.5255999984741211, text: "Utrecht" },
    { id: 3, x: 0.524, y: 0.6635999984741211, text: "Den Bosch" },
  ],
};

// Main component for image annotations
const ImageAnnotator = () => {
  // State for storing image URL, annotations, and json input
  const [image, setImage] = useState(json.imageUrl ? json.imageUrl : null);
  const [annotations, setAnnotations] = useState(
    json.annotations ? json.annotations : []
  );
  const [jsonInput, setJsonInput] = useState(JSON.stringify(json));

  // useRef to reference the image element
  const imageRef = useRef(null);

  // State for storing window dimensions
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Effect hook for handling window resize event
  useEffect(() => {
    const handleSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleSize);
    return () => window.removeEventListener("resize", handleSize);
  }, []);

  // Handler for image URL input change
  const handleImageUrlInput = (event) => {
    setImage(event.target.value);
  };

  // Handler for click event on image to create new annotation
  const handleImageClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setAnnotations((prevAnnotations) => [
      ...prevAnnotations,
      { x, y, text: "" },
    ]);
  };

  // Handler for loading annotations from JSON input
  const handleLoad = () => {
    try {
      const data = JSON.parse(jsonInput);
      setImage(data.imageUrl);
      setAnnotations(data.annotations);
    } catch (e) {
      console.error("Failed to parse JSON: ", e);
    }
  };

  // Handler for saving annotations to JSON
  const handleSave = () => {
    const data = {
      imageUrl: image,
      annotations: annotations,
    };
    const json = JSON.stringify(data);
    console.log(json);
  };

  // Sub-component for content of the image annotator
  const ImageAnnotatorContent = ({
    imageUrl,
    annotations,
    setImage,
    setAnnotations,
    jsonInput,
    setJsonInput,
  }) => {
    // State for tracking if the image is loaded
    const [imageLoaded, setImageLoaded] = useState(false);

    // Hook to set up drop target for drag and drop functionality
    const [, drop] = useDrop({
      accept: "card",
      drop: (item, monitor) => {
        console.warn("dropping");
        const dropPosition = monitor.getClientOffset();
        const rect = imageRef.current.getBoundingClientRect();
        const adjustedDropPosition = {
          x: (dropPosition.x - rect.left) / rect.width,
          y: (dropPosition.y - rect.top) / rect.height,
        };
        let annotationIndex = annotations.findIndex((a) => a.id === item.id);
        if (annotationIndex !== -1) {
          const deltaX = Math.abs(
            adjustedDropPosition.x - annotations[annotationIndex].x
          );
          const deltaY = Math.abs(
            adjustedDropPosition.y - annotations[annotationIndex].y
          );
          if (deltaX <= 0.05 && deltaY <= 0.05) {
            // Adjust these values as needed
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

    // Return the JSX for the ImageAnnotatorContent
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
        <div
          style={{
            position: "relative",
            display: "inline-block",
            width: "100%",
            height: "100%",
          }}
          ref={drop}
        >
          <img
            src={image}
            alt="User provided"
            onClick={handleImageClick}
            style={{ maxWidth: "100%", height: "90vh" }}
            ref={imageRef}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded
            ? null
            : annotations.map((annotation, index) => {
                if (
                  imageRef.current === null ||
                  windowSize.width === 0 ||
                  windowSize.height === 0
                )
                  return null;
                const rect = imageRef.current.getBoundingClientRect();
                const x = annotation.x * rect.width;
                const y = annotation.y * rect.height;

                return (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      left: x,
                      top: y,
                      width: "10px",
                      height: "10px",
                      backgroundColor: annotation.finished ? "green" : "red",
                      borderRadius: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                );
              })}
          {annotations.map((annotation, index) => {
            if (!annotation.finished) {
              return (
                <Card
                  key={index}
                  id={annotation.id}
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

  // The main component that uses the DndProvider and renders the ImageAnnotatorContent
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

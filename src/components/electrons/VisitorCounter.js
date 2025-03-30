import React from "react";
import { useLocation } from "react-router-dom";

const VisitorCounter = ({ 
  display = true, 
  height = 125,
  useBackground = false,
  useBorder = false
}) => {
  const location = useLocation();

  // Don't render if display prop is false or on root path
  if (!display || location.pathname === "/") {
    return null;
  }

  return (
    <div
      id="visitor-counter"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        width: "100%",
        ...(useBackground && { backgroundColor: "#f8f9fa" }),
        ...(useBorder && { borderTop: "1px solid #e9ecef" }),
      }}
    >
      <iframe
        srcDoc={`
          <html>
            <head>
              <style>
                body { 
                  margin: 0; 
                  display: flex; 
                  justify-content: center; 
                  align-items: center;
                  overflow: hidden; /* Prevent scrolling */
                }
              </style>
            </head>
            <body>
              <a href="http://www.freevisitorcounters.com">freecounter</a>
              <script type="text/javascript" src="https://www.freevisitorcounters.com/auth.php?id=7f1dec25f789556efcec257e8d9f8532d7450c08"></script>
              <script type="text/javascript" src="https://www.freevisitorcounters.com/en/home/counter/1321420/t/0"></script>
            </body>
          </html>
        `}
        style={{
          border: "none",
          width: "100%",
          height: `${height}px`,
        }}
        scrolling="no"
        title="Visitor Counter"
      ></iframe>
    </div>
  );
};

export default VisitorCounter;
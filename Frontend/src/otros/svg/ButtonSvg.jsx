// ButtonSvg.jsx

const ButtonSvg = (white) => (
  <>
    <svg
      className="absolute top-0 left-0"
      width="100%"
      height="100%"
      viewBox="0 0 100 44"
    >
      <rect
        fill={white ? "white" : "none"}
        stroke={white ? "white" : "url(#btn-border)"} // Puedes definir los bordes del botón aquí
        strokeWidth="2"
        rx="6" // Este atributo define el radio de las esquinas redondeadas
        width="100%"
        height="100%"
      />
    </svg>
  </>
);

export default ButtonSvg;

import { extendTheme } from '@chakra-ui/react'

import { ComponentStyleConfig } from '@chakra-ui/react'


export default extendTheme({
  "colors": {
    "gray": {
      "50": "#FAFAFB",
      "100": "#EDEDF2",
      "200": "#D2D4DE",
      "300": "#B9BBCB",
      "400": "#A0A3B9",
      "500": "#858AA5",
      "600": "#6A7191",
      "700": "#545D81",
      "800": "#434A65",
      "900": "#363A4F"
    },
    "red": {
      "50": "#FCE8EE",
      "100": "#F8BFCF",
      "200": "#F396B0",
      "300": "#EE6D91",
      "400": "#E94472",
      "500": "#E51A53",
      "600": "#B71542",
      "700": "#891032",
      "800": "#5B0B21",
      "900": "#2E0511"
    },
    "yellow": {
      "50": "#FFF8E6",
      "100": "#FEEDB9",
      "200": "#FDE18C",
      "300": "#FCD55F",
      "400": "#FCCA31",
      "500": "#FBBE04",
      "600": "#C99803",
      "700": "#967203",
      "800": "#644C02",
      "900": "#322601"
    },
    "purple": {
      "50": "#F0E7FE",
      "100": "#D6BBFB",
      "200": "#BC90F9",
      "300": "#A264F7",
      "400": "#8839F4",
      "500": "#6E0DF2",
      "600": "#580AC2",
      "700": "#420891",
      "800": "#2C0561",
      "900": "#160330"
    },
    "pink": {
      "50": "#FCE9F7",
      "100": "#F6C1E9",
      "200": "#F099DB",
      "300": "#EA71CD",
      "400": "#E449BF",
      "500": "#DE21B1",
      "600": "#B21A8E",
      "700": "#85146A",
      "800": "#590D47",
      "900": "#2C0723"
    },
    "blue": {
      "50": "#EAF0FA",
      "100": "#C4D5F2",
      "200": "#9FB9EA",
      "300": "#799EE2",
      "400": "#5483D9",
      "500": "#2E67D1",
      "600": "#2553A7",
      "700": "#1C3E7D",
      "800": "#122954",
      "900": "#09152A"
    },
    "orange": {
      "50": "#FEF4E6",
      "100": "#FDE0B9",
      "200": "#FCCC8C",
      "300": "#FBB860",
      "400": "#FAA433",
      "500": "#F99006",
      "600": "#C77305",
      "700": "#955604",
      "800": "#643902",
      "900": "#321D01"
    },
    "teal": {
      "50": "#EFFCF8",
      "100": "#cbf7ea",
      "200": "#a1f0d8",
      "300": "#6de8c3",
      "400": "#27dda7",
      "500": "#0ccb92",
      "600": "#0bb683",
      "700": "#099c70",
      "800": "#077b59",
      "900": "#044934"
    },
    "cyan": {
      "50": "#E5FFFE",
      "100": "#B8FFFD",
      "200": "#8AFFFC",
      "300": "#5CFFFB",
      "400": "#2EFFFA",
      "500": "#00FFF8",
      "600": "#00CCC7",
      "700": "#009995",
      "800": "#006663",
      "900": "#003332"
    },
    "green": {
      "50": "#F1F9EC",
      "100": "#D8EEC9",
      "200": "#BFE3A6",
      "300": "#A6D883",
      "400": "#8DCD60",
      "500": "#74C23D",
      "600": "#5C9B31",
      "700": "#457425",
      "800": "#2E4E18",
      "900": "#17270C"
    }
  },
  fonts: {
    body: `Orbitron, system-ui, sans-serif`,
    heading: `Orbitron, Georgia, serif`,
    mono: `Menlo, monospace`,
  },
  components: {
    Button: {
      variants: {
        solid: {
          fontWeight: "normal",
          fontSize: "12px",
          borderRadius: "4px",
          color: "white",
          border: "1px solid",
          borderColor: "#099E71",
          bg: "#099E71",
          _hover: {
            border: "1px solid",
            borderColor: "#3BEFB8",
            bg: "#08825D"
          },
          _active: {
            border: "1px solid",
            borderColor: "#3BEFB8",
            bg: "#05563D"
          }
        }
      }
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: "8px",
          color: "white",
          bg: "linear-gradient(311.18deg, #1B1B3A 67.03%, #313168 100%)",
          boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }
      }
    },
    Checkbox: {
      baseStyle: {
        control: {
          bg: "rgba(255, 255, 255, 0.2)",
          _checked: {
            borderColor: "#3BEFB8",
            bg: "#099E71",
            _hover: {
              borderColor: "#3BEFB8",
              bg: "#08825D"
            }
          },
          _hover: {
            bg: "#099E71"
          },
          _disabled: {
            bg: "#099E71"

          }
        }
      }
    }
  }
})
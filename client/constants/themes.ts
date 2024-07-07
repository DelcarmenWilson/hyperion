export const themes = [
  {
    name: "zinc",
    label: "Zinc",
    activeColor: {
      light: "240 5.9% 10%",
      dark: "240 5.2% 33.9%",
    },
  },
  {
    name: "red",
    label: "Red",
    activeColor: {
      light: "0 72.2% 50.6%",
      dark: "0 72.2% 50.6%",
    },
  },  
  {
    name: "orange",
    label: "Orange",
    activeColor: {
      light: "24.6 95% 53.1%",
      dark: "20.5 90.2% 48.2%",
    },
  },  
  {
    name: "yellow",
    label: "Yellow",
    activeColor: {
      light: "47.9 95.8% 53.1%",
      dark: "47.9 95.8% 53.1%",
    },
  },
  {
    name: "emerald",
    label: "Emerald",
    activeColor: {
      light: "149 83.3% 57.8%",
      dark: "148 70% 50.4%",
    },
  },  
  {
    name: "green",
    label: "Green",
    activeColor: {
      light: "142.1 76.2% 36.3%",
      dark: "142.1 70.6% 45.3%",
    },
  },  
  {
    name: "blue",
    label: "Blue",
    activeColor: {
      light: "221.2 83.2% 53.3%",
      dark: "217.2 91.2% 59.8%",
    },
  },
  {
    name: "violet",
    label: "Violet",
    activeColor: {
      light: "262.1 83.3% 57.8%",
      dark: "263.4 70% 50.4%",
    },
  },
  {
    name: "pink",
    label: "Pink",
    activeColor: {
      light: "-38 83.3% 57.8%",
      dark: "-37 70% 50.4%",
    },
  },

  {
    name: "gold",
    label: "Gold",
    activeColor: {
      light: "54 100% 50%",
      dark: "54 100% 50%",
    },
  },


  
] as const;

export type Theme = (typeof themes)[number];

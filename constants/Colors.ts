import { Theme } from "@react-navigation/native";

const colorsLight: Theme["colors"] = {
  primary: "red", // primary: "#FB773C",
  background: 'blue', // background: "#efebf2",
  card: 'green',// card: "#4F1787",
  text: 'tomato',// text: "#EB3678",
  border: 'black',// border: "red",
  notification: "yellow",
};
const colorsDark: Theme["colors"] = {
  primary: "#FB773C",
  background: "#180161",
  card: "#4F1787",
  text: "#EB3678",
  border: "red",
  notification: "yellow",
};

export default { colorsLight, colorsDark: colorsLight } as const;
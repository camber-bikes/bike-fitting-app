import { Text, Pressable, StyleSheet, ViewStyle } from "react-native";

type ButtonType = "primary" | "secondary";

type ButtonProps = {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  disabled?: boolean;
  style?: ViewStyle;
};

type ButtonPropsValid = {
  title: string;
  onPress: () => void;
  type: ButtonType;
  disabled: boolean;
  style: ViewStyle;
};

const defaultProps: ButtonPropsValid = {
  title: "",
  onPress: () => {},
  type: "primary",
  disabled: false,
  style: {},
};

export default function Button(props: ButtonProps) {
  const propsWithDefaults: ButtonPropsValid = { ...defaultProps, ...props };
  const { title, type, onPress, disabled, style } = propsWithDefaults;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.pressable, styles[type], style]}
    >
      <Text style={[styles.text, styles[`text${type}`]]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,

    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  primary: {
    backgroundColor: "#3f96fd",
    paddingVertical: 20,
  },
  secondary: {
    backgroundColor: "white",
    borderColor: "lightgray",
    borderWidth: 5,
    paddingVertical: 16,
  },
  text: {
    fontSize: 33,
  },
  textprimary: {
    color: "white",
    fontWeight: "bold",
  },
  textsecondary: {
    color: "#3f96fd",
    fontWeight: "bold",
  },
});

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
      onPress={() => {
        if (!disabled) onPress();
      }}
      style={[
        styles.pressable,
        styles[type],
        style,
        disabled && styles.disabledStyle,
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text${type}`],
          disabled && styles.disabledTextStyle,
        ]}
      >
        {title}
      </Text>
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
    paddingVertical: 15,
  },
  secondary: {
    backgroundColor: "white",
    borderColor: "#3f96fd",
    borderWidth: 0,
    paddingVertical: 15,
    shadowRadius: 1,
    shadowOpacity: 0.25,
  },
  disabledStyle: {
    backgroundColor: "gray",
  },
  text: {
    fontSize: 23,
  },
  textprimary: {
    color: "white",
    fontWeight: "bold",
  },
  textsecondary: {
    color: "#3f96fd",
    fontWeight: "bold",
  },
  disabledTextStyle: {
    color: "lightgray",
  },
});

import {Button, Pressable, StyleSheet, TextInput, View} from "react-native";
import React, {useState} from "react";
import {useNavigation} from '@react-navigation/native';

export default function PersoninformationScreen() {
    const navigation = useNavigation();
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const isButtonDisabled = !input1 || !input2;

    return (
        <View style={styles.formContainer}>
            <p>Enter your username:</p>
            <TextInput
                style={styles.input}
                value={input1}
                onChangeText={setInput1}
                keyboardType="text"
            />
            <p>Enter your height in cm</p>
            <TextInput
                style={styles.bottomInput}
                value={input2}
                onChangeText={setInput2}
                keyboardType="numeric"
            />
            <Button
                onPress={() => navigation.navigate("tutorial")}
                children={undefined}
                title={"Submit"}
                color={"#de78b2"}
                disabled={isButtonDisabled}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        margin: "3%"
    },
    input: {
        width: "100%",
        padding: "2%",
        borderStyle: "solid",
        borderWidth: "2px",
        borderColor: "gray",
        borderRadius: 15
    },
    bottomInput: {
        width: "100%",
        padding: "2%",
        borderStyle: "solid",
        borderWidth: "2px",
        borderColor: "gray",
        borderRadius: 15,
        marginBottom: "10%"
    }
});
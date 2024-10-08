import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraButton(){

    return(
        <View>

        </View>
    );
    
}

const styles = StyleSheet.create({
    photoButton: {
        width: 100,
        height: 100,
        top: "50%",
        left: "50%",
        marginTop: -50,
        marginLeft: -50,
        position: "absolute"
    },
    circle:{
        position: "absolute",
        top: "12%",
        left: "12%",
        bottom: "12%",
        right: "12%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        borderBottomLeftRadius: 100,
        backgroundColor: "#ffffff",
        opacity: 0
    },
    ring:{

    },
});

/*
return(
        <>
            <View style={styles.photoButton} >
                <View style={styles.circle}></View>
                <View style={styles.ring}></View>
            </View>
        </>
    );
*/

import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import { VscArrowDown } from 'react-icons/vsc';

export default InstructionCard = ({ direction, amount }) => {
  const [isToggled, setIsToggled] = useState(false);
  const [heightAnimation] = useState(new Animated.Value(0)); // Height animation value

  const toggleAccordion = () => {
    setIsToggled(old => !old);

    // Animate height change based on toggle state
    Animated.timing(heightAnimation, {
      toValue: isToggled ? 0 : 200,  // You can adjust this to the content height
      duration: 300,                 // Animation duration (ms)
      useNativeDriver: false,
    }).start();
  };

  return (
    <View>
      <View onClick={toggleAccordion} style={styles.card}>
        <View style={styles.cardTitle}>
          <View style={styles.iconHolder}>
            <View style={styles.saddleIconContainer}>
              <Image
                source={require('@/assets/images/saddle.png')}
                style={styles.saddleIcon}
              />
            </View>
            <VscArrowDown style={styles.arrowIcon} />
          </View>
          <Text style={styles.resultText}>{`${amount} cm.`}</Text>
          <Text style={styles.resultText}>{`Move saddle ${direction}`}</Text>
        </View>
      </View>
      <Animated.View style={[styles.cardContent, { height: heightAnimation }]}>
        {isToggled && (
          <View>
            <Text style={styles.resultText}>
              arst arstoi oeiarnsto neioar nsetioa rnseiot nrseoat nseioarnsetio resiroa sr
              eorans to neriao snteio raoie tsneioarsnetio rnaesiot nersioa snteo rsneitao nseraio tnserioa
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultText: {
    fontSize: "4vw",
    padding: "2%",
    marginHorizontal: "3%",
    marginVertical: "3%"
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: "3%",
    paddingHorizontal: "2%",
    marginBottom: "3%",
    borderRadius: 5,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  cardContent: {
    overflow: 'hidden',
    transition: 'height 0.3s ease',
  },
  saddleIconContainer: {
    width: '8vw',
    aspectRatio: 1,
    position: 'relative',
    alignSelf: 'center',
    marginLeft: "10%",
  },
  saddleIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  arrowIcon: {
    height: '8vw',
    width: '8vw',
    alignSelf: 'center',
  },
  iconHolder: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

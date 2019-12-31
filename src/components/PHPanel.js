import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Dimensions } from 'react-native';
import { Text, Button, Icon, Slider } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import { Line } from 'react-native-svg';


export default class PHPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: true,
            desiredPHValue: this.props.desiredData.pH_Value,
        };
        this.toggle = this.toggle.bind(this);
        this.calcPHData = this.calcPHData.bind(this);
    }



    toggle() {
        this.setState({
            isCollapsed: !this.state.isCollapsed
        })
    }

    calcPHData(phs) {
        let minPh = Math.min(...phs);
        let maxPh = Math.max(...phs);
        let avgPh = Math.round(phs.reduce((a, b) => a + b, 0) / phs.length)
        let currentPh = phs[phs.length - 1]
        return [minPh, maxPh, avgPh, currentPh]
    }

    render() {
        let { isCollapsed, desiredPHValue } = this.state;
        let { sensorData, desiredData } = this.props;
        let [minPh, maxPh, avgPh, currentPh] = this.calcPHData(sensorData.pH_Value);
        const HorizontalLine = (({ y }) => (
            <Line
                key={'zero-axis'}
                x1={'0%'}
                x2={'100%'}
                y1={y(desiredPHValue)}
                y2={y(desiredPHValue)}
                stroke={'grey'}
                strokeDasharray={[4, 8]}
                strokeWidth={2}
            />
        ))
        return (
            <View>
                <TouchableHighlight onPress={this.toggle} underlayColor={'transparent'}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>pH</Text>
                        <Icon
                            name={isCollapsed ? 'arrow-right-bold' : 'arrow-down-bold'}
                            size={18}
                            type="material-community"
                        />
                    </View>
                </TouchableHighlight>
                <Collapsible collapsed={isCollapsed}>
                    <Text style={styles.lastUpdateLabel}>{`Last update: ${sensorData.timestamp}`}</Text>
                    <View style={styles.container}>
                        <View style={styles.currentTempCont}>
                            <Text style={styles.dataText}>{`${currentPh}`}</Text>
                            <Text style={styles.dataLabel}>pH Level</Text>
                        </View>
                        <View style={styles.sensorSummary}>
                            <View style={styles.dataContainer}>
                                <Text style={styles.dataText}>{`${minPh}`}</Text>
                                <Text style={styles.dataLabel}>Min pH Level</Text>
                            </View>
                            <View style={styles.dataContainer}>
                                <Text style={styles.dataText}>{`${avgPh}`}</Text>
                                <Text style={styles.dataLabel}>Avg pH Level</Text>
                            </View>
                            <View style={styles.dataContainer}>
                                <Text style={styles.dataText}>{`${maxPh}`}</Text>
                                <Text style={styles.dataLabel}>Max pH Level</Text>
                            </View>

                        </View>
                        <View>
                            <Text style={styles.pHAdjustmentHeader}>pH Adjustment</Text>
                            <Text>{`The system is ${sensorData.pH_DispensingPlus ? sensorData.pH_DispensingMinus ? '' : '' : 'not '}currently dispensing a pH adjustment solution`}</Text>
                            <View>
                                <Slider
                                    value={desiredPHValue}
                                    onValueChange={value => {
                                        this.setState({ desiredPHValue: value })
                                    }}
                                    onSlidingComplete={value => this.props.callBackFunction(value, "pH_Value")}
                                    animateTransitions={true}
                                    maximumValue={8}
                                    minimumValue={4}
                                    step={0.1}
                                    thumbTintColor={'rgba(0, 153, 51, 1)'}
                                />
                                <Text style={{ textAlign: 'center' }}>{`Desired pH: ${desiredPHValue}`}</Text>
                            </View>
                        </View>
                        <View style={{ height: 200, flexDirection: 'row' }}>
                            <YAxis
                                data={sensorData.pH_Value}
                                contentInset={{ top: 20, bottom: 20 }}
                                svg={{
                                    fill: 'grey',
                                    fontSize: 10,
                                }}
                                numberOfTicks={10}
                                formatLabel={value => `${value}`}
                            />
                            <LineChart
                                style={{ flex: 1, marginLeft: 16, paddingBottom: -10 }}
                                data={sensorData.pH_Value}
                                svg={{ stroke: 'rgba(0, 153, 51, 1)' }}
                                contentInset={{ top: 20, bottom: 10 }}
                                animate={true}
                            >
                                <Grid />
                                <HorizontalLine />
                            </LineChart>

                        </View>
                        <Text style={styles.graphlabel}>Dotted line represents the desired pH</Text>
                    </View>
                </Collapsible>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerText: {
        fontWeight: 'bold',
        fontSize: 18,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
    },
    dataLabel: {
        fontWeight: 'bold',
        fontSize: 12
    },
    dataContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 4,
        alignItems: 'center'
    },
    sensorSummary: {
        padding: 10,
        paddingTop: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    lastUpdateLabel: {
        fontStyle: 'italic',
        fontSize: 12
    },
    dataText: {
        fontSize: 20
    },
    container: {
        display: 'flex',
        flexDirection: 'column'
    },
    currentTempCont: {
        alignItems: 'center',
        padding: 15,
        paddingBottom: 0
    },
    pHAdjustmentHeader: {
        fontWeight: 'bold',
        paddingTop: 8,
        paddingBottom: 8
    },
    graphlabel: {
        fontStyle: 'italic',
        fontSize: 12,
        textAlign: 'center',
        paddingTop: -10
    }
})
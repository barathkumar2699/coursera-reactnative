import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import * as Animatable from 'react-native-animatable';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import * as Permissions  from 'expo-permissions';
// import * as Notifications from 'expo-notifications';
import { Constants, Notifications } from 'expo';
import * as Calendar from 'expo-calendar';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        }
    }
    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };

    handleReservation() {
        console.log(JSON.stringify(this.state));
        Alert.alert(
            'Your Reservation OK?',
            'Number of Guests: ' + this.state.guests + '\nSmoking? ' + this.state.smoking + '\nDate and Time: ' + this.state.date,
            [
            {text: 'Cancel', onPress: () => this.resetForm(), style: 'cancel'},
            {text: 'OK', onPress: () => {
                this.presentLocalNotification(this.state.date);
                this.addReservationToCalendar(this.state.date);
                this.resetForm();
                }
            },
            ],
            { cancelable: false }
        );
        //this.toggleModal();
    }
    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        });
    }

    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to calendar');
            }
        }
        return permission;
    }

    async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();

        let dateMs = Date.parse(date);
        let startDate = new Date(dateMs);
        let endDate = new Date(dateMs + 2 * 60 * 60 * 1000);

        const defaultCalendarSource =
  
        Platform.OS === 'ios'
        
        ? await getDefaultCalendarSource()
        
        : { isLocalAccount: true, name: 'Expo Calendar' };
      
        let details = {
        
        title: 'Con Fusion Table Reservation',
        
        source: defaultCalendarSource,
        
        name: 'internalCalendarName',
        
        color: 'blue',
        
        entityType: Calendar.EntityTypes.EVENT,
        
        sourceId: defaultCalendarSource.id,
        
        ownerAccount: 'personal',
        
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
        
        }
      
      
      
        const calendarId = await Calendar.createCalendarAsync(details);
      
      
      
        await Calendar.createEventAsync(calendarId , {
      
        title: 'Con Fusion Table Reservation',
        
        startDate: startDate,
        
        endDate: endDate,
        
        timeZone: 'Asia/Hong_Kong',
        
        location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        
        });
      
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        console.log(permission)
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        console.log(date);
        await this.obtainNotificationPermission();
        Notifications.createChannelAndroidAsync('Confusion', {
            name: 'Confusion',
            sound: true,
            vibrate: true
        })
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true,
                _displayInForeground: true
            },
            android: {
                channelId: 'Confusion',
                vibrate: true,
                color: '#512DA8'
            }
        });
    }


    
    
    componentDidMount(){
        // if (Platform.OS === 'android') {

        //     Notifications.createChannelAndroidAsync('reservation', {
            
        //     name: 'Confusion',
            
        //     sound: true,
            
        //     vibrate: [0, 250, 250, 250],
            
        //     priority: 'max',
            
        //     });
            
        //     }
    }
    
    render() {
        return(
            <ScrollView>
                <Animatable.View animation = "zoomInDown" duration = {2000} delay = {1000}>
                    <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Guests</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.guests}
                        onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                        <Picker.Item label="1" value="1" />
                        <Picker.Item label="2" value="2" />
                        <Picker.Item label="3" value="3" />
                        <Picker.Item label="4" value="4" />
                        <Picker.Item label="5" value="5" />
                        <Picker.Item label="6" value="6" />
                    </Picker>
                    </View>
                    <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.smoking}
                        onTintColor='#512DA8'
                        onValueChange={(value) => this.setState({smoking: value})}>
                    </Switch>
                    </View>
                    <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date and Time</Text>
                    <DatePicker
                        style={{flex: 2, marginRight: 20}}
                        date={this.state.date}
                        format=''
                        mode="datetime"
                        placeholder="select date and Time"
                        minDate="2017-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                        // ... You can check the source to find the other keys. 
                        }}
                        onDateChange={(date) => {this.setState({date: date})}}
                    />
                    </View>
                    <View style={styles.formRow}>
                    <Button
                        onPress={() => this.handleReservation()}
                        title="Reserve"
                        color="#512DA8"
                        accessibilityLabel="Learn more about this purple button"
                        />
                    </View>

                    <Modal animationType = {"slide"} transparent = {false}
                        visible = {this.state.showModal}
                        onDismiss = {() => this.toggleModal() }
                        onRequestClose = {() => this.toggleModal() }>
                        <View style = {styles.modal}>
                            <Text style = {styles.modalTitle}>Your Reservation</Text>
                            <Text style = {styles.modalText}>Number of Guests: {this.state.guests}</Text>
                            <Text style = {styles.modalText}>Smoking?: {this.state.smoking ? 'Yes' : 'No'}</Text>
                            <Text style = {styles.modalText}>Date and Time: {this.state.date}</Text>
                            
                            <Button 
                                onPress = {() =>{this.toggleModal(); this.resetForm();}}
                                color="#512DA8"
                                title="Close" 
                                />
                        </View>
                    </Modal>
                </Animatable.View>
            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     }
});

export default Reservation;
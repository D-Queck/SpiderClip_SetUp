#include <ArduinoBLE.h>
#include "DFRobot_Heartrate.h"
#include <Arduino_LSM6DS3.h>
#define heartratePin A0

int PowerPin = 12;     
DFRobot_Heartrate heartrate(DIGITAL_MODE);   // ANALOG_MODE or DIGITAL_MODE
BLEService ledService("19B10000-E8F2-537E-4F6C-D104768A1214"); // BLE LED Service
BLEIntCharacteristic ConfidenceCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1212", BLERead | BLEWrite);
BLEIntCharacteristic OxygenCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1213", BLERead | BLEWrite);
BLEIntCharacteristic HrCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite);
BLEIntCharacteristic AccxCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1215", BLERead | BLEWrite);
BLEIntCharacteristic AccyCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1216", BLERead | BLEWrite);
BLEIntCharacteristic AcczCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1217", BLERead | BLEWrite);

// --------------------- Setup ------------------------
void setup() {
  pinMode(PowerPin, OUTPUT);     
  digitalWrite(PowerPin, HIGH);   
  Serial.begin(9600);
  delay(2000); //for the HR
  Serial.println("Started");

  if (!IMU.begin()) { //IMU INIT
      Serial.println("Failed to initialize IMU!");
      while (1);
  }
      
  if (!BLE.begin()) { // BLE initialization
    Serial.println("starting BLE failed!");
    while (1);
  }

  // set advertised local name and service UUID:
  BLE.setLocalName("LED");
  BLE.setAdvertisedService(ledService);
  delay(20); //for the HR

  // add the characteristic to the service:
  ledService.addCharacteristic(HrCharacteristic);
  ledService.addCharacteristic(ConfidenceCharacteristic);
  ledService.addCharacteristic(OxygenCharacteristic);
  ledService.addCharacteristic(AccxCharacteristic);
  ledService.addCharacteristic(AccyCharacteristic);
  ledService.addCharacteristic(AcczCharacteristic);
  delay(20); //for the HR

  // add service:
  BLE.addService(ledService);
  delay(20); //for the HR

  // set the initial value for the characeristic:
  HrCharacteristic.writeValue(0);
  OxygenCharacteristic.writeValue(0);
  ConfidenceCharacteristic.writeValue(0);
  AccxCharacteristic.writeValue(0);
  AccyCharacteristic.writeValue(0);
  AcczCharacteristic.writeValue(0);

  BLE.advertise(); // start advertising
  Serial.println("BLE LED Peripheral");
  delay(2000); //for the HR
  }

// --------------------- Loop ------------------------
  void loop() {

    Serial.println("Started");
    
    // listen for BLE peripherals to connect:
    BLEDevice central = BLE.central();

    // if a central is connected to peripheral:
    if (central) {
      Serial.print("Connected to central: ");
      // print the central's MAC address:
      Serial.println(central.address());

      // while the central is still connected to peripheral:
      while (central.connected()) {
        //HR
        uint8_t rateValue;
        heartrate.getValue(heartratePin);   // A1 foot sampled values
        rateValue = heartrate.getRate();   // Get heart rate value 
        Serial.println(rateValue);

        if(rateValue)  {
            Serial.println(rateValue);
            HrCharacteristic.writeValue(rateValue);
            }
        delay(20);
      
        float x, y, z; //for Acc
        
        if (IMU.accelerationAvailable()) {
          IMU.readAcceleration(x, y, z);
              int intx, inty ,intz;
              intx = (int) (x*1000); //send them as ints then restoring them to float on the other device
              inty = (int) (y*1000);
              intz = (int) (z*1000);

        Serial.println(intx);
        }

      ConfidenceCharacteristic.writeValue(body.confidence);
      OxygenCharacteristic.writeValue(body.oxygen);

      AccxCharacteristic.writeValue(1);
      AccyCharacteristic.writeValue(1);
      AcczCharacteristic.writeValue(1);
      }

    // when the central disconnects, print it out:
    Serial.print(("Disconnected from central: "));
    Serial.println(central.address());
    }//end of BLE
}
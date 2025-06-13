#include <ArduinoBLE.h>
#include "DFRobot_Heartrate.h"
#include <Arduino_LSM6DS3.h>

#define heartratePin A0
int  PowerPin = 12;
DFRobot_Heartrate heartrate(DIGITAL_MODE);   // ANALOG_MODE oder DIGITAL_MODE

BLEService        sensorService("19B10000-E8F2-537E-4F6C-D104768A1214");
BLEIntCharacteristic ConfidenceCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1212", BLERead);
BLEIntCharacteristic OxygenCharacteristic    ("19B10001-E8F2-537E-4F6C-D104768A1213", BLERead);
BLEIntCharacteristic HrCharacteristic        ("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead);
BLEIntCharacteristic AccxCharacteristic      ("19B10001-E8F2-537E-4F6C-D104768A1215", BLERead);
BLEIntCharacteristic AccyCharacteristic      ("19B10001-E8F2-537E-4F6C-D104768A1216", BLERead);
BLEIntCharacteristic AcczCharacteristic      ("19B10001-E8F2-537E-4F6C-D104768A1217", BLERead);

void setup() {
  pinMode(PowerPin, OUTPUT);
  digitalWrite(PowerPin, HIGH);

  Serial.begin(9600);
  delay(2000);
  Serial.println("Sensor-Plattform gestartet");

  if (!IMU.begin()) {
    Serial.println("IMU-Initialisierung fehlgeschlagen!");
    while (1);
  }
  if (!BLE.begin()) {
    Serial.println("BLE-Initialisierung fehlgeschlagen!");
    while (1);
  }

  BLE.setLocalName("SpiderClip_Sensor");
  BLE.setAdvertisedService(sensorService);

  sensorService.addCharacteristic(HrCharacteristic);
  sensorService.addCharacteristic(ConfidenceCharacteristic);
  sensorService.addCharacteristic(OxygenCharacteristic);
  sensorService.addCharacteristic(AccxCharacteristic);
  sensorService.addCharacteristic(AccyCharacteristic);
  sensorService.addCharacteristic(AcczCharacteristic);

  BLE.addService(sensorService);
  HrCharacteristic.writeValue(0);
  ConfidenceCharacteristic.writeValue(0);
  OxygenCharacteristic.writeValue(0);
  AccxCharacteristic.writeValue(0);
  AccyCharacteristic.writeValue(0);
  AcczCharacteristic.writeValue(0);

  BLE.advertise();
  Serial.println("BLE Sensor Peripheral aktiv");
}

void loop() {
  BLEDevice central = BLE.central();
  if (!central) return;

  Serial.print("Verbunden mit: ");
  Serial.println(central.address());

  while (central.connected()) {

    heartrate.getValue(heartratePin);
    uint8_t rate = heartrate.getRate();
    Serial.print("HR: "); Serial.println(rate);
    HrCharacteristic.writeValue(rate);

    Serial.print("Conf: "); Serial.print(body.confidence);
    Serial.print("  O2: ");   Serial.println(body.oxygen);
    ConfidenceCharacteristic.writeValue(body.confidence);
    OxygenCharacteristic.writeValue(body.oxygen);

    float x, y, z;
    if (IMU.accelerationAvailable()) {
      IMU.readAcceleration(x, y, z);
      int ix = (int)(x * 1000);
      int iy = (int)(y * 1000);
      int iz = (int)(z * 1000);
      Serial.print("Acc (mg): ");
      Serial.print(ix); Serial.print(", ");
      Serial.print(iy); Serial.print(", ");
      Serial.println(iz);

      AccxCharacteristic.writeValue(ix);
      AccyCharacteristic.writeValue(iy);
      AcczCharacteristic.writeValue(iz);
    }

    delay(100);
  }

  Serial.print("Verbindung getrennt: ");
  Serial.println(central.address());
}

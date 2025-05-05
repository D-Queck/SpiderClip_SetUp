#include <ArduinoBLE.h>
    
//for step counting
float vector=0; 
float oldvector =0 ;
int step =0;

// --------------------- Setup ------------------------
void setup() {
Serial.begin(9600);
while (!Serial);
Serial.println("started");
BLE.begin(); // initialize the BLE hardware
Serial.println("BLE Central - LED control");
BLE.scanForUuid("19b10000-e8f2-537e-4f6c-d104768a1214");// start scanning for peripherals
}

// --------------------- Loop ------------------------
void loop() {
BLEDevice peripheral = BLE.available(); // check if a peripheral has been discovered
if (peripheral) { // discovered a peripheral, print out address, local name, and advertised service
Serial.print("Found ");
Serial.print(peripheral.address());
Serial.print(" '");
Serial.print(peripheral.localName());
Serial.print("' ");
Serial.print(peripheral.advertisedServiceUuid());
Serial.println();
if (peripheral.localName() != "LED") {
    return;
}
BLE.stopScan(); // stop scanning
controlLed(peripheral);
BLE.scanForUuid("19b10000-e8f2-537e-4f6c-d104768a1214"); // peripheral disconnected, start scanning again
}
}

// --------------------- BLE Function ------------------------
void controlLed(BLEDevice peripheral) {
Serial.println("Connecting ..."); // connect to the peripheral

if (peripheral.connect()) {
Serial.println("Connected");
} else {
Serial.println("Failed to connect!");
return;
}
// discover peripheral attributes
// Serial.println("Discovering attributes ...");
if (peripheral.discoverAttributes()) {
//Serial.println("Attributes discovered");
} else {
// Serial.println("Attribute discovery failed!");
peripheral.disconnect();
return;
}
// retrieve the LED characteristic
BLECharacteristic ConfidenceCharacteristic = peripheral.characteristic("19b10001-e8f2-537e-4f6c-d104768a1212");
BLECharacteristic OxygenCharacteristic = peripheral.characteristic("19b10001-e8f2-537e-4f6c-d104768a1213");
BLECharacteristic HrCharacteristic = peripheral.characteristic("19b10001-e8f2-537e-4f6c-d104768a1214");
BLECharacteristic AccxCharacteristic= peripheral.characteristic("19B10001-E8F2-537E-4F6C-D104768A1215");
BLECharacteristic AccyCharacteristic= peripheral.characteristic("19B10001-E8F2-537E-4F6C-D104768A1216");
BLECharacteristic AcczCharacteristic= peripheral.characteristic("19B10001-E8F2-537E-4F6C-D104768A1217");

if (!HrCharacteristic) {
// Serial.println("Peripheral does not have LED characteristic!");
peripheral.disconnect();
return;
} else if (!HrCharacteristic.canWrite()) {
//Serial.println("Peripheral does not have a writable LED characteristic!");
peripheral.disconnect();
return;
}

while (peripheral.connected()) {// while the peripheral is connected
float x,y,z =0;
int Hr=0;
int Confidence=0;
int Oxygen=0;
//READ THE CHARACTERISTICS HERE
HrCharacteristic.read();
ConfidenceCharacteristic.read();
OxygenCharacteristic.read();
AccxCharacteristic.read();
AccyCharacteristic.read();
AcczCharacteristic.read();
Hr = returnInt(HrCharacteristic.value()); //TRANSFORM BYTES TO INT
x=0.001*(float) returnInt(AccxCharacteristic.value());
y=0.001*(float) returnInt(AccyCharacteristic.value());
z=0.001*(float) returnInt(AcczCharacteristic.value());
vector = sqrt( x*x + y*y + z*z);
if (abs(vector - oldvector)>0.25)
step++;
oldvector = vector;
Serial.print(step);
//SENDING VALUE TO JSON AREA//*******************************
Serial.print("{");
Serial.print("\"b\":");
Serial.print(Hr);
Serial.print(",");
Serial.print("\"step\":");
Serial.print(step);
Serial.print(",");
Serial.print("\"ax\":");
Serial.print(x);
Serial.print(",");
Serial.print("\"ay\":");
Serial.print(y);
Serial.print(",");
Serial.print("\"az\":");
Serial.print(z);
Serial.println("}");
delay(100);
//***********************************************************
}
Serial.println("Peripheral disconnected");
}

// --------------------- Return Int ------------------------
int returnInt(const unsigned char data[])
{
int a=
(int)data[0]        |
(int)data[1]  << 8  |
(int)data[2]  << 16 |
(int)data[3]  << 24 ; 
return a;
}
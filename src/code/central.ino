#include <ArduinoBLE.h>
#include <math.h>  

float vectorVal  = 0;
float oldVector  = 0;
int   stepCount  = 0;

void setup() {
  Serial.begin(9600);
  while (!Serial);
  
  if (!BLE.begin()) {
    Serial.println("BLE-Initialisierung fehlgeschlagen!");
    while (1);
  }
  Serial.println("BLE Central gestartet");
  // nach dem Sensor-Service scannen
  BLE.scanForUuid("19B10000-E8F2-537E-4F6C-D104768A1214");
}

void loop() {
  BLEDevice peripheral = BLE.available();
  if (peripheral) {
    Serial.print("Gefunden: ");
    Serial.print(peripheral.address());
    Serial.print(" '");
    Serial.print(peripheral.localName());
    Serial.print("' ");
    Serial.println(peripheral.advertisedServiceUuid());
    
    // Nur unseren Sensor verbinden
    if (peripheral.advertisedServiceUuid() == "19b10000-e8f2-537e-4f6c-d104768a1214") {
      BLE.stopScan();
      readSensorData(peripheral);
      BLE.scanForUuid("19B10000-E8F2-537E-4F6C-D104768A1214");
    }
  }
}

void readSensorData(BLEDevice peripheral) {
  Serial.println("Verbinde …");
  if (!peripheral.connect()) {
    Serial.println("Verbindung fehlgeschlagen!");
    return;
  }
  if (!peripheral.discoverAttributes()) {
    Serial.println("Attribute-Discovery fehlgeschlagen!");
    peripheral.disconnect();
    return;
  }

  // Charakteristiken abrufen
  BLECharacteristic confChar = peripheral.characteristic("19B10001-E8F2-537E-4F6C-D104768A1212");
  BLECharacteristic oxyChar  = peripheral.characteristic("19B10001-E8F2-537E-4F6C-D104768A1213");
  BLECharacteristic hrChar   = peripheral.characteristic("19B10001-E8F2-537E-4F6C-D104768A1214");
  BLECharacteristic axChar   = peripheral.characteristic("19B10001-E8F2-537E-4F6C-D104768A1215");
  BLECharacteristic ayChar   = peripheral.characteristic("19B10001-E8F2-537E-4F6C-D104768A1216");
  BLECharacteristic azChar   = peripheral.characteristic("19B10001-E8F2-537E-4F6C-D104768A1217");

  if (!hrChar) {
    Serial.println("HR-Char fehlt!");
    peripheral.disconnect();
    return;
  }

  while (peripheral.connected()) {
    // alle Werte einlesen
    hrChar.read();
    confChar.read();
    oxyChar.read();
    axChar.read();
    ayChar.read();
    azChar.read();

    int   hr    = hrChar.value();
    int   conf  = confChar.value();
    int   oxy   = oxyChar.value();
    float x     = axChar.value() * 0.001;
    float y     = ayChar.value() * 0.001;
    float z     = azChar.value() * 0.001;

    // Schrittzählung
    vectorVal = sqrt(x*x + y*y + z*z);
    if (fabs(vectorVal - oldVector) > 0.25) stepCount++;
    oldVector = vectorVal;

    // JSON auf Serial ausgeben
    Serial.print("{\"b\":");    Serial.print(hr);
    Serial.print(",\"step\":"); Serial.print(stepCount);
    Serial.print(",\"ax\":");   Serial.print(x, 3);
    Serial.print(",\"ay\":");   Serial.print(y, 3);
    Serial.print(",\"az\":");   Serial.print(z, 3);
    Serial.println("}");

    delay(100);
  }

  Serial.print("Verbindung getrennt: ");
  Serial.println(peripheral.address());
}

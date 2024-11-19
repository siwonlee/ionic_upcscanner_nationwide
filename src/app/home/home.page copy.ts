import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  url: string = 'https://upc.wicapl.org/apl/';

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

<<<<<<<<<<<<<<  ✨ Codeium Command 🌟 >>>>>>>>>>>>>>>>
  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
+    let barcodes;
+    try {
+      barcodes = await BarcodeScanner.scan();
+    } catch (e) {
+      console.error(e);
+      return;
-    const { barcodes } = await BarcodeScanner.scan();
-    this.barcodes.push(...barcodes);
-
-    this.url = this.url + barcodes[barcodes.length - 1].rawValue;
-
-    if (barcodes.length > 0) {
-      // await Browser.open({ url: this.url + barcodes[-1].rawValue });
-      await Browser.open({
-        url: this.url,
-      });
    }
+    if (!barcodes) {
+      console.error('barcodes was null or undefined');
+      return;
+    }
+    this.barcodes.push(...barcodes.barcodes);

+    if (barcodes.barcodes.length === 0) {
+      console.error('barcodes.barcodes was empty');
+      return;
+    }
+    const lastBarcode = barcodes.barcodes[barcodes.barcodes.length - 1];
+    if (!lastBarcode) {
+      console.error('lastBarcode was null or undefined');
+      return;
+    }
+    if (!lastBarcode.rawValue) {
+      console.error('lastBarcode.rawValue was null or undefined');
+      return;
+    }
+
+    this.url = this.url + lastBarcode.rawValue;
+
+    await Browser.open({
+      url: this.url
+    });
+
    this.url = '';
    console.log(this.barcodes);
-  }
<<<<<<<  e0a46d50-a064-4ccc-9413-be40294f1f42  >>>>>>>

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}

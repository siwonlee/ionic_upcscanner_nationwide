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
  // url: string = 'https://upc.wicapl.org/apl/';
  // url: string = 'https://nupc.joonspa.com/apl/';
  url: string = 'https://nupc.joonspa.com/apl/';
  state:string = "all";

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    // Check if the Google Barcode Scanner module is available
    BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()
      .then((result) => {
        if (!result.available) {
          BarcodeScanner.installGoogleBarcodeScannerModule();
        } else {
          console.log('Google Barcode Scanner module is available');
        }
      })
      .catch((error) => {
        console.error(
          'Error checking Google Barcode Scanner module availability:',
          error
        );
      });
  }

  async scan(): Promise<void> {
    // const ress = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    // console.log(ress);
    // if (!ress.available) {
    //   await BarcodeScanner.installGoogleBarcodeScannerModule();
    // }

    // async startScan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    // const { barcodes } = await BarcodeScanner.startScan();
    this.barcodes.push(...barcodes);

    this.url = this.url + this.state + '/'+ barcodes[barcodes.length - 1].rawValue;

    if (barcodes.length > 0) {
      // await Browser.open({ url: this.url + barcodes[-1].rawValue });
      await Browser.open({
        url: this.url,
      });
    }
    // url: string = 'https://nupc.joonspa.com/apl/';
    this.url = 'https://nupc.joonspa.com/apl/';
    // this.url = 'https://upc.wicapl.org/apl/';
    console.log(this.barcodes);
    console.log(this.url);
  }

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

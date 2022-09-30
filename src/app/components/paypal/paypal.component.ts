import { Component, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {

  public payPalConfig ?: IPayPalConfig;

  products = [
    {id: 1, name: "Iphone 14", description: "Procesador: Apple A15, 256GB of storage, 6GB of RAM, SO iOS 16", price: 1200, img: "https://www.att.com/idpassets/global/devices/phones/apple/apple-iphone-14-pro-max/carousel/spaceblack/spaceblack-1.png", qty: 0},
    {id: 2, name: "Iphone 7", description: "Apple iPhone 7 a1778, GSM Unlocked, 32GB (Renewed)", price: 128, img: "https://m.media-amazon.com/images/I/717Rq94aAML._AC_SL1500_.jpg", qty: 0},
    {id: 3, name: "Samsung S10", description: "Samsung Galaxy S10, 128GB, Prism Black - Unlocked (Renewed)", price: 172, img: "https://m.media-amazon.com/images/I/41OWroX071L._AC_.jpg", qty: 0},
    {id: 4, name: "Iphone 11", description: "Procesador: Apple A15, 256GB of storage, 6GB of RAM, SO iOS 16", price: 1200, img: "https://www.att.com/idpassets/global/devices/phones/apple/apple-iphone-14-pro-max/carousel/spaceblack/spaceblack-1.png", qty: 0},
    {id: 5, name: "Iphone 8", description: "Apple iPhone 7 a1778, GSM Unlocked, 32GB (Renewed)", price: 128, img: "https://m.media-amazon.com/images/I/717Rq94aAML._AC_SL1500_.jpg", qty: 0},
    {id: 6, name: "Samsung S20", description: "Samsung Galaxy S10, 128GB, Prism Black - Unlocked (Renewed)", price: 172, img: "https://m.media-amazon.com/images/I/41OWroX071L._AC_.jpg", qty: 0},
   

  ]

  itemsCart: any[] = [];


  total = 0;

  Total()
  {
    this.total = 0;
    for (let item of this.itemsCart) {
      this.total += item.price * item.qty;
    }
  }

 

  constructor() { }

  ngOnInit() {
    this.initConfig();
  }

  agregar(item: any)
  {

    let existe = false;

    for(let i = 0; i < this.itemsCart.length; i++)
    {
      if (item.id === this.itemsCart[i].id)
      {
        this.itemsCart[i].qty += 1;
        existe = true;
        break;
      }
    }

    if(!existe)
    {
      item.qty = 1;
      this.itemsCart.push(item);
    }

    this.Total();
    
    
  }

  
  itemsPaypal(): any[]{
    let itemsPaypal: any[] = [];
    let itemPaypal = {};
    for(let item of this.itemsCart)
    {
      itemPaypal = {
        name: item.name,
        quantity: item.qty,
        unit_amount: {
          currency_code: 'USD',
          value: item.price,
        },
      }
      itemsPaypal.push(itemPaypal);
    }

    return itemsPaypal;
  }

  


  private initConfig(): void {
    this.payPalConfig = {
        currency: 'USD',
        clientId: 'AaPF2lcDcJIKf39q_ZgRRLOeefCzSaG1IFTdvgX_XlhhJRWo0JJV4GJ-uO-5sBBVUGAQEvryeUR9ZvJ6',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                  currency_code: 'USD',
                  value: this.total.toString(),
                  breakdown: {
                      item_total: {
                          currency_code: 'USD',
                          value: this.total.toString()
                      }
                  }
              },
              items: this.itemsPaypal()
          }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details: any) => {
              console.log('onApprove - you can get full order details inside onApprove: ', details);
          });
            
        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);

        },
        onError: err => {
            console.log('OnError', err);
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
        }
    };
}


}

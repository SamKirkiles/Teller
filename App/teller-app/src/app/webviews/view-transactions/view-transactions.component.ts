import { Component, OnInit } from '@angular/core';

declare var window: any;
declare var MessengerExtensions: any;


@Component({
  selector: 'app-view-transactions',
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.css']
})
export class ViewTransactionsComponent implements OnInit {

    transactions = ['Uber', 'Food', 'Clothes', 'Pharmacy'];

  constructor() {
      (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.com/en_US/messenger.Extensions.js";
          fjs.parentNode.insertBefore(js, fjs);

          window.extAsyncInit = function() {
              // the Messenger Extensions JS SDK is done loading

              console.log('exit init');
              MessengerExtensions.getContext('427920587581118',
                  function success(result){
                      console.log(result);
                      console.log('That was the psid');
                  },
                  function error(result){
                      console.log(result);
                  }
              );
          };


      }(document, 'script', 'Messenger'));
  }

  ngOnInit() {
  }

}

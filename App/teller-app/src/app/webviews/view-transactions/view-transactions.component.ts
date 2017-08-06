import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http, Headers} from '@angular/http';
import {environment} from '../../../environments/environment';

declare var window: any;
declare var MessengerExtensions: any;


@Component({
  selector: 'app-view-transactions',
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.css'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class ViewTransactionsComponent implements OnInit {

    transactions = [];
    private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private activatedRoute: ActivatedRoute, private http: Http, private ref: ChangeDetectorRef) {
      ((d, s, id) => {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = '//connect.facebook.com/en_US/messenger.Extensions.js';
          fjs.parentNode.insertBefore(js, fjs);

          window.extAsyncInit = () => {
              // the Messenger Extensions JS SDK is done loading

              console.log('exit init');
              MessengerExtensions.getContext('427920587581118',
                  (result) => {

                      const token = this.activatedRoute.snapshot.queryParams.token;


                      this.http.post(environment.apiUrl + '/api/transactions', JSON.stringify({
                          psid: result.psid,
                          token: token
                      }), {headers: this.headers}).toPromise().then(res => {

                          const body = JSON.parse(res['_body']);

                          console.log("Can we make these transactionsw?")
                          if (body.payload.success === true) {
                              console.log('TESTNE')
                              this.transactions = body.payload.results.transactions;
                              console.log(body.payload.results.transactions);
                              this.ref.detectChanges();
                          }else {
                              console.log(body.error.errorMessage);
                          }


                      });
                  },
                  (result) => {
                  // error here
                      console.log(result);
                  }
              );
          };
      })(document, 'script', 'Messenger');
  }

  ngOnInit() {
  }

}

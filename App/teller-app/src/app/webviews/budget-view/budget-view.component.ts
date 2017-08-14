import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Headers, Http} from "@angular/http";
import {environment} from '../../../environments/environment';
import {isNullOrUndefined} from "util";

//The security of this class at this point is unsafe

@Component({
  selector: 'app-budget-view',
  templateUrl: './budget-view.component.html',
  styleUrls: ['./budget-view.component.css']
})
export class BudgetViewComponent implements OnInit {

    private headers = new Headers({'Content-Type': 'application/json'});

    budgets = ['budget'];
    error = false;


    constructor(private route: ActivatedRoute, private http: Http, private ref: ChangeDetectorRef) {

        const id = this.route.snapshot.queryParams.messengerID;
        if (!isNullOrUndefined(id)){
            this.http.post(environment.apiUrl + '/api/budgets', JSON.stringify({
                messengerID: id
            }), {headers: this.headers}).toPromise().then(res => {

                const body = JSON.parse(res['_body']);

                if (body.payload.success === true) {
                    this.budgets = body.payload.results;
                    console.log(body.payload.results);
                    this.ref.detectChanges();
                }else {
                    this.error = true;
                    console.log(body);
                    this.ref.detectChanges();
                }


            });
        } else {
            console.log("There was no query parameter");
            this.error = true;
        }


    }

    ngOnInit() {


    }

}

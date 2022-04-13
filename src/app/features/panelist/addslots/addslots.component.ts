
import { Component } from "@angular/core";
import { DatePipe } from "@angular/common";
import {
  NgbCalendar,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDate,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AddslotsService } from "./addslots.service";
import { stringify } from "querystring";
import { convertCompilerOptionsFromJson } from "typescript";

@Component({
  selector: "app-addslots",
  templateUrl: "./addslots.component.html",
  styleUrls: ["./addslots.component.scss"],
})
export class AddslotsComponent {
  repeatMode = "never";
  slotDate: NgbDate;
  fromDate: NgbDate;

  Slots = [
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
  ];
  DaysOfWeek = {
    Monday: "M",
    Tuesday: "T",
    Wednesday: "W",
    Thursday: "T",
    Friday: "F",
    Saturday: "S",
    Sunday: "S",
  };
  selectDay: string | null;
  formData!: FormGroup;
  user: any = {};
  
  constructor(
    private config: NgbDatepickerConfig,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private fb: FormBuilder,
    private addslots: AddslotsService,
    public datepipe: DatePipe
  ) {
    this.disableMonths(config);

    this.slotDate = calendar.getToday();
    console.log(this.slotDate);
    this.selectDay = this.getDayfromDate();
    //this.formData = new FormGroup({
      //slotDate: new FormControl(this.slotDate),
      //fromTimeSlot: new FormControl('', [Validators.required]),
      //toTimeSlot: new FormControl('', [Validators.required]),
      //repeatMode: new FormControl(this.repeatMode),
      
    //});
    this.createAddslotForm();
  }
  createAddslotForm(){
    this.formData = this.fb.group({
      date: [this.slotDate],
      time: [null, [Validators.required]]
      }
      //  repeatMode: [this.repeatMode, [Validators.required]]}  
    )
  }

  get time(){
    return this.formData.get('time');
  }

  get date() {
    return this.formData.get("date");
  }



  //only enable dates from today to last day of next month
  disableMonths(config: NgbDatepickerConfig) {
    let startDate = new Date(),
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0);
    console.log(startDate, endDate);
    config.minDate = {
      year: startDate.getFullYear(),
      month: startDate.getMonth() + 1,
      day: startDate.getDate(),
    };
    config.maxDate = {
      year: startDate.getFullYear(),
      month: endDate.getMonth() + 1,
      day: endDate.getDate(),
    };
    config.outsideDays = "hidden";
  }

  onSlotDateChange(e: any) {
    this.slotDate = e;
    this.selectDay = this.getDayfromDate();
  }

  onRepeatModeChange(e: any) {
    this.repeatMode = e.target.value;
  }

  //format date in format yyyy-mm-dd
  formatDateToString(date: any) {
    return date.year + "-" + date.month + "-" + date.day;
  }

  //get name of weekday from slotdate
  getDayfromDate() {
    let days = Object.keys(this.DaysOfWeek);
    let date = new Date(this.slotDate.year, this.slotDate.month-1, this.slotDate.day);
    let weeknumber = (date.getDay() + 6 ) % 7;
    return days[weeknumber];
  }
  
  //sortNull for keeping original order of keyvalue in ngFor for DaysOfWeek
  sortNull() {
    return 0;
  }

  getDaysRecurrence(start, end, dayName){
    var result = [];
    var days = {sun:0,mon:1,tue:2,wed:3,thu:4,fri:5,sat:6};
    var day = days[dayName.toLowerCase().substr(0,3)];
    var current = new Date(start);
    current.setDate(current.getDate() + (day - current.getDay() + 7) % 7);
    while (current <= end) {
      result.push(new Date(+current));
      current.setDate(current.getDate() + 7);
    }
    return result;
  }

  getAllDays(start, end){
    var result1 = [];
    var current = new Date(start);
    current.setDate(current.getDate());

    while(current <= end) {
      result1.push(new Date(+current));
      current.setDate(current.getDate()+1);
    }
    return result1;
  }

  onClickSubmit(data: any) {
    let res = [];
    let res1 = [];
    this.formData.setValue(data);
    this.formData.setControl(
      "date",
      new FormControl(this.formatDateToString(this.slotDate))
    );
    
    console.log("FORM DATA", this.formData.getRawValue());


    
    //console.log(this.getDaysRecurrence(new Date(2022,3,8),new Date(2022,3,30), 'Wed'));
    //let date = new Date(this.slotDate.year, this.slotDate.month-1, this.slotDate.day);
    //console.log(date.getDay());
    //const dayN = (dateString) => new Intl.DateTimeFormat('en-Us', { weekday: 'long'}).format(new Date(date));
   // console.log(dayN(date));
    this.user = Object.assign(this.user, this.formData.value);
    this.addslots.addUser(this.user);
    this.addslots.saveUser(this.user)
    .subscribe
    (
      data=>
          {
            this.user = data;
          }
    )
    //localStorage.setItem('Users',JSON.stringify(this.user));
    if (this.repeatMode == 'weekly') {
      let date = new Date(this.slotDate.year, this.slotDate.month-1, this.slotDate.day);
      const dayN = (dateString) => new Intl.DateTimeFormat('en-Us', { weekday: 'long'}).format(new Date(date));
      //console.log(dayN(date));
      this.fromDate = this.calendar.getToday();
      
      //console.log(this.getDaysRecurrence(new Date(),new Date(date.getFullYear(), date.getMonth() + 1, 0), dayN(date)));

      res = this.getDaysRecurrence(new Date(),new Date(date.getFullYear(), date.getMonth() + 1), dayN(date));
      let len = res.length;
      //console.log(len);
      for(let i =1;i<len;i++){
        res[i] = this.datepipe.transform(res[i], 'yyyy-MM-dd');
        //console.log(res[i]);
        this.formData.setControl("date", new FormControl(res[i]));
        this.user = Object.assign(this.user, this.formData.value);
        this.addslots.addUser(this.user);
        console.log("FORM DATA", this.formData.getRawValue());

        this.addslots.saveUser(this.user)
        .subscribe
        (
          data=>
          {
            this.user = data;
          }
        )
      }
      

    } 

    if (this.repeatMode == 'daily') {
      let date = new Date(this.slotDate.year, this.slotDate.month-1, this.slotDate.day);
      res1 = this.getAllDays(new Date(this.slotDate.year, this.slotDate.month-1, this.slotDate.day), new Date(date.getFullYear(), date.getMonth() + 1));
      let len1 = res1.length;
      console.log(len1);
      for(let i =1;i<len1;i++) {
        res1[i] = this.datepipe.transform(res1[i], 'yyyy-MM-dd');
        this.formData.setControl("date", new FormControl(res1[i]));
        this.user = Object.assign(this.user, this.formData.value);
        this.addslots.addUser(this.user);
        console.log("FORM DATA", this.formData.getRawValue());

        this.addslots.saveUser(this.user)
        .subscribe
        (
          data=>
          {
            this.user = data;
          }
        )

        

      }
    }


   /* this.addslots.saveUser(this.user)
    .subscribe
    (
      data=>
      {
        this.user = data;
      }
    )*/

  }
  
}







/*import { Component } from "@angular/core";
import {
  NgbCalendar,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDate,
} from "@ng-bootstrap/ng-bootstrap";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-addslots",
  templateUrl: "./addslots.component.html",
  styleUrls: ["./addslots.component.scss"],
})
export class AddslotsComponent {
  repeatMode = "never";
  slotDate: NgbDate;
  Slots = [
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
  ];
  DaysOfWeek = {
    Monday: "M",
    Tuesday: "T",
    Wednesday: "W",
    Thursday: "T",
    Friday: "F",
    Saturday: "S",
    Sunday: "S",
  };
  selectDay: string | null;
  formData: FormGroup;
  constructor(
    private config: NgbDatepickerConfig,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.disableMonths(config);

    this.slotDate = calendar.getToday();
    console.log(this.slotDate);
    this.selectDay = this.getDayfromDate();
    this.formData = new FormGroup({
      slotDate: new FormControl(this.slotDate),
      fromTimeSlot: new FormControl('', [Validators.required]),
      toTimeSlot: new FormControl('', [Validators.required]),
      repeatMode: new FormControl(this.repeatMode),
    });
  }
  get fromTimeSlot(){
    return this.formData.get('fromTimeSlot');
  }

  get toTimeSlot(){
    return this.formData.get('toTimeSlot');
  }

  //only enable dates from today to last day of next month
  disableMonths(config: NgbDatepickerConfig) {
    let startDate = new Date(),
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0);
    console.log(startDate, endDate);
    config.minDate = {
      year: startDate.getFullYear(),
      month: startDate.getMonth() + 1,
      day: startDate.getDate(),
    };
    config.maxDate = {
      year: startDate.getFullYear(),
      month: endDate.getMonth() + 1,
      day: endDate.getDate(),
    };
    config.outsideDays = "hidden";
  }

  onSlotDateChange(e: any) {
    this.slotDate = e;
    this.selectDay = this.getDayfromDate();
  }

  onRepeatModeChange(e: any) {
    this.repeatMode = e.target.value;
  }

  //format date in format yyyy-mm-dd
  formatDateToString(date: any) {
    return date.year + "-" + date.month + "-" + date.day;
  }

  //get name of weekday from slotdate
  getDayfromDate() {
    let days = Object.keys(this.DaysOfWeek);
    let date = new Date(this.slotDate.year, this.slotDate.month-1, this.slotDate.day);
    let weeknumber = (date.getDay() + 6 ) % 7;
    return days[weeknumber];
  }

  
  //sortNull for keeping original order of keyvalue in ngFor for DaysOfWeek
  sortNull() {
    return 0;
  }

  onClickSubmit(data: any) {
    this.formData.setValue(data);
    this.formData.setControl(
      "slotDate",
      new FormControl(this.formatDateToString(this.slotDate))
    );
    console.log('TIME SLOTS RANGE ', this.timeCheck());
    //alert('TIME SLOTS RANGE '+ this.timeCheck());
    console.log("FORM DATA", this.formData.getRawValue());
  }
  
  //time slots validation
  timeCheck(): string | null {
    const [fromHr, fromMin] = this.formData.get('fromTimeSlot')?.value.split(":").map(Number);
    const [toHr, toMin] = this.formData.get('toTimeSlot')?.value.split(":").map(Number);
    
    if (fromHr > toHr || (fromHr == toHr && fromMin > toMin)){
      return 'INVALID';
    } else {
      return 'VALID';
    }
    return null;
  } 
}*/
// #3f51b5
'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jasmine Sian',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  currency: 'INR',
  locale: 'en-IN',
  movementsDates: [
    '2020-11-18T21:31:17.178Z',
    '2020-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2021-07-11T23:36:17.929Z',
    '2021-10-12T10:51:36.790Z',
  ],
   // de-DE
};

const account2 = {
  owner: 'Aakanksha Sehgal',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  currency: 'USD',
  locale: 'en-US',
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2021-04-10T14:43:26.374Z',
    '2021-06-25T18:49:59.371Z',
    '2021-10-26T12:01:20.894Z',
  ],
  
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
let timerOfCurrentAccount;
//------------------------------------------------display movement for each person on the webpage------------------------------------------------------------------
const displayMovement=function (acc,sort=false)
{
  //console.log(acc.movements);
  let movs=acc.movements;
  if(sort)
  {
    movs=acc.movements.slice().sort(function(a,b)
    {
         return a-b;
    })
  }
  
 containerMovements.innerHTML="";
     movs.forEach((mov,i) => {
      let now=new Date(acc.movementsDates[i]);
      let daysPassed=Math.abs((new Date()-now)/(1000*60*60*24));
      daysPassed=Math.floor(daysPassed);
      //console.log(daysPassed);
      let displayDate;
      if(daysPassed==0)
      {
        displayDate='Today';
      }
      else if(daysPassed==1)
      {
        displayDate='Yesterday';
      }
      else if(daysPassed<=30)
      {
        displayDate=`${daysPassed} days ago`;
      }
      else
      {
        
        displayDate=new Intl.DateTimeFormat(
          currentAccount.locale
          ).format(now);
         // console.log(currentAccount.locale);
      }
      const formattedAmount=new Intl.NumberFormat(acc.locale,{
        style:'currency',
        currency: acc.currency,
      }).format(mov);
      //console.log(now);
       
       const type = mov>0?'deposit':'withdrawal';
      const html=`<div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
     <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedAmount}</div>
    </div>`;
       containerMovements.insertAdjacentHTML('afterbegin',html); 
  });
}

//-----------------------------------------------------create shortforms of usernames------------------------------------------------------------------------
const createusernames=function(accs)
{
  let usernameshort=[];
  for(let x of accs)
  {
    //console.log(x.owner.split(' '));
      let user=x.owner.toLowerCase().split(' ');
      let sn='';
      user.forEach(function(name)
      {
        name=name[0];
        sn+=(name);
      })
      x.username=sn;
      //console.log(sn);
        }
      return usernameshort;
}
createusernames(accounts);
//console.log(accounts);
//----------------------------------------------------------logout timer-------------------------------------------------------------------------------------
const startLogoutTimer=function()
{
  let time=300;
  function intervalhelper()
  {
    let min=String(Math.floor(time/60)).padStart(2,0);
    let sec=String(time%60).padStart(2,0);
    labelTimer.textContent=`${min}:${sec}`;
    
    if(time==0)
    {
      labelWelcome.textContent='Log in to get started';

      containerApp.style.opacity=0;
    clearInterval(timer);
    }
    time--;
  }
  intervalhelper();
  let timer=setInterval(intervalhelper, 1000);
  return timer;
}
//-----------------------------------------------------------balance calculation-------------------------------------------------------------------------------
function calcPrintBalance(acc)
{
   let balance=acc.movements.reduce(function(ini,mov)
    {
      return ini+mov;
    },0);
    acc.balance=balance;
    console.log(acc);
    const formattedAmount=new Intl.NumberFormat(acc.locale,{
      style:'currency',
      currency: acc.currency,
    }).format(balance);
    return formattedAmount;
    //console.log(balance);
}
//--------------------------------------------------calculate and display deposit,withdrawl,interest----------------------------------------------------------
let calcDisplaySummarry=function(acc)
{
  let movements=acc.movements;
  let dep=movements.filter(mov=>mov>0);
  //console.log(dep);
  if(dep.length)
  {
  dep=dep.reduce((prev,mov)=>{
    return prev+mov;
  });
} 
else 
dep=0;
acc.in=dep;
  //console.log(dep);
  let formattedAmount=new Intl.NumberFormat(acc.locale,{
    style:'currency',
    currency: acc.currency,
  }).format(dep.toFixed(2));
  labelSumIn.textContent=`${formattedAmount}`;
  let wit=movements.filter(mov=>mov<0)
  //console.log(wit.length);
  
  if(wit.length)
  {wit=wit.reduce((prev,mov)=>
  {
    return prev+mov;
  })
  
}
else 
  wit=0;
  acc.out=Math.abs(wit);
  formattedAmount=new Intl.NumberFormat(acc.locale,{
    style:'currency',
    currency: acc.currency,
  }).format(Math.abs(wit).toFixed(2));
  labelSumOut.textContent=`${formattedAmount}`;
  let inte=movements.filter(mov=>mov>0).reduce((prev,mov)=>
  {
    let interes=(mov*currentAccount.interestRate)/100;
    if(interes<1)
    return prev;
    else 
    return prev+interes;
  },0);
  formattedAmount=new Intl.NumberFormat(acc.locale,{
    style:'currency',
    currency: acc.currency,
  }).format(inte.toFixed(2));
  labelSumInterest.textContent=`${formattedAmount}`;
  acc.interest=inte;
}


//--------------------------------------------------------------------------Login-----------------------------------------------------------------------

let currentAccount;
btnLogin.addEventListener('click',function(event)
{
  event.preventDefault();
  //console.log("login");
  let en=inputLoginUsername.value;
  let ep=inputLoginPin.value;
  ep=Number(ep);
  currentAccount=accounts.find(function(acc)
  {
    return (acc.username==en&&acc.pin==ep);

  });
  if(currentAccount)
  {
    inputLoginPin.value=inputLoginUsername.value='';
    
    labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    calcDisplaySummarry(currentAccount);
   let balance=calcPrintBalance(currentAccount);
    labelBalance.textContent=`${balance}`;
    displayMovement(currentAccount);
    containerApp.style.opacity=100;
    let now=new Date();
    const options={
      hour:'numeric',
      minute:'numeric',
      day:'numeric',
      month:'numeric',
      year:'numeric'
    };
    labelDate.textContent=new Intl.DateTimeFormat(
      currentAccount.locale,
      options
      ).format(now);
      if(timerOfCurrentAccount)
      clearInterval(timerOfCurrentAccount);
     timerOfCurrentAccount= startLogoutTimer();
      //console.log(currentAccount.locale);
  }
});
//----------------------------------------------------------------------------------------Transfer-------------------------------------------------------
  btnTransfer.addEventListener('click',function(event)
  {
    
    event.preventDefault();
    let amt=Number(inputTransferAmount.value);
    let person=accounts.find(function(acc)
    {
             return inputTransferTo.value==acc.username;
    });
    inputTransferTo.value=inputTransferAmount.value='';
       if(!person||amt<0||currentAccount.balance<amt||person==currentAccount)
       {
         console.log('wrong name');
         return;
       }
       
    
    //console.log(person,amt,currentAccount.balance);
    if(amt<=currentAccount.balance)
    {
      currentAccount.movements.push(-amt);
      currentAccount.movementsDates.push(new Date());
      let now=new Date();
      let daysPassed=Math.abs((new Date()-now)/(1000*60*60*24));
      daysPassed=Math.floor(daysPassed);
      //console.log(daysPassed);
      let displayDate;
      if(daysPassed==0)
      {
        displayDate='Today';
      }
      else if(daysPassed==1)
      {
        displayDate='Yesterday';
      }
      else if(daysPassed<=30)
      {
        displayDate=`${daysPassed} days ago`;
      }
      else
      {
      let day=`${now.getDate()}`.padStart(2,0);
  let month=`${now.getMonth()+1}`.padStart(2,0);
  let year=now.getFullYear();
  displayDate=`${day}/${month}/${year}`;
      }
      //console.log(now);
      const formattedAmount=new Intl.NumberFormat(currentAccount.locale,{
        style:'currency',
        currency: currentAccount.currency,
      }).format(amt);

       const type = 'withdrawal';
      const html=`<div class="movements__row">
      <div class="movements__type movements__type--${type}">${currentAccount.movements.length} ${type}</div>
     <div class="movements__date">${displayDate}</div>
      <div class="movements__value">-${formattedAmount}</div>
    </div>`;
       containerMovements.insertAdjacentHTML('afterbegin',html); 
       
    }
    
      //console.log(person);
    currentAccount.balance-=amt;
    let formattedAmount=new Intl.NumberFormat(currentAccount.locale,{
      style:'currency',
      currency: currentAccount.currency,
    }).format(currentAccount.balance.toFixed(2));
    labelBalance.textContent=`${formattedAmount}`;
    person.movements.push(amt);
    person.movementsDates.push(new Date());
    calcPrintBalance(person);
    //console.log(person);
    currentAccount.out+=amt;
    formattedAmount=new Intl.NumberFormat(currentAccount.locale,{
      style:'currency',
      currency: currentAccount.currency,
    }).format(currentAccount.out.toFixed(2));
    console.log(formattedAmount);
    //let s2=formattedAmount.substr(1,formattedAmount.length);
    //console.log(s2);
    //console.log(parseInt(s2));
    //console.log(Math.abs(parseInt(s2)));
    labelSumOut.textContent=`${(formattedAmount)}`;
    clearInterval(timerOfCurrentAccount);
    timerOfCurrentAccount=startLogoutTimer();
  })
  //------------------------------------------------------------account deletion-----------------------------------------------------------------------------
  btnClose.addEventListener('click',function(event)
  {
     event.preventDefault();
     if(inputCloseUsername.value==currentAccount.username&&inputClosePin.value==currentAccount.pin)
     {
       let ind=accounts.findIndex(function(acc)
       {
         return acc.username==currentAccount.username;
       });
       accounts.splice(ind,1);

     }
     inputClosePin.value=inputCloseUsername.value='';
     containerApp.style.opacity=0;

       
  })
  //-------------------------------------------------------------loan--------------------------------------------------------------------------
  btnLoan.addEventListener('click',function(event)
  {
       event.preventDefault();
       
       let app=currentAccount.movements.some(function(amt)
       {
         return Number(inputLoanAmount.value)*0.1<=amt;
       });
       if(app)
       {
         setTimeout (function(){
         currentAccount.movements.push(Math.floor(Number(inputLoanAmount.value)));
         let balance=calcPrintBalance(currentAccount);
    labelBalance.textContent=`${balance}`;
    currentAccount.movementsDates.push(new Date());
         calcDisplaySummarry(currentAccount);
         displayMovement(currentAccount);
         inputLoanAmount.value="";}
        ,3000);
       }
       clearInterval(timerOfCurrentAccount);
    timerOfCurrentAccount=startLogoutTimer();

  });
  //------------------------------------------------------------sorting------------------------------------------------------------------------
  let clicksort=false;
  btnSort.addEventListener('click',function(event)
  {
    event.preventDefault();
    
    displayMovement(currentAccount,!clicksort);
    clicksort=!clicksort;
  })
  
  
  /*for(let it of accounts)
  {
    //console.log(en,ep,it.username,it.pin);
  if (en==it.username&&ep==it.pin)
  {
    //console.log(it);
      account=it;
  }
  }
  if(account!=undefined)
  {
    console.log(account);
  }
  else 
  console.log("wrong");*/

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
*/
/////////////////////////////////////////////////

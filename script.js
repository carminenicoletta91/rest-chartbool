function init() {
    console.log("Hello World");
    $(".select-salesman select#salesman").val("reset");
    $(".select-month select#month").val("reset");
    $(".input input").val("")
    $(".input button").click(getvalueforPost);
    getammountfordate();
    getamountforsalesname();
    getgraphbar();
}

$(document).ready(init);
function venditeforquarter(data){
  console.log(data);
}
function getmonthlist(){
  var month= ["gennaio",
              "febbraio",
              "marzo",
              "aprile",
              "maggio",
              "giugno",
              "luglio",
              "agosto",
              "settembre",
              "ottobre",
              "novembre",
              "dicembre"];
  // console.log(month);
  return month;
}
function getname(data){
  var namelist=[];
  var namedata;
  for(var i=0;i<data.length;i++){
    if(namelist.includes(data[i].salesman)){
      // console.log("è incluso ");
    }else{
    // console.log(data[i].salesman,"i:",i);
    namelist.push(data[i].salesman);
    }
    // console.log(namelist);

}
console.log(namelist);
return namelist;
}
function getamountotal(data){

  var amounttotal=0;
  for(var i=0;i<data.length;i++){
    amounttotal=amounttotal+Number(data[i].amount);
  }

  return amounttotal;
}
function getammount(data){
  var monthnumber;
  var monthparse;
  var ammount;
  var monthammount=new Array(12).fill(0);
  for(var i=0;i<data.length;i++){
    monthnumber=data[i].date;
    monthparse=moment(monthnumber,"DD/MM/YYYY").month();
    ammount=Number(data[i].amount);
    monthammount[monthparse]+=ammount;

  }

  // console.log(monthammount);
  return monthammount;
}
function getammountforname(data){
  var dipendenti ={
    name:[],
    ammontare:[]
  };
  for(var i=0;i<data.length;i++){

    if(!dipendenti.name.includes(data[i].salesman)){
      dipendenti.name.push(data[i].salesman);
      dipendenti.ammontare.push(0);
    }

    for(var j=0;j<dipendenti.name.length;j++){
      // console.log(data[i].salesman);
      // console.log(dipendenti[j].name,"nome");
      if(data[i].salesman==dipendenti.name[j]){
        // console.log("sei qui");
        dipendenti.ammontare[j]+=Number(data[i].amount);
      }
    }
  }

  return dipendenti;
}
function readamount(obj,amounttotal){
  var amount=[];
  // console.log(obj.name);
  // console.log(obj.ammontare);
  for(var i=0;i<obj.name.length;i++){
    amount.push(((obj.ammontare[i]/amounttotal)*100).toFixed(2));

  }
  return amount;
}
function getammountfordate(){

  $.ajax({
    url:"http://157.230.17.132:4012/sales",
    method:"GET",
    success:function(data){
      var amountformonth=getammount(data);
      var months=getmonthlist();
      var ctx = document.getElementById('myChartline').getContext('2d');
      var myChart = new Chart(ctx, {
        type:'line',
        data: {
        labels: months,
        datasets: [{
            label: 'Amount',
            data: amountformonth,
            backgroundColor:"rgba(0,139,139,0.2)",
            borderColor: 'rgba(0,0,139,1)',
            borderWidth: 1
        }]
    },
  });

    },
    error:function(){
      alert("error");
    },
  })
}
function getamountforsalesname(){
  $.ajax({
    url:"http://157.230.17.132:4012/sales",
    method:"GET",
    success:function(data){
      var dipendenti=getammountforname(data);
      console.log(dipendenti);
      var ammounttotal=getamountotal(data);
      console.log(ammounttotal);
      var percentua=readamount(dipendenti,ammounttotal);
      console.log(percentua);
      var namesales=getname(data);
      var ctx = document.getElementById('myChart-pie').getContext('2d');
      var myChart = new Chart(ctx, {
        type:'pie',
        data: {
        labels: namesales,
        datasets: [{
            label: 'Amount',
            data: percentua,
            backgroundColor:["rgba(0,139,139,1)",
              "red",
              "orange",
              "green"
              ],

            borderColor: 'rgba(0,0,139,1)',
            borderWidth: 1
        }]
    },
  });

    },
    error:function(){
      alert("error");
    },
  });
}
// function checkvalue(name,month,amount){
//   if(name==="reset"||month==="reset"|| isNaN(amount){
//     console.log("dati errati");
//   }
// }
function getvalueforPost(){
  var namevalue=$(".select-salesman select#salesman").val();

  var monthvalue=$(".select-month select#month").val();
  var monthString="01/"+monthvalue+"/2017";
  // console.log(monthvalue);
  var amountinput=$(".input input").val();
  console.log(amountinput);
  var parseamount=Number(amountinput);
  console.log(parseamount);
  // console.log("name:",namevalue,"month:",monthvalue,"amount:",parseamount);
  if(namevalue==="reset"||monthvalue==="reset"|| isNaN(parseamount)){
    alert("Dati Errati");
    if(namevalue==="reset"){
      alert("Membro Non Selezionato Correttamente")

    }else if(monthvalue==="reset"){
      alert("Mese Non Selezionato Correttamente")
    }
    else if(isNaN(parseamount)){
      alert("Ammontare non corrisponde a un numero")
    }
  }else{
    $.ajax({
      url:"http://157.230.17.132:4012/sales",
      method:"POST",
      data:{
        salesman:namevalue,
        amount:parseamount,
        date:monthString,
      },
      success:function(data){
        // console.log(data);
        $(".select-salesman select#salesman").val("reset");
        $(".select-month select#month").val("reset");
        $(".input input").val("");
        location.reload();
      },
      error:function(error){
        alert("error");
      },
    });
  }
}
function getSalesNumberForQuarter(data){
  var quarterobj=new Object;
  quarterobj.amountq1=0;
  quarterobj.amountq2=0;
  quarterobj.amountq3=0;
  quarterobj.amountq4=0;
  var monthnumber;
  var monthparse;
  for (var i=0;i<data.length;i++){
    monthnumber = data[i].date;
    // console.log(monthnumber);
    monthparse =moment(monthnumber,"DD/MM/YYYY").month();
    // console.log(monthparse);
    switch (monthparse) {
      //mesi da gennaio a marzo q1
      case 0:
      case 1:
      case 2:
        quarterobj.amountq1+=1;
      break;
      //mesi da aprile a giugno q2
      case 3:
      case 4:
      case 5:
        quarterobj.amountq2+=1;
      break;
      //mesi da luglio a settembre q3
      case 6:
      case 7:
      case 8:
        quarterobj.amountq3+=1;
      break;
      //mesi da ottobre a dicembre q4
      case 9:
      case 10:
      case 11:
        quarterobj.amountq4+=1;
      break;
    }
  }
  console.log(quarterobj);
  return quarterobj;
}
function getgraphbar(){
  $.ajax({
    url:"http://157.230.17.132:4012/sales",
    method:"GET",
    success:function(data){
      var objnumerovendite=getSalesNumberForQuarter(data);
      console.log(objnumerovendite,"oggetto in success");
      var q1=Number(objnumerovendite.amountq1);
      var q2=Number(objnumerovendite.amountq2);
      var q3=Number(objnumerovendite.amountq3);
      var q4=Number(objnumerovendite.amountq4);
      console.log("q1:",q1,"q2:",q2,"q3:",q3,"q4",q4);
      var ctx = document.getElementById('myChart-bar').getContext('2d');
      var myChart = new Chart(ctx, {
        type:'bar',
        data: {
        labels: ["q1","q2","q3","q4"],
        datasets: [{
            label: 'Vendite for quarter',
            data: [q1,q2,q3,q4],
            backgroundColor:"rgba(0,139,139,0.5)",
            borderColor: 'rgba(0,0,139,1)',
            borderWidth: 1
        }]
      },
        options: {
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            },
          },

      });
    },
    error:function(){
      alert("errore");
    },
  });
}

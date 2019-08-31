function init() {
    console.log("Hello World");

    $(".input button").click(getvalueforPost);
    getammountfordate();
    getamountforsalesname();
}

$(document).ready(init);

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
  console.log(month);
  return month;
}
function getname(data){
  var namelist=[];
  var namedata;
  for(var i=0;i<data.length;i++){
    if(namelist.includes(data[i].salesman)){
      console.log("è incluso ");
    }else{
    console.log(data[i].salesman,"i:",i);
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

  console.log(monthammount);
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
        console.log("sei qui");
        dipendenti.ammontare[j]+=Number(data[i].amount);
      }
    }
  }

  return dipendenti;
}
function readamount(obj,amounttotal){
  var amount=[];
  console.log(obj.name);
  console.log(obj.ammontare);
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

function getvalueforPost(){
  var namevalue=$(".select-salesman select#salesman").val();

  var monthvalue=$(".select-month select#month").val();
  var monthString="01/"+monthvalue+"/2017";
  console.log(monthvalue);
  var amountinput=$(".input input").val();
  console.log(amountinput);
  var parseamount=Number(amountinput);
  console.log("name:",namevalue,"month:",monthvalue,"amount:",parseamount);

  $.ajax({
    url:"http://157.230.17.132:4012/sales",
    method:"POST",
    data:{
      salesman:namevalue,
      amount:parseamount,
      date:monthString,
    },
    success:function(data){
      console.log(data);
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
